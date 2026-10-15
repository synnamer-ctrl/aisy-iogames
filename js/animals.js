// Animal roster: names and sound words for the voice. The animals are drawn
// in a soft 3D cartoon style by js/toon-animals.js.
import { toonAnimal } from './toon-animals.js';

export const ANIMALS = {
  cat:      { name: 'kitty',    plural: 'kitties',   sound: 'Meow!' },
  dog:      { name: 'puppy',    plural: 'puppies',   sound: 'Woof woof!' },
  bunny:    { name: 'bunny',    plural: 'bunnies',   sound: 'Sniff sniff!' },
  bear:     { name: 'bear',     plural: 'bears',     sound: 'Grrr!' },
  frog:     { name: 'froggy',   plural: 'froggies',  sound: 'Ribbit ribbit!' },
  pig:      { name: 'piggy',    plural: 'piggies',   sound: 'Oink oink!' },
  chick:    { name: 'chick',    plural: 'chicks',    sound: 'Cheep cheep!' },
  lion:     { name: 'lion',     plural: 'lions',     sound: 'Roar!' },
  cow:      { name: 'cow',      plural: 'cows',      sound: 'Moooo!' },
  monkey:   { name: 'monkey',   plural: 'monkeys',   sound: 'Ooh ooh aah aah!' },
  elephant: { name: 'elephant', plural: 'elephants', sound: 'Toot toot!' },
  panda:    { name: 'panda',    plural: 'pandas',    sound: 'Munch munch!' },
};
export const ANIMAL_KINDS = Object.keys(ANIMALS);

export const animal = toonAnimal;
