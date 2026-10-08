// Sélection éditoriale : ce que l'API Marvel ne fournit pas (identité secrète, onomatopée,
// films). Les films sont des identifiants TMDB ; le titre et l'année servent de garde-fou :
// un film dont l'année ne correspond pas à celle renvoyée par TMDB est écarté.

export type Film = readonly [tmdbId: number, title: string, year: number];

export interface CuratedCharacter {
  label: string;
  alias: string;
  sound: string;
  films: readonly Film[];
}

const F = {
  ironMan: [1726, 'Iron Man', 2008],
  incredibleHulk: [1724, 'The Incredible Hulk', 2008],
  ironMan2: [10138, 'Iron Man 2', 2010],
  thor: [10195, 'Thor', 2011],
  firstAvenger: [1771, 'Captain America: The First Avenger', 2011],
  avengers: [24428, 'The Avengers', 2012],
  ironMan3: [68721, 'Iron Man 3', 2013],
  darkWorld: [76338, 'Thor: The Dark World', 2013],
  winterSoldier: [100402, 'Captain America: The Winter Soldier', 2014],
  ageOfUltron: [99861, 'Avengers: Age of Ultron', 2015],
  civilWar: [271110, 'Captain America: Civil War', 2016],
  doctorStrange: [284052, 'Doctor Strange', 2016],
  homecoming: [315635, 'Spider-Man: Homecoming', 2017],
  ragnarok: [284053, 'Thor: Ragnarok', 2017],
  blackPanther: [284054, 'Black Panther', 2018],
  infinityWar: [299536, 'Avengers: Infinity War', 2018],
  captainMarvel: [299537, 'Captain Marvel', 2019],
  endgame: [299534, 'Avengers: Endgame', 2019],
  farFromHome: [429617, 'Spider-Man: Far From Home', 2019],
  blackWidow: [497698, 'Black Widow', 2021],
  noWayHome: [634649, 'Spider-Man: No Way Home', 2021],
  multiverse: [453395, 'Doctor Strange in the Multiverse of Madness', 2022],
  loveAndThunder: [616037, 'Thor: Love and Thunder', 2022],
  theMarvels: [609681, 'The Marvels', 2023],
  xMen: [36657, 'X-Men', 2000],
  x2: [36658, 'X2', 2003],
  daredevil: [9480, 'Daredevil', 2003],
  fantasticFour: [9738, 'Fantastic Four', 2005],
  lastStand: [36668, 'X-Men: The Last Stand', 2006],
  silverSurfer: [1979, 'Fantastic Four: Rise of the Silver Surfer', 2007],
  originsWolverine: [2080, 'X-Men Origins: Wolverine', 2009],
  theWolverine: [76170, 'The Wolverine', 2013],
  futurePast: [127585, 'X-Men: Days of Future Past', 2014],
  fantasticFour2015: [166424, 'Fantastic Four', 2015],
  deadpool: [293660, 'Deadpool', 2016],
  apocalypse: [246655, 'X-Men: Apocalypse', 2016],
  logan: [263115, 'Logan', 2017],
  deadpool2: [383498, 'Deadpool 2', 2018],
  darkPhoenix: [320288, 'Dark Phoenix', 2019],
  deadpoolWolverine: [533535, 'Deadpool & Wolverine', 2024],
} satisfies Record<string, Film>;

export const CURATED: Record<string, CuratedCharacter> = {
  '5fcf9495d8a2480017b918f4': { label: 'Spider-Man', alias: 'Peter Parker', sound: 'THWIP!', films: [F.civilWar, F.homecoming, F.infinityWar, F.endgame, F.farFromHome, F.noWayHome] },
  '5fcf9258d8a2480017b9150c': { label: 'Captain America', alias: 'Steve Rogers', sound: 'KLANG!', films: [F.firstAvenger, F.avengers, F.winterSoldier, F.ageOfUltron, F.civilWar, F.infinityWar, F.endgame] },
  '5fcf9235d8a2480017b914cc': { label: 'Black Panther', alias: "T'Challa", sound: 'SHRAK!', films: [F.civilWar, F.blackPanther, F.infinityWar, F.endgame] },
  '5fcf9299d8a2480017b9157c': { label: 'Deadpool', alias: 'Wade Wilson', sound: 'BLAM!', films: [F.deadpool, F.deadpool2, F.deadpoolWolverine] },
  '5fcf945dd8a2480017b9188f': { label: 'Scarlet Witch', alias: 'Wanda Maximoff', sound: 'ZZAAP!', films: [F.ageOfUltron, F.civilWar, F.infinityWar, F.endgame, F.multiverse] },
  '5fcf92afd8a2480017b9159c': { label: 'Doctor Strange', alias: 'Stephen Strange', sound: 'FWOOSH!', films: [F.doctorStrange, F.infinityWar, F.endgame, F.noWayHome, F.multiverse] },
  '5fcf928fd8a2480017b9156c': { label: 'Daredevil', alias: 'Matt Murdock', sound: 'WHAM!', films: [F.daredevil] },
  '5fcf9340d8a2480017b91690': { label: 'Iron Man', alias: 'Tony Stark', sound: 'REPULSE!', films: [F.ironMan, F.ironMan2, F.avengers, F.ironMan3, F.ageOfUltron, F.civilWar, F.infinityWar, F.endgame] },
  '5fcf9238d8a2480017b914d1': { label: 'Black Widow', alias: 'Natasha Romanoff', sound: 'KRAK!', films: [F.ironMan2, F.avengers, F.winterSoldier, F.ageOfUltron, F.civilWar, F.infinityWar, F.endgame, F.blackWidow] },
  '5fcf94dbd8a2480017b91972': { label: 'Thor', alias: 'Dieu du tonnerre', sound: 'KRA-KOOM!', films: [F.thor, F.avengers, F.darkWorld, F.ageOfUltron, F.ragnarok, F.infinityWar, F.endgame, F.loveAndThunder] },
  '5fcf9326d8a2480017b9165f': { label: 'Hulk', alias: 'Bruce Banner', sound: 'SMASH!', films: [F.incredibleHulk, F.avengers, F.ageOfUltron, F.ragnarok, F.infinityWar, F.endgame] },
  '5fcf925cd8a2480017b91517': { label: 'Captain Marvel', alias: 'Carol Danvers', sound: 'FZZOOM!', films: [F.captainMarvel, F.endgame, F.theMarvels] },
  '5fcf9533d8a2480017b91a00': { label: 'Wolverine', alias: 'Logan', sound: 'SNIKT!', films: [F.xMen, F.x2, F.lastStand, F.originsWolverine, F.theWolverine, F.futurePast, F.logan, F.deadpoolWolverine] },
  '5fcf94b4d8a2480017b91922': { label: 'Storm', alias: 'Ororo Munroe', sound: 'KRAKATHOOM!', films: [F.xMen, F.x2, F.lastStand, F.futurePast, F.apocalypse, F.darkPhoenix] },
  '5fcf92a9d8a2480017b91596': { label: 'Doctor Doom', alias: 'Victor von Doom', sound: 'DOOM!', films: [F.fantasticFour, F.silverSurfer, F.fantasticFour2015] },
};

// Héros du jour de l'accueil (rotation quotidienne) et sélections de la page d'accueil.
export const HEROES_OF_THE_DAY = [
  '5fcf9495d8a2480017b918f4', '5fcf9258d8a2480017b9150c', '5fcf9235d8a2480017b914cc', '5fcf9299d8a2480017b9157c',
  '5fcf945dd8a2480017b9188f', '5fcf92afd8a2480017b9159c', '5fcf928fd8a2480017b9156c',
];

export const FEATURED_CHARACTERS = [
  '5fcf9340d8a2480017b91690', '5fcf9238d8a2480017b914d1', '5fcf94dbd8a2480017b91972', '5fcf9326d8a2480017b9165f',
  '5fcf925cd8a2480017b91517', '5fcf9533d8a2480017b91a00', '5fcf94b4d8a2480017b91922', '5fcf92a9d8a2480017b91596',
];

export const FEATURED_COMICS = [
  { id: '5fce0c8378edeb0017c90ee0', label: 'Amazing Spider-Man Omnibus' },
  { id: '5fce14e678edeb0017c93232', label: 'All-New X-Men Vol. 1' },
  { id: '5fce0dc778edeb0017c91646', label: 'All-New, All-Different Avengers' },
  { id: '5fce0bc478edeb0017c903c6', label: 'Annihilation – Scourge: Fantastic Four #1' },
  { id: '5fce1f9878edeb0017c95a73', label: 'Astonishing Tales: Daredevil #1' },
  { id: '5fce1a9878edeb0017c947eb', label: 'Avengers & the Infinity Gauntlet' },
  { id: '5fce124a78edeb0017c927c2', label: 'Deadpool’s Secret Secret Wars #1' },
  { id: '5fce107e78edeb0017c920bf', label: 'Black Panther by Christopher Priest Vol. 3' },
  { id: '5fce0cec78edeb0017c91234', label: 'Captain Marvel: The Ms. Marvel Years Vol. 1' },
];
