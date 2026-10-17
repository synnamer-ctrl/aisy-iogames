// Animal roster. The animals are Kenney "Animal Pack" faces (CC0, see
// sprites/animal-pack), wrapped in an SVG so the shared bob / hop / talk
// animations in css/style.css still apply.

export const ANIMALS = {
  elephant: { name: 'elephant', plural: 'elephants' },
  giraffe:  { name: 'giraffe',  plural: 'giraffes' },
  hippo:    { name: 'hippo',    plural: 'hippos' },
  monkey:   { name: 'monkey',   plural: 'monkeys' },
  panda:    { name: 'panda',    plural: 'pandas' },
  parrot:   { name: 'parrot',   plural: 'parrots' },
  penguin:  { name: 'penguin',  plural: 'penguins' },
  pig:      { name: 'piggy',    plural: 'piggies' },
  bunny:    { name: 'bunny',    plural: 'bunnies' },
  snake:    { name: 'snake',    plural: 'snakes' },
};
export const ANIMAL_KINDS = Object.keys(ANIMALS);

export function animal(kind, cls = '') {
  const d = (Math.random() * -5).toFixed(2);
  return `<svg class="char kenney ${cls}" data-kind="${kind}" viewBox="0 -12 200 212" style="--d:${d}s">
    <ellipse cx="100" cy="194" rx="60" ry="6" fill="#000" opacity=".16"/>
    <g class="c-bob"><g class="c-face"><image href="img/kenney/animals/${kind}.png" x="4" y="4" width="192" height="192"/></g></g></svg>`;
}
