"""Generate the header scene (hills, redwoods, a big redwood trunk, sun, route road)
in light and dark palettes. Colors follow the brand palette: Redwood Green #1B4332,
Bark Brown #5A3A28, Sun Gold #FDB43C, Redwood Cream #F6EBD7.

Usage: python3 tools/make_scene.py assets/img
"""
import random, sys, os
W, H = 1600, 200
OUT = sys.argv[1]

PALETTES = {
    "light": dict(sky="#F6EBD7", sun="#FDB43C", back="#b5d3bf", mid="#7fb596", front="#2d6a4f",
                  trees="#1B4332", trees_far="#4f8f6f", road="#FDB43C",
                  trunk="#5A3A28", bark="#8a5a3c", boughs="#1f5a3c"),
    "dark":  dict(sky="#2a3a31", sun="#c99a35", back="#34493e", mid="#2d4036", front="#1c2b23",
                  trees="#13201a", trees_far="#26382e", road="#b99a3a",
                  trunk="#3d271b", bark="#553624", boughs="#1a2e24"),
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

def bough(x0, y, length, side, rnd):
    """A drooping redwood spray: a slightly arched top edge with a jagged,
    downward-pointing fringe underneath. side=-1 grows left, +1 right."""
    n = max(4, int(length / 11))
    step = length / n
    top = [(x0 + side * step * i, y - 6 * (1 - (i / n - 0.45) ** 2)) for i in range(n + 1)]
    fringe = []
    for i in range(n, -1, -1):
        bx = x0 + side * step * i
        drop = rnd.uniform(9, 16) * (1 - 0.35 * i / n)
        fringe += [(bx, y + 3), (bx - side * step / 2, y + 3 + drop)]
    pts = top + fringe
    return "M" + " L".join(f"{a:.1f},{b:.1f}" for a, b in pts) + " Z"

def big_redwood(x, base, rnd):
    """A whole old-growth redwood that fits inside the strip: a narrow spire,
    a tall columnar crown of short drooping sprays, and a long bare, flared,
    grooved trunk below it. It is a complete tree wherever the strip sits on
    the page (it used to run off the top edge, which only worked in a header)."""
    apex, crown_bottom = 10, 96
    top_w, base_w = 16, 62
    t0 = crown_bottom - 14      # trunk starts hidden under the lowest sprays
    trunk = (f"M{x - top_w/2:.1f},{t0} L{x + top_w/2:.1f},{t0} "
             f"C{x + top_w/2 + 3:.1f},{base * 0.72:.1f} {x + base_w/2 - 8:.1f},{base - 14:.1f} {x + base_w/2 + 10:.1f},{base + 6} "
             f"L{x - base_w/2 - 10:.1f},{base + 6} "
             f"C{x - base_w/2 + 8:.1f},{base - 14:.1f} {x - top_w/2 - 3:.1f},{base * 0.72:.1f} {x - top_w/2:.1f},{t0} Z")
    grooves = ""
    for k in (-0.25, 0.05, 0.32):
        grooves += f"M{x + k * top_w:.1f},{crown_bottom + 6} L{x + k * base_w * 0.85:.1f},{base - 6} "
    # spire, then a column of short sprays that grow from the trunk's center line
    spire = f"M{x:.1f},{apex} L{x + 6:.1f},{apex + 22} L{x - 6:.1f},{apex + 22} Z"
    # a narrow green spine so no sky shows where left and right sprays meet
    spine = f"M{x - 2:.1f},{apex + 8} L{x + 2:.1f},{apex + 8} L{x + 7:.1f},{crown_bottom + 2} L{x - 7:.1f},{crown_bottom + 2} Z"
    boughs = [spire, spine]
    tiers = 8
    for k in range(tiers):
        t = k / (tiers - 1)
        y = apex + 16 + t * (crown_bottom - apex - 16)
        length = 9 + 20 * (t ** 0.7)               # narrow, columnar crown
        for side in ((-1, 1) if k % 2 == 0 else (1, -1)):
            yy = y + (0 if side == -1 else 4)
            boughs.append(bough(x, yy, length * rnd.uniform(0.8, 1.1), side, rnd))
    return trunk, grooves, boughs

def group(shapes, fill):
    """Each shape gets its own <path>: overlapping shapes in one path can cancel
    each other out (opposite winding) and punch holes showing the sky."""
    return f'<g fill="{fill}">' + "".join(f'<path d="{d}"/>' for d in shapes) + "</g>"

def build(p, hills_only=False):
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
    # Sits where phones still see it (they crop to the right-hand ~70%).
    trunk, grooves, boughs = big_redwood(540, 180, rnd)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice">
<rect width="{W}" height="{H}" fill="{p["sky"]}"/>
{"" if hills_only else f'<circle cx="1250" cy="92" r="40" fill="{p["sun"]}"/>'}
<path d="{back}" fill="{p["back"]}"/>
{group(far_trees, p["trees_far"])}
<path d="{mid}" fill="{p["mid"]}"/>
{group(near_trees, p["trees"])}
{"" if hills_only else f"""<path d="{trunk}" fill="{p["trunk"]}"/>
<path d="{grooves}" fill="none" stroke="{p["bark"]}" stroke-width="4" stroke-linecap="round"/>
{group(boughs, p["boughs"])}"""}
<path d="{front}" fill="{p["front"]}"/>
<path d="{road}" fill="none" stroke="{p["road"]}" stroke-width="3" stroke-dasharray="18 12" stroke-linecap="round"/>
</svg>
'''

# hills_only=True drops the sun and big redwood (e.g. behind an illustration that
# brings its own); not used on the site right now.
for name, pal in PALETTES.items():
    with open(os.path.join(OUT, f"scene-{name}.svg"), "w") as f:
        f.write(build(pal))
