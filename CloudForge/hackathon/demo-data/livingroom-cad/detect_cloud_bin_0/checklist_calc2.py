import math
S = {
    1:  ((-0.00059, 0.99975, 0.02223), -2.43178),
    2:  ((0.00577, 0.99979, 0.01959),  -1.94713),
    22: ((0.08846, 0.95598, 0.27979),  -2.86285),
    34: ((-0.01229, 0.99961, 0.02502), -2.36989),
    20: ((-0.16063, 0.05739, -0.98535), 2.01937),
    21: ((-0.96814, -0.01033, -0.25018), 1.85617),
    28: ((-0.98598, -0.01136, -0.16645), 1.94512),
    4:  ((0.96864, -0.00223, -0.24844), -0.21984),
    6:  ((0.96180, 0.01101, -0.27353), -2.47955),
    16: ((0.97759, 0.00804, 0.21038),  -1.91319),
    17: ((0.96317, 0.00737, -0.26878), -1.11882),
    18: ((0.98203, 0.00217, -0.18871), -1.38144),
    24: ((0.95830, -0.00752, 0.28568), -1.69781),
    25: ((0.97515, -0.01448, 0.22106), -2.08345),
    33: ((0.98972, -0.02291, 0.14116), -2.01106),
    29: ((0.99675, -0.05282, 0.06083), -2.11246),
    5:  ((0.28182, -0.00859, 0.95943), -1.85190),
    19: ((0.30988, 0.03157, 0.95025),  -2.50841),
}

def pos(n, d):
    axis = 1 if abs(n[1]) > abs(n[0]) else 0
    return -d / n[axis], axis

def ang(u, v):
    du = math.sqrt(sum(a*a for a in u))
    dv = math.sqrt(sum(b*b for b in v))
    c = max(-1.0, min(1.0, sum(a*b for a, b in zip(u, v)) / (du * dv)))
    return math.degrees(math.acos(c))

print('id axis pos angle_to_1')
for i in S:
    p, ax = pos(S[i][0], S[i][1])
    print(f'{i:3d} {"Y" if ax else "X"} {p:+.4f} {ang(S[1][0], S[i][0]):7.2f}')

yplus = [pos(S[i][0], S[i][1])[0] for i in (1, 2, 22, 34)]
xminus = [pos(S[i][0], S[i][1])[0] for i in (20, 21, 28)]
xplus = [pos(S[i][0], S[i][1])[0] for i in (4, 6, 16, 17, 18, 24, 25, 33, 29)]
print('Y+ positions sorted:', sorted(round(v, 4) for v in yplus))
print('X- positions sorted:', sorted(round(v, 4) for v in xminus))
print('X+ positions sorted:', sorted(round(v, 4) for v in xplus))

# Candidate pair distances
# Y walls: shape 2 (y=1.947) vs shape 1/34 (y=2.432/2.370)  and shape 22 (y=2.863?)
print('Y pair: 1 vs 2 =', round(2.43178 - 1.94713, 4))
print('Y pair: 22 vs 34 =', round(2.86285 - 2.36989, 4))
print('Y pair: 1 vs 22 =', round(2.43178 - 2.86285, 4))
print('X pair: 6 vs 28 =', round(2.57764 - 1.94512, 4))
print('X pair: 6 vs 21 =', round(2.57764 - 1.85617, 4))
print('X pair: 4 vs 28 =', round(0.22696 - 1.94512, 4))
# ceilings
for i in (5, 19):
    n, d = S[i]
    print(f'plane {i} z =', round(-d / n[2], 4))
