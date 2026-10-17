import json, html
def load(n): return json.load(open(f'vec/{n}.json'))
def attrs(a): return ' '.join(f'{k}="{html.escape(str(v))}"' for k, v in a.items() if k not in ('fill-opacity', 'opacity', 'stroke-width', 'stroke-opacity'))
def mat(m): return 'matrix(' + ' '.join(f'{v:.4g}' for v in m) + ')'
def shape_svg(s, extra=''):
    return f'<{s["tag"]} {attrs(s["attrs"])} transform="{mat(s["m"])}" {extra}/>'
def box(shapes):
    b = [min(s['box'][0] for s in shapes), min(s['box'][1] for s in shapes), max(s['box'][2] for s in shapes), max(s['box'][3] for s in shapes)]
    return b
def cluster(shapes, gap=6):
    groups = []
    for s in shapes:
        hit = [g for g in groups if any(not (s['box'][2] + gap < t['box'][0] or t['box'][2] + gap < s['box'][0] or s['box'][3] + gap < t['box'][1] or t['box'][3] + gap < s['box'][1]) for t in g)]
        merged = [s] + [x for g in hit for x in g]
        groups = [g for g in groups if g not in hit] + [merged]
    # keep original drawing order inside each group
    order = {id(s): i for i, s in enumerate(shapes)}
    return [sorted(g, key=lambda s: order[id(s)]) for g in groups]
def colored(shapes):
    return ''.join(shape_svg(s, f'fill="{s["fill"]}" fill-opacity="{s["op"]}"') for s in shapes)
