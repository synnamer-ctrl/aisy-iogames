import json, sys, math, html
sys.path.insert(0, '.')
from kv import load, box, cluster
A = json.load(open('vec/animal_groups.json'))
ANIMAL = dict(zip(['giraffe', 'panda', 'parrot', 'penguin', 'monkey', 'bunny', 'snake', 'hippo', 'pig', 'elephant'], A))
BG, JU, SH = load('bg'), load('jumper'), load('shapes')
OL = '#4A2E1F'

def lum(c):
    c = c.lstrip('#')
    if len(c) != 6: return 1
    r, g, b = (int(c[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def fmt(v): return f'{v:.2f}'.rstrip('0').rstrip('.') if abs(v) >= 0.01 else f'{v:.4f}'
def attrs(a): return ' '.join(f'{k}="{html.escape(" ".join(str(v).split()))}"' for k, v in a.items() if k not in ('fill-opacity', 'opacity', 'stroke-width', 'stroke-opacity'))

def place(obj, x, y, w=None, h=None, flip=False, anchor='bottom'):
    """Fit obj into width w (or height h), centred on x, with its bottom (or centre) at y."""
    b = box(obj); ow, oh = b[2] - b[0], b[3] - b[1]
    s = (w / ow) if w else (h / oh)
    tx = x - ow * s / 2
    ty = (y - oh * s) if anchor == 'bottom' else (y - oh * s / 2)
    out = []
    for sh in obj:
        a, bb, c, d, e, f = sh['m']
        fx = -1 if flip else 1
        M = [s * a * fx, s * bb, s * c * fx, s * d,
             fx * s * (e - b[0]) + (ow * s if flip else 0) + tx, s * (f - b[1]) + ty]
        out.append((sh, M))
    return out

def emit(placed, tiny=55):
    parts = []
    for sh, M in placed:
        det = abs(M[0] * M[3] - M[1] * M[2]); sc = math.sqrt(det) or 1
        bx = sh['box']; ow, oh = bx[2] - bx[0], bx[3] - bx[1]
        area = ow * oh * det / (box([sh])[2] - box([sh])[0] or 1) / (box([sh])[3] - box([sh])[1] or 1) * (ow * oh) ** 0  # transformed bbox area
        area = ow * oh * det
        tr = 'matrix(' + ' '.join(fmt(v) for v in M) + ')'
        geo = f'<{sh["tag"]} {attrs(sh["attrs"])} transform="{tr}"'
        if sh['op'] < 0.5: continue  # soft Kenney shading glazes: skip
        if lum(sh['fill']) < 0.28 and area < 8000:  # eyes, noses: solid; big dark patches stay colourable
            parts.append(f'{geo} class="deco" fill="{OL}"/>')
        elif area < tiny:
            parts.append(f'{geo} class="deco" fill="none" stroke="{OL}" stroke-width="{fmt(2.2 / sc)}" stroke-linejoin="round"/>')
        else:
            parts.append(f'{geo} class="rg" stroke="{OL}" stroke-width="{fmt(3.6 / sc)}" stroke-linejoin="round"/>')
    return ''.join(parts)

BGR = '<rect class="rg" x="0" y="0" width="400" height="300"/>'
def hill(y=236, amp=14, phase=0):
    return f'<path class="rg" d="M0 {y} Q{100 + phase} {y - amp} 200 {y} T400 {y} V300 H0 Z" stroke="{OL}" stroke-width="5" stroke-linejoin="round"/>'
def far_hill(y=200):
    return f'<path class="rg" d="M0 {y} Q60 {y - 40} 130 {y - 10} T260 {y - 18} T400 {y - 8} V300 H0 Z" stroke="{OL}" stroke-width="4" stroke-linejoin="round"/>'

J = lambda i: JU[i]; B = lambda i: BG[i]; S = lambda i: SH[i]
SUN, MOON = J(287), B(67)
CLOUD = [B(i) for i in (43, 46, 50, 52)]
def cloud(x, y, w=90, i=0): return place(CLOUD[i % len(CLOUD)], x, y, w=w, anchor='mid')
def sun(x=345, y=58, w=74): return place(SUN, x, y, w=w, anchor='mid')
def tree(i, x, y, h, flip=False): return place(B(i), x, y, h=h, flip=flip)

def animal_page(name, extras_back, extras_front=()):
    pl = []
    for e in extras_back: pl += e
    pl += place(ANIMAL[name], 200, 268, w=196)
    for e in extras_front: pl += e
    return pl

pages = []
def add(name, svg): pages.append((name, svg))

# ---- scenes from the background, jumper and shape packs ----
add('castle', BGR + emit(sun(345, 52, 66) + cloud(70, 46, 96, 2)) + far_hill(222) + emit(place(B(61), 200, 236, w=230) + tree(2, 46, 246, 100) + tree(3, 360, 246, 90)) + hill(246, 8) + emit(place(B(73), 90, 286, w=90) + place(B(74), 320, 286, w=80)))
add('village', BGR + emit(sun(60, 50, 64) + cloud(330, 46, 90, 3)) + hill(236, 10) + emit(place(B(69), 92, 262, w=130) + place(B(70), 220, 262, w=110) + place(B(72), 330, 262, w=86) + place(B(73), 200, 292, w=120)))
add('forest', BGR + emit(cloud(200, 46, 110, 0)) + far_hill(206) + emit(tree(0, 40, 236, 130) + tree(26, 120, 240, 120) + tree(2, 300, 236, 140) + tree(23, 370, 240, 110)) + hill(246, 12) + emit(place(J(37), 80, 292, w=46) + place(J(40), 160, 290, w=42) + place(J(37), 240, 294, w=36) + tree(24, 330, 292, 70)))
add('desert', BGR + emit(sun(80, 58, 76)) + far_hill(220) + emit(place(B(35), 270, 226, w=170) + place(B(36), 120, 224, w=110)) + hill(244, 8) + emit(tree(31, 50, 290, 96) + tree(32, 350, 292, 104) + tree(34, 190, 294, 70)))
add('night', BGR + emit(place(MOON, 330, 64, w=70, anchor='mid') + cloud(90, 60, 80, 1) + cloud(210, 40, 64, 2)) + hill(236, 10) + emit(place(B(71), 90, 262, w=92) + place(B(72), 210, 262, w=90) + tree(14, 330, 266, 110)))
add('winter', BGR + emit(cloud(90, 48, 100, 1) + cloud(320, 60, 90, 0)) + far_hill(206) + emit(tree(10, 50, 238, 120) + tree(16, 170, 236, 100) + tree(12, 360, 238, 130)) + hill(250, 10) + emit(tree(1, 120, 292, 90) + tree(5, 290, 292, 100)))
add('garden', BGR + emit(sun(345, 52, 66) + cloud(70, 48, 90, 3)) + hill(232, 12) + emit(place(J(40), 70, 292, w=72) + place(J(37), 160, 290, w=60) + place(J(240), 240, 282, w=50) + place(J(240), 296, 270, w=40) + place(J(240), 350, 290, w=54) + place(B(54), 120, 296, w=40) + place(B(57), 210, 298, w=36)))
add('shapes', BGR + emit(sun(345, 52, 66)) + hill(250, 8)
    + emit(place(S(0), 70, 238, w=86) + place(S(63), 70, 210, w=60, anchor='mid')
           + place(S(9), 160, 238, w=86) + place(S(63), 160, 210, w=60, anchor='mid')
           + place(S(98), 250, 238, w=86) + place(S(63), 230, 220, w=42, anchor='mid')
           + place(S(15), 340, 238, w=86) + place(S(63), 340, 196, w=56, anchor='mid')))
add('bunny-coins', BGR + emit(cloud(80, 48, 96, 2) + cloud(330, 40, 80, 1)) + hill(238, 14) + emit(place(J(29), 70, 286, w=60) + place(J(48), 330, 286, w=60) + place(J(49), 268, 290, w=46) + place(J(282), 190, 284, w=120) + place(J(220), 120, 200, w=70, anchor='mid')))
add('sunny', BGR + emit(place(J(287), 200, 112, w=170, anchor='mid') + cloud(60, 60, 90, 0) + cloud(345, 70, 90, 3)) + hill(246, 12) + emit(tree(23, 50, 270, 100) + tree(26, 350, 270, 110) + place(J(240), 200, 292, w=44)))

# ---- full-body cartoon animals (Openclipart, CC0), each in its habitat ----
import glob, os
OC = {os.path.basename(f)[:-5]: json.load(open(f)) for f in glob.glob('ocl/json/*.json')}
def emit_oc(placed):
    parts = []
    for sh, M in placed:
        det = abs(M[0] * M[3] - M[1] * M[2]); sc = math.sqrt(det) or 1
        bx = sh['box']; area = (bx[2] - bx[0]) * (bx[3] - bx[1]) * det
        tr = 'matrix(' + ' '.join(fmt(v) for v in M) + ')'
        geo = f'<{sh["tag"]} {attrs(sh["attrs"])} transform="{tr}"'
        fill, stroke = sh['fill'], sh['stroke'] if sh['sop'] > 0.5 else None
        sw = min(max(sh['sw'] * sc, 1.6), 5) / sc
        if fill is None or sh['fop'] < 0.6:
            if stroke: parts.append(f'{geo} class="deco" fill="none" stroke="{OL}" stroke-width="{fmt(sw)}" stroke-linecap="round" stroke-linejoin="round"/>')
            continue  # see-through shading and gloss
        dark = lum(fill) < 0.28
        if dark and area < 700:  # pupils, noses
            parts.append(f'{geo} class="deco" fill="{OL}"/>')
        elif not stroke and not dark:
            if area < 600: parts.append(f'{geo} class="deco" fill="#fff"/>')  # eye glints
        else:
            parts.append(f'{geo} class="rg" stroke="{OL}" stroke-width="{fmt(sw if stroke else 3 / sc)}" stroke-linejoin="round"/>')
    return ''.join(parts)
def pond(cx=310, cy=272, rx=78, ry=20):
    return f'<ellipse class="rg" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" stroke="{OL}" stroke-width="4"/>'
def waves(y=226):
    return (f'<path class="rg" d="M0 {y} Q25 {y - 12} 50 {y} T100 {y} T150 {y} T200 {y} T250 {y} T300 {y} T350 {y} T400 {y} V300 H0 Z" stroke="{OL}" stroke-width="5" stroke-linejoin="round"/>'
            f'<path class="deco" d="M40 262 q10 -8 20 0 M330 276 q10 -8 20 0 M60 288 q10 -8 20 0 M300 252 q10 -8 20 0" fill="none" stroke="{OL}" stroke-width="3" stroke-linecap="round"/>')
farm = lambda: emit(sun(345, 52, 66) + cloud(80, 50, 90, 1)) + hill(240, 12) + emit(place(B(73), 56, 266, w=100) + place(B(74), 350, 268, w=90))
woods = lambda: emit(cloud(70, 40, 84, 3)) + far_hill(206) + emit(tree(0, 40, 250, 140) + tree(3, 362, 252, 130)) + hill(254, 10) + emit(place(J(37), 352, 294, w=36))
savannah = lambda: emit(sun(345, 56, 72)) + far_hill(216) + emit(tree(23, 46, 256, 110) + tree(23, 372, 254, 90, flip=True)) + hill(254, 8) + emit(place(B(57), 76, 294, w=32))
pondside = lambda: emit(sun(60, 54, 66) + cloud(320, 46, 90, 1)) + hill(238, 12) + pond(320, 278, 70, 16) + emit(place(J(240), 60, 292, w=32))
sea = lambda: emit(sun(70, 56, 70) + cloud(320, 52, 100, 2)) + waves(232)
ice = lambda: emit(cloud(90, 50, 96, 0) + cloud(320, 44, 80, 1)) + far_hill(210) + emit(tree(10, 44, 254, 110) + tree(12, 364, 256, 100)) + hill(256, 8)
night = lambda: emit(place(MOON, 340, 60, w=60, anchor='mid') + cloud(80, 52, 80, 2)) + hill(244, 10) + emit(tree(14, 50, 262, 120) + tree(2, 360, 264, 110))
garden = lambda: emit(sun(345, 52, 66)) + hill(244, 12) + emit(place(J(240), 60, 292, w=40) + place(J(240), 110, 296, w=30) + place(J(240), 340, 292, w=40) + place(J(37), 300, 294, w=34))
dino = lambda: emit(sun(60, 52, 66)) + far_hill(214) + emit(tree(31, 360, 258, 100) + tree(28, 40, 258, 110)) + hill(256, 8)
HAB = {'cow': farm, 'sheep': farm, 'goat': farm, 'pig': farm, 'chicken': farm, 'turkey': farm, 'dog': farm, 'cat': farm,
       'bunny': garden, 'mouse': garden, 'ladybug': garden, 'llama': farm,
       'bear': woods, 'beaver': pondside, 'squirrel': woods, 'owl': night, 'bat': night, 'elk': woods, 'moose': woods, 'panda': woods,
       'lion': savannah, 'zebra': savannah, 'giraffe': savannah, 'elephant': savannah, 'rhino': savannah, 'hippo': pondside,
       'leopard': savannah, 'gnu': savannah, 'ostrich': savannah, 'monkey': savannah, 'kangaroo': savannah, 'peacock': garden, 'yak': ice,
       'penguin': ice, 'polarbear': ice, 'walrus': sea, 'whale': sea, 'turtle': sea, 'alligator': pondside, 'plesiosaur': sea,
       'brontosaurus': dino, 'triceratops': dino, 'trex': dino, 'pterodactyl': dino}
ORDER = ['dog', 'cat', 'cow', 'pig', 'sheep', 'goat', 'chicken', 'turkey', 'llama', 'bunny', 'mouse', 'ladybug', 'peacock',
         'bear', 'panda', 'squirrel', 'beaver', 'elk', 'moose', 'owl', 'bat', 'lion', 'zebra', 'giraffe', 'elephant', 'rhino', 'hippo',
         'leopard', 'gnu', 'ostrich', 'monkey', 'kangaroo', 'alligator', 'penguin', 'polarbear', 'yak', 'walrus', 'whale', 'turtle',
         'plesiosaur', 'brontosaurus', 'triceratops', 'trex', 'pterodactyl']
animal_pages = []
for name in ORDER:
    shapes = OC[name]; b = box(shapes); w, h = b[2] - b[0], b[3] - b[1]
    flying = name in ('bat', 'pterodactyl')
    # fit inside a 250 x 220 box (wide ones by width), standing on the ground
    k = min(250 / w, 220 / h)
    y = 200 if flying else (280 if HAB[name] is sea else 284)
    animal_pages.append((name, BGR + HAB[name]() + emit_oc(place(shapes, 200, y, w=w * k, anchor='mid' if flying else 'bottom'))))
pages[:0] = animal_pages

json.dump(pages, open('vec/pages.json', 'w'))
for n, s in pages: print(n, len(s), s.count('class="rg"'), 'regions')
