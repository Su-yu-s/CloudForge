#include "modern_ransac_refiner.h"

#include <Eigen/Dense>
#include <algorithm>
#include <cmath>
#include <functional>
#include <numeric>

namespace {

using Getter = std::function<Eigen::Vector3d(size_t)>;

double median(std::vector<double> values) {
    if (values.empty()) return 0.0;
    const size_t mid = values.size() / 2;
    std::nth_element(values.begin(), values.begin() + mid, values.end());
    double result = values[mid];
    if ((values.size() & 1U) == 0U) {
        std::nth_element(values.begin(), values.begin() + mid - 1, values.end());
        result = 0.5 * (result + values[mid - 1]);
    }
    return result;
}

double robustScale(const std::vector<double>& residuals, double floorValue) {
    if (residuals.empty()) return floorValue;
    const double med = median(residuals);
    std::vector<double> deviations;
    deviations.reserve(residuals.size());
    for (double r : residuals) deviations.push_back(std::abs(r - med));
    return std::max(floorValue, 1.4826 * median(std::move(deviations)));
}

std::vector<double> tukeyWeights(const std::vector<double>& residuals, double sigma) {
    std::vector<double> weights(residuals.size(), 0.0);
    const double cutoff = std::max(4.685 * sigma, 1e-12);
    for (size_t i = 0; i < residuals.size(); ++i) {
        const double u = residuals[i] / cutoff;
        if (u < 1.0) {
            const double t = 1.0 - u * u;
            weights[i] = t * t;
        }
    }
    return weights;
}

bool fitPlane(const Getter& point, size_t count, const std::vector<double>& weights,
              Eigen::Vector4d& model) {
    double weightSum = 0.0;
    Eigen::Vector3d center = Eigen::Vector3d::Zero();
    for (size_t i = 0; i < count; ++i) {
        const double w = weights.empty() ? 1.0 : weights[i];
        center += w * point(i); weightSum += w;
    }
    if (weightSum <= 1e-9) return false;
    center /= weightSum;
    Eigen::Matrix3d covariance = Eigen::Matrix3d::Zero();
    for (size_t i = 0; i < count; ++i) {
        const double w = weights.empty() ? 1.0 : weights[i];
        const Eigen::Vector3d delta = point(i) - center;
        covariance.noalias() += w * delta * delta.transpose();
    }
    Eigen::SelfAdjointEigenSolver<Eigen::Matrix3d> solver(covariance);
    if (solver.info() != Eigen::Success) return false;
    Eigen::Vector3d normal = solver.eigenvectors().col(0).normalized();
    if (model.head<3>().dot(normal) < 0.0) normal = -normal;
    model << normal, -normal.dot(center);
    return true;
}

bool fitSphere(const Getter& point, size_t count, const std::vector<double>& weights,
               Eigen::Vector4d& model) {
    Eigen::Matrix4d normal = Eigen::Matrix4d::Zero();
    Eigen::Vector4d rhs = Eigen::Vector4d::Zero();
    for (size_t i = 0; i < count; ++i) {
        const Eigen::Vector3d p = point(i);
        const double w = weights.empty() ? 1.0 : weights[i];
        Eigen::Vector4d row; row << 2.0 * p.x(), 2.0 * p.y(), 2.0 * p.z(), 1.0;
        normal.noalias() += w * row * row.transpose();
        rhs.noalias() += w * row * p.squaredNorm();
    }
    Eigen::LDLT<Eigen::Matrix4d> solver(normal);
    if (solver.info() != Eigen::Success) return false;
    const Eigen::Vector4d solved = solver.solve(rhs);
    const double radiusSquared = solved.head<3>().squaredNorm() + solved[3];
    if (!solved.allFinite() || radiusSquared <= 0.0) return false;
    model << solved.head<3>(), std::sqrt(radiusSquared);
    return true;
}

bool normalizeNonlinearModel(DetectedShape::Type type, Eigen::VectorXd& model) {
    int axisOffset = -1;
    if ((type == DetectedShape::CYLINDER || type == DetectedShape::CONE) && model.size() >= 7)
        axisOffset = 3;
    else if (type == DetectedShape::TORUS && model.size() >= 8)
        axisOffset = 5;
    else
        return false;

    Eigen::Vector3d axis = model.segment<3>(axisOffset);
    if (!axis.allFinite() || axis.norm() < 1e-10) return false;
    model.segment<3>(axisOffset) = axis.normalized();
    if (type == DetectedShape::CYLINDER) {
        model[6] = std::max(std::abs(model[6]), 1e-9);
    } else if (type == DetectedShape::CONE) {
        model[6] = std::clamp(std::abs(model[6]), 0.005, 1.55);
    } else {
        model[0] = std::max(std::abs(model[0]), 1e-9);
        model[1] = std::max(std::abs(model[1]), model[0] + 1e-9);
    }
    return model.allFinite();
}

double signedNonlinearResidual(DetectedShape::Type type, const Eigen::VectorXd& model,
                               const Eigen::Vector3d& p) {
    if (type == DetectedShape::CYLINDER && model.size() >= 7) {
        const Eigen::Vector3d q = p - model.segment<3>(0);
        const Eigen::Vector3d axis = model.segment<3>(3);
        return (q - q.dot(axis) * axis).norm() - model[6];
    }
    if (type == DetectedShape::CONE && model.size() >= 7) {
        const Eigen::Vector3d q = p - model.segment<3>(0);
        const Eigen::Vector3d axis = model.segment<3>(3);
        const double axial = q.dot(axis);
        return (q - axial * axis).norm() - std::abs(axial) * std::tan(model[6]);
    }
    if (type == DetectedShape::TORUS && model.size() >= 8) {
        const Eigen::Vector3d q = p - model.segment<3>(2);
        const Eigen::Vector3d axis = model.segment<3>(5);
        const double axial = q.dot(axis);
        const double radial = (q - axial * axis).norm();
        return std::hypot(radial - model[1], axial) - model[0];
    }
    return 1e30;
}

bool fitNonlinearPrimitive(DetectedShape& shape, const Getter& point, size_t count,
                           double span, int& completedIterations) {
    const int parameterCount = shape.type == DetectedShape::TORUS ? 8 : 7;
    if (!shape.coefficients || shape.coefficients->values.size() < parameterCount)
        return false;

    Eigen::VectorXd model(parameterCount);
    for (int j = 0; j < parameterCount; ++j) model[j] = shape.coefficients->values[j];
    if (!normalizeNonlinearModel(shape.type, model)) return false;

    std::vector<double> signedResiduals(count), absoluteResiduals(count), weights(count, 1.0);
    const double sigmaFloor = std::max(1e-9, span * 1e-6);
    completedIterations = 0;

    for (int iteration = 0; iteration < 7; ++iteration) {
        for (size_t i = 0; i < count; ++i) {
            signedResiduals[i] = signedNonlinearResidual(shape.type, model, point(i));
            absoluteResiduals[i] = std::abs(signedResiduals[i]);
        }
        const double sigma = robustScale(absoluteResiduals, sigmaFloor);
        weights = tukeyWeights(absoluteResiduals, sigma);

        Eigen::MatrixXd hessian = Eigen::MatrixXd::Zero(parameterCount, parameterCount);
        Eigen::VectorXd gradient = Eigen::VectorXd::Zero(parameterCount);
        double baseCost = 0.0;
        for (size_t i = 0; i < count; ++i) {
            const double w = weights[i];
            if (w <= 0.0) continue;
            Eigen::VectorXd jacobian(parameterCount);
            for (int j = 0; j < parameterCount; ++j) {
                const double step = std::max({1e-7, std::abs(model[j]) * 1e-5, span * 1e-7});
                Eigen::VectorXd plus = model, minus = model;
                plus[j] += step;
                minus[j] -= step;
                if (!normalizeNonlinearModel(shape.type, plus)
                    || !normalizeNonlinearModel(shape.type, minus)) {
                    jacobian[j] = 0.0;
                } else {
                    jacobian[j] = (signedNonlinearResidual(shape.type, plus, point(i))
                                   - signedNonlinearResidual(shape.type, minus, point(i)))
                                  / (2.0 * step);
                }
            }
            hessian.noalias() += w * jacobian * jacobian.transpose();
            gradient.noalias() += w * jacobian * signedResiduals[i];
            baseCost += w * signedResiduals[i] * signedResiduals[i];
        }

        const double damping = std::max(1e-10,
            1e-6 * (hessian.trace() / static_cast<double>(parameterCount) + 1.0));
        hessian.diagonal().array() += damping;
        Eigen::VectorXd delta = hessian.ldlt().solve(-gradient);
        if (!delta.allFinite()) break;
        const double maxStep = std::max(0.05, span * 0.1);
        if (delta.norm() > maxStep) delta *= maxStep / delta.norm();

        bool accepted = false;
        for (int attempt = 0; attempt < 6; ++attempt) {
            Eigen::VectorXd candidate = model + delta;
            if (!normalizeNonlinearModel(shape.type, candidate)) {
                delta *= 0.5;
                continue;
            }
            double candidateCost = 0.0;
            for (size_t i = 0; i < count; ++i) {
                const double r = signedNonlinearResidual(shape.type, candidate, point(i));
                candidateCost += weights[i] * r * r;
            }
            if (candidateCost <= baseCost) {
                model = std::move(candidate);
                accepted = true;
                ++completedIterations;
                break;
            }
            delta *= 0.5;
        }
        if (!accepted || delta.norm() < sigmaFloor * 0.01) break;
    }

    if (completedIterations == 0) return false;
    for (int j = 0; j < parameterCount; ++j)
        shape.coefficients->values[j] = static_cast<float>(model[j]);
    return true;
}

double residualFor(const DetectedShape& shape, const Eigen::Vector3d& p) {
    if (!shape.coefficients) return 1e30;
    const auto& v = shape.coefficients->values;
    switch (shape.type) {
    case DetectedShape::PLANE:
        if (v.size() >= 4) {
            const Eigen::Vector3d n(v[0], v[1], v[2]);
            return std::abs(n.dot(p) + v[3]) / std::max(n.norm(), 1e-12);
        }
        break;
    case DetectedShape::SPHERE:
        if (v.size() >= 4)
            return std::abs((p - Eigen::Vector3d(v[0], v[1], v[2])).norm() - v[3]);
        break;
    case DetectedShape::CYLINDER:
        if (v.size() >= 7) {
            Eigen::Vector3d axis(v[3], v[4], v[5]); axis.normalize();
            const Eigen::Vector3d q = p - Eigen::Vector3d(v[0], v[1], v[2]);
            return std::abs((q - q.dot(axis) * axis).norm() - v[6]);
        }
        break;
    case DetectedShape::CONE:
        if (v.size() >= 7) {
            Eigen::Vector3d axis(v[3], v[4], v[5]); axis.normalize();
            const Eigen::Vector3d q = p - Eigen::Vector3d(v[0], v[1], v[2]);
            const double axial = q.dot(axis);
            const double radial = (q - axial * axis).norm();
            return std::abs(radial - std::abs(axial) * std::tan(v[6]));
        }
        break;
    case DetectedShape::TORUS:
        if (v.size() >= 8) {
            Eigen::Vector3d axis(v[5], v[6], v[7]); axis.normalize();
            const Eigen::Vector3d q = p - Eigen::Vector3d(v[2], v[3], v[4]);
            const double axial = q.dot(axis);
            const double radial = (q - axial * axis).norm();
            return std::abs(std::sqrt((radial - v[1]) * (radial - v[1]) + axial * axial) - v[0]);
        }
        break;
    default:
        break;
    }
    return 1e30;
}

bool refineOne(DetectedShape& shape, const Getter& point, size_t count, float span) {
    if (!shape.coefficients || count < 4) return false;
    const double sigmaFloor = std::max(1e-9, static_cast<double>(span) * 1e-6);
    std::vector<double> weights(count, 1.0), residuals(count);
    constexpr int kIterations = 7;

    for (int iteration = 0; iteration < kIterations; ++iteration) {
        bool fitted = true;
        if (shape.type == DetectedShape::PLANE) {
            const auto& v = shape.coefficients->values;
            Eigen::Vector4d model(v[0], v[1], v[2], v[3]);
            fitted = fitPlane(point, count, weights, model);
            if (fitted) shape.coefficients->values = {
                static_cast<float>(model[0]), static_cast<float>(model[1]),
                static_cast<float>(model[2]), static_cast<float>(model[3])};
        } else if (shape.type == DetectedShape::SPHERE) {
            Eigen::Vector4d model;
            fitted = fitSphere(point, count, weights, model);
            if (fitted) shape.coefficients->values = {
                static_cast<float>(model[0]), static_cast<float>(model[1]),
                static_cast<float>(model[2]), static_cast<float>(model[3])};
        } else if (shape.type == DetectedShape::CYLINDER
                   || shape.type == DetectedShape::CONE
                   || shape.type == DetectedShape::TORUS) {
            int completed = 0;
            fitted = fitNonlinearPrimitive(shape, point, count, span, completed);
            shape.refinementIterations = completed;
            break;
        } else {
            break;
        }
        if (!fitted) break;
        for (size_t i = 0; i < count; ++i) residuals[i] = residualFor(shape, point(i));
        const double sigma = robustScale(residuals, sigmaFloor);
        weights = tukeyWeights(residuals, sigma);
        shape.refinementIterations = iteration + 1;
    }

    for (size_t i = 0; i < count; ++i) residuals[i] = residualFor(shape, point(i));
    const double sigma = robustScale(residuals, sigmaFloor);
    double squared = 0.0, score = 0.0;
    const double sigmaMax = std::max(3.0 * sigma, static_cast<double>(span) * 2e-4);
    for (double r : residuals) {
        squared += r * r;
        const double u = r / sigmaMax;
        score += std::exp(-0.5 * u * u);
    }
    shape.rmse = std::sqrt(squared / static_cast<double>(count));
    shape.robustSigma = sigma;
    shape.softScore = score / static_cast<double>(count);
    return std::isfinite(shape.rmse);
}

ModernRansacRefiner::Summary summarize(std::vector<double> rmses,
                                       std::vector<double> sigmas, int refined) {
    ModernRansacRefiner::Summary s;
    s.refinedShapes = refined;
    s.medianRmse = median(std::move(rmses));
    s.medianNoiseSigma = median(std::move(sigmas));
    return s;
}

} // namespace

ModernRansacRefiner::Summary ModernRansacRefiner::refineCloud(
    std::vector<DetectedShape>& shapes, float sceneSpan) {
    std::vector<double> rmses, sigmas;
    int refined = 0;
    for (auto& shape : shapes) {
        if (!shape.inliers || shape.inliers->points.empty()) continue;
        const auto cloud = shape.inliers;
        Getter getter = [cloud](size_t i) {
            const auto& p = cloud->points[i]; return Eigen::Vector3d(p.x, p.y, p.z);
        };
        if (refineOne(shape, getter, cloud->points.size(), sceneSpan)) {
            ++refined; rmses.push_back(shape.rmse); sigmas.push_back(shape.robustSigma);
        }
    }
    return summarize(std::move(rmses), std::move(sigmas), refined);
}

ModernRansacRefiner::Summary ModernRansacRefiner::refineIndexed(
    std::vector<DetectedShape>& shapes, const float (*points)[3], int pointCount,
    float sceneSpan) {
    std::vector<double> rmses, sigmas;
    int refined = 0;
    if (!points || pointCount <= 0) return {};
    for (auto& shape : shapes) {
        if (shape.inlierIndices.empty()) continue;
        const auto* indices = &shape.inlierIndices;
        Getter getter = [points, indices, pointCount](size_t i) -> Eigen::Vector3d {
            const unsigned idx = (*indices)[i];
            if (idx >= static_cast<unsigned>(pointCount)) return Eigen::Vector3d::Zero();
            return Eigen::Vector3d(points[idx][0], points[idx][1], points[idx][2]);
        };
        if (refineOne(shape, getter, shape.inlierIndices.size(), sceneSpan)) {
            ++refined; rmses.push_back(shape.rmse); sigmas.push_back(shape.robustSigma);
        }
    }
    return summarize(std::move(rmses), std::move(sigmas), refined);
}
