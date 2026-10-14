# livingroom1 cloud_bin_0 竣工核验：主要平行墙对间距
import json

RES = r'E:\C++\Point\CloudForge\hackathon\demo-data\livingroom-cad\detect_cloud_bin_0\result.json'
d = json.load(open(RES))

# from detection summary: shape -> (normal, d, inlier)
S = {
    1:  ((-0.00059, 0.99975, 0.02223), -2.43178, 41933),   # y wall +
    2:  ((0.00577, 0.99979, 0.01959), -1.94713, 6842),    # y wall +
    22: ((0.08846, 0.95598, 0.27979), -2.86285, 914),     # y wall +
    34: ((-0.01229, 0.99961, 0.02502), -2.36989, 512),    # y wall +
    20: ((-0.16063, 0.05739, -0.98535), 2.01937, 886),    # x wall -
    21: ((-0.96814, -0.01033, -0.25018), 1.85617, 1043),  # x wall -
    28: ((-0.98598, -0.01136, -0.16645), 1.94512, 718),   # x wall -
    4:  ((0.96864, -0.00223, -0.24844), -0.21984, 7858),  # x wall +
    6:  ((0.96180, 0.01101, -0.27353), -2.47955, 4485),   # x wall +
    16: ((0.97759, 0.00804, 0.21038), -1.91319, 1109),    # x wall +
    17: ((0.96317, 0.00737, -0.26878), -1.11882, 1131),   # x wall +
    18: ((0.98203, 0.00217, -0.18871), -1.38144, 1574),   # x wall +
    24: ((0.95830, -0.00752, 0.28568), -1.69781, 863),    # x wall +
    25: ((0.97515, -0.01448, 0.22106), -2.08345, 802),    # x wall +
    33: ((0.98972, -0.02291, 0.14116), -2.01106, 665),    # x wall +
    29: ((0.99675, -0.05282, 0.06083), -2.11246, 980),    # x wall +
    5:  ((0.28182, -0.00859, 0.95943), -1.85190, 5154),   # ceiling horizontal
    19: ((0.30988, 0.03157, 0.95025), -2.50841, 1428),    # ceiling horizontal
    0:  ((0.29209, -0.01806, 0.95622), -2.37709, 43537),  # big mixed (diagonal)
}

def pos(n, dc):
    # n.p + d = 0, so along unit normal u the plane sits at u * (-d)
    return -dc

def angle_deg(uu, vv):
    du = math.sqrt(sum(a*a for a in uu))
    dv = math.sqrt(sum(a*a for a in vv))
    d = sum(a*b for a,b in zip(uu, vv))
    c = max(-1.0, min(1.0, d / (du*dv)))
    return math.degrees(math.acos(c))

# parallel wall pairs: compare positions along dominant axis
groups = {'y': ([(1,'+')], [(2,'+'),(22,'+'),(34,'+')]), 'x': ([(4,'+'),(6,'+'),(16,'+'),(17,'+'),(18,'+'),(24,'+'),(25,'+'),(33,'+'),(29,'+')], [(20,'-'),(21,'-'),(28,'-')])}
print('\nangle checks:')
for a, b in [(1,2),(1,34),(4,6),(20,21)]:
    na=S[a][0]; nb=S[b][0]
    da=S[a][1]; db=S[b][1]
    pa=(-da/na[1] if abs(na[1])>0.5 else -da/na[0], -db/nb[1] if abs(nb[1])>0.5 else -db/nb[0])
    print(f'{a} vs {b}: angle={angle_deg(na,nb):.2f} deg, pos({"y" if abs(na[1])>0.5 else "x"})={pa[0]:.4f}, pos={pa[1]:.4f}')

y_plus = [pos(S[i][0][1], S[i][1]) for i in (1, 2, 22, 34)]
y_minus = []  # no -ny planes in list
x_plus = [pos(S[i][0][0], S[i][1]) for i in (4, 6, 16, 17, 18, 24, 25, 33, 29)]
x_minus = [pos(S[i][0][0], S[i][1]) for i in (20, 21, 28)]
ceilings = [pos((0.0, 0.0, 1.0), S[i][1]) for i in (5, 19)]  # z position = -d/nz approx

print('y+ wall positions:', [round(v, 4) for v in y_plus])
print('x- wall positions:', [round(v, 4) for v in x_minus])
print('x+ wall positions:', [round(v, 4) for v in x_plus])
print('ceiling z (approx -d/nz):', [round(-S[i][1]/S[i][0][2], 4) for i in (5, 19)])

# room skeleton tool said floor z=0.935 (id=5???) and ceil z=2.462 (id=19)
# Actually id 5 has z range [0.935,1.113], id 19 z [2.340,2.462]
# The tool labels "floor z=0.935 (id=5), ceil z=2.462 (id=19)" => net 1.527 m
# But z_min of bin_0 is 0.566; floor could be at 0.567 (shape 1 z_min). Shape 1 is a vertical wall though.

# Horizontal planes only: ids 5,19 have nz>0.5. z of plane = -d/nz (if n normalized)
for i in (5, 19):
    n = S[i][0]
    nl = math.sqrt(sum(a*a for a in n))
    nz = n[2] / nl
    z = -S[i][1] / nl / (nz / nl)  # careful: plane n.p+d=0, n normalized: z = -d/nz
    print(f'id {i}: normalized nz={nz:.4f}, z_plane={-S[i][1]/nl/nz:.4f}, inlier={S[i][2]}')
