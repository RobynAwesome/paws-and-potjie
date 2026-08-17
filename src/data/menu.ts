export type Mood = 'slow' | 'sunny' | 'bold';
export type DogEnergy = 'nap' | 'stroll' | 'zoomies';

export type MenuItem = {
  name: string;
  kind: 'human' | 'dog';
  note: string;
  ingredients: string;
  accent: string;
};

export const humanMenu: MenuItem[] = [
  { name: 'Sunday Smoke Potjie', kind: 'human', note: 'Low-and-slow comfort with a Cape Town fireside mood.', ingredients: 'beef • root veg • tomato • herbs', accent: '01' },
  { name: 'Maize & Mushroom Hug', kind: 'human', note: 'Creamy pap, savoury mushrooms and crisp greens.', ingredients: 'maize • mushroom • spinach • chakalaka oil', accent: '02' },
  { name: 'Braai-Bowl Glow', kind: 'human', note: 'A bright bowl built for the person who ordered the weather too.', ingredients: 'charred chicken • corn • slaw • lemon', accent: '03' },
];

export const dogMenu: MenuItem[] = [
  { name: 'Pumpkin Paw Bowl', kind: 'dog', note: 'A simple unseasoned bowl for the four-legged table guest.', ingredients: 'pumpkin • rice • chicken • carrot', accent: 'P1' },
  { name: 'Garden Snuffle Cup', kind: 'dog', note: 'Small, soft bites designed as a fictional dog-friendly side.', ingredients: 'green beans • carrot • rice', accent: 'P2' },
  { name: 'Tiny Potjie Plate', kind: 'dog', note: 'Plain ingredients, no restaurant seasoning, served separately.', ingredients: 'chicken • pumpkin • rice', accent: 'P3' },
];

const pairings: Record<`${Mood}:${DogEnergy}`, { human: number; dog: number; line: string }> = {
  'slow:nap': { human: 0, dog: 0, line: 'Blanket weather. Nobody is rushing this table.' },
  'slow:stroll': { human: 1, dog: 2, line: 'Soft comfort, then one little neighbourhood lap.' },
  'slow:zoomies': { human: 0, dog: 1, line: 'Deep comfort for you. Lightweight fuel for the chaos agent.' },
  'sunny:nap': { human: 2, dog: 0, line: 'Bright plate, sleepy paws, zero conflict.' },
  'sunny:stroll': { human: 2, dog: 1, line: 'Fresh energy for a table that still has somewhere to wander.' },
  'sunny:zoomies': { human: 2, dog: 2, line: 'Maximum sunshine. Controlled zoomies. Allegedly.' },
  'bold:nap': { human: 1, dog: 0, line: 'Big flavour for the human; calm bowl for the supervisor.' },
  'bold:stroll': { human: 0, dog: 1, line: 'A proper potjie moment with a crisp little sidekick pairing.' },
  'bold:zoomies': { human: 0, dog: 2, line: 'Full send, but governed.' },
};

export function getPairing(mood: Mood, energy: DogEnergy) {
  const match = pairings[`${mood}:${energy}`];
  return { ...match, humanItem: humanMenu[match.human], dogItem: dogMenu[match.dog] };
}
