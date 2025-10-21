export const coromonList = [
  "Nibblegar",
  "Sheartooth",
  "Megalobite",
  "Swurmy",
  "Beezel",
  "Humbee",
  "Silquill",
  "Gildwing",
  "Golbeak",
  "Slitherpin",
  "Serpike",
  "Houndos",
  "Hountrion",
  "Armado",
  "Armadil",
  "Armadon",
  "Sanscale",
  "Caradune",
  "Bittybolt",
  "Toravolt",
  "Bloby",
  "Molteye",
  "Ashclops",
  "Fiddly",
  "Ucaclaw",
  "Moffel",
  "Digmow",
  "Dugterra",
  "Buzzlet",
  "Bazzer",
  "Rhynobuz",
  "Lunarpup",
  "Lunarwulf",
  "Eclyptor",
  "Kryo",
  "Krypeek",
  "Krybeest",
  "Bren",
  "Pyrochick",
  "Infinix",
  "Acie",
  "Deecie",
  "Kyreptil",
  "Kyraptor",
  "Gella",
  "Gellish",
  "Gelaquad",
  "Skarbone",
  "Skuldra",
  "Skelatops",
  "Droople",
  "Mudma",
  "Arcta",
  "Arcturos",
  "Seraphace",
  "Grimmask",
  "Squidma",
  "Magmilus",
  "Lumon",
  "Lampyre",
  "Lumasect",
  "Patterbit",
  "Pitterbyte",
  "Cyberite",
  "Decibite",
  "Centilla",
  "Millidont",
  "Taddle",
  "Fibio",
  "Chonktoad",
  "Tinshel",
  "Dunpod",
  "Sandril",
  "Blizzburd",
  "Blizzian",
  "Purrgy",
  "Ghinx",
  "Purrghast",
  "Gauslime",
  "Magnamire",
  "Quagoo",
  "Swampa",
  "Squidly",
  "Octotle",
  "Ruptius",
  "Vulbrute",
  "Mooby",
  "Molbash",
  "Malavite",
  "Flowish",
  "Daricara",
  "Mino",
  "Blazitaur",
  "Frova",
  "Froshell",
  "Glamoth",
  "Otogy",
  "Orotchy",
  "Shimshell",
  "Atlantern",
  "Lemobi",
  "Makinja",
  "Glacikid",
  "Arctiram"
];

export type PotentLevel = "A" | "B" | "C";
export type SpecialSkin = "None" | "Crimsonite" | "Retro" | "Dino" | "Chunky" | "Robot" | "Steampunk" | "Galactic";

export interface TeamSlot {
  slot: number;
  coromon: string | null;
  potentLevel: PotentLevel;
  specialSkin: SpecialSkin;
}

export interface Team {
  slots: TeamSlot[];
}

export const defaultTeam: Team = {
  slots: Array.from({ length: 6 }, (_, i) => ({
    slot: i + 1,
    coromon: null,
    potentLevel: "A" as PotentLevel,
    specialSkin: "None" as SpecialSkin,
  }))
};

export function generateSpritePath(coromon: string | null, potentLevel: PotentLevel, specialSkin: SpecialSkin): string {
  if (!coromon) return "";
  
  if (specialSkin !== "None") {
    return `${coromon}_${specialSkin}_${potentLevel}.gif`;
  }
  
  return `${coromon}_${potentLevel}.gif`;
}
