"""Generate the header scene (hills, redwoods, sun, route road) in light and dark palettes."""
import random, sys, os
W, H = 1600, 200
OUT = sys.argv[1]

PALETTES = {
    "light": dict(sky="#f7f1dc", sun="#f6c078", back="#b9ccc0", mid="#97afa3", front="#42725f",
                  trees="#2d5d50", trees_far="#6f9484", road="#f5c400"),
    "dark":  dict(sky="#2c3b33", sun="#c9955a", back="#3a4d44", mid="#34473e", front="#1d2b24",
                  trees="#16221c", trees_far="#2c3e35", road="#b89400"),
}

def smooth(points):
    """Catmull-Rom -> cubic Bezier path through points."""
    d = f"M{points[0][0]:.1f},{points[0][1]:.1f}"
    for i in range(len(points) - 1):
        p0 = points[i - 1] if i > 0 else points[i]
        p1, p2 = points[i], points[i + 1]
        p3 = points[i + 2] if i + 2 < len(points) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d

def ridge(ys):
    step = W / (len(ys) - 1)
    pts = [(i * step, y) for i, y in enumerate(ys)]
    return smooth(pts) + f" L{W},{H} L0,{H} Z"

def redwood(x, base, h, rnd):
    """Narrow, tall conifer with jagged tiers."""
    w = h * 0.26
    tiers = max(4, int(h / 14))
    right, left = [], []
    for i in range(1, tiers + 1):
        t = i / tiers
        y = base - h + t * (h * 0.92)
        spread = w / 2 * (0.25 + 0.75 * t) * rnd.uniform(0.85, 1.1)
        inner = spread * 0.55
        right += [(x + spread, y), (x + inner, y - 2)]
        left += [(x - spread, y), (x - inner, y - 2)]
    right[-1] = (x + 2.5, base - h * 0.06); left[-1] = (x - 2.5, base - h * 0.06)
    pts = [(x, base - h)] + right + [(x + 2.5, base + 2), (x - 2.5, base + 2)] + list(reversed(left))
    return "M" + " L".join(f"{a:.1f},{b:.1f}" for a, b in pts) + " Z"

def build(p):
    rnd = random.Random(7)
    back = ridge([118, 96, 104, 82, 100, 112, 90, 78, 96, 110, 92, 104, 120])
    mid = ridge([150, 138, 128, 140, 132, 146, 136, 124, 134, 148, 140, 130, 144])
    front = ridge([186, 180, 176, 182, 178, 172, 178, 184, 178, 174, 180, 176, 182])
    far_trees = []
    for x in list(range(40, 560, 38)) + list(range(1020, 1580, 42)):
        if rnd.random() < 0.75:
            far_trees.append(redwood(x + rnd.uniform(-10, 10), 150 - rnd.uniform(0, 12), rnd.uniform(34, 54), rnd))
    near_trees = []
    for cluster in (60, 200, 1180, 1420, 1540):
        for k in range(rnd.randint(2, 4)):
            x = cluster + k * rnd.uniform(18, 30)
            near_trees.append(redwood(x, 182, rnd.uniform(62, 96), rnd))
    road = smooth([(0, 194), (300, 188), (620, 192), (960, 186), (1280, 191), (1600, 187)])
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice">
<rect width="{W}" height="{H}" fill="{p["sky"]}"/>
<circle cx="1250" cy="92" r="40" fill="{p["sun"]}"/>
<path d="{back}" fill="{p["back"]}"/>
<path d="{"".join(far_trees)}" fill="{p["trees_far"]}"/>
<path d="{mid}" fill="{p["mid"]}"/>
<path d="{"".join(near_trees)}" fill="{p["trees"]}"/>
<path d="{front}" fill="{p["front"]}"/>
<path d="{road}" fill="none" stroke="{p["road"]}" stroke-width="3" stroke-dasharray="18 12" stroke-linecap="round"/>
</svg>
'''

for name, pal in PALETTES.items():
    with open(os.path.join(OUT, f"scene-{name}.svg"), "w") as f:
        f.write(build(pal))
