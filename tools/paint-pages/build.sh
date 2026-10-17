#!/usr/bin/env bash
# Rebuilds js/games/paint-pages.js from the vector art in sprites/.
# Needs node + Playwright (Chromium) and python3. Run from the repo root.
set -euo pipefail
T=tools/paint-pages; W=$T/.cache
mkdir -p $W/vec $W/ocl/json
node $T/extract.mjs sprites/animal-pack/Vector/round_nodetails.svg $W/vec/animals.json flat
node $T/extract.mjs sprites/background-elements/Vector/bgElements_elements.svg $W/vec/bg.json grp
node $T/extract.mjs sprites/jumper-pack/Vector/vector_jumper.svg $W/vec/jumper.json grp
node $T/extract.mjs sprites/shape-characters/Vector/overview.svg $W/vec/shapes.json grp
node $T/extract2.mjs $W/ocl/json sprites/openclipart-animals/*.svg
cp $T/kv.py $T/compose.py $W/
(cd $W && python3 -c "
import sys, json; sys.path.insert(0, '.')
from kv import *
g = cluster([o[0] for o in load('animals')]); g.sort(key=lambda q: (round(box(q)[1] / 100), box(q)[0]))
json.dump(g, open('vec/animal_groups.json', 'w'))" && python3 compose.py > /dev/null)
python3 $T/write_js.py $W/vec/pages.json js/games/paint-pages.js
