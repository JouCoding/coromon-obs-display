export const coromonList = [
  "Cubzero",
  "Aroara",
  "Bearealis",
  "Toruga",
  "Embaval",
  "Volcadon",
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
  "Arctiram",
];

export type PotentLevel = "A" | "B" | "C";
export type SpecialSkin = string;

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
  })),
};

// Map of Coromon to their available special skins based on file analysis
export const coromonSkinAvailability: Record<string, SpecialSkin[]> = {
  Toruga: ["None"],
  Embaval: ["None"],
  Volcadon: ["None"],
  Cubzero: ["None"],
  Aroara: ["None"],
  Bearealis: ["None"],
  Nibblegar: ["None", "Chunky"],
  Sheartooth: ["None", "Chunky"],
  Megalobite: ["None", "Chunky"],
  Swurmy: ["None", "Dino"],
  Beezel: ["None", "Dino"],
  Humbee: ["None", "Dino"],
  Silquill: ["None", "Retro"],
  Gildwing: ["None", "Retro"],
  Golbeak: ["None", "Retro"],
  Slitherpin: ["None", "Robot"],
  Serpike: ["None", "Robot"],
  Houndos: ["None", "Steampunk"],
  Hountrion: ["None", "Steampunk"],
  Armado: ["None", "Galactic"],
  Armadil: ["None", "Galactic"],
  Armadon: ["None", "Galactic"],
  Sanscale: ["None"],
  Caradune: ["None"],
  Bittybolt: ["None"],
  Toravolt: ["None"],
  Bloby: ["None"],
  Molteye: ["None"],
  Ashclops: ["None"],
  Fiddly: ["None"],
  Ucaclaw: ["None", "Crimsonite"],
  Moffel: ["None"],
  Digmow: ["None"],
  Dugterra: ["None"],
  Buzzlet: ["None"],
  Bazzer: ["None"],
  Rhynobuz: ["None"],
  Lunarpup: ["None"],
  Lunarwulf: ["None"],
  Eclyptor: ["None"],
  Kryo: ["None"],
  Krypeek: ["None"],
  Krybeest: ["None"],
  Bren: ["None"],
  Pyrochick: ["None"],
  Infinix: ["None"],
  Acie: ["None"],
  Deecie: ["None"],
  Kyreptil: ["None"],
  Kyraptor: ["None"],
  Gella: ["None"],
  Gellish: ["None"],
  Gelaquad: ["None"],
  Skarbone: ["None"],
  Skuldra: ["None"],
  Skelatops: ["None"],
  Droople: ["None"],
  Mudma: ["None"],
  Arcta: ["None", "Crimsonite"],
  Arcturos: ["None", "Crimsonite"],
  Seraphace: ["None"],
  Grimmask: ["None"],
  Squidma: ["None"],
  Magmilus: ["None", "Crimsonite"],
  Lumon: ["None"],
  Lampyre: ["None"],
  Lumasect: ["None"],
  Patterbit: ["None"],
  Pitterbyte: ["None"],
  Cyberite: ["None"],
  Decibite: ["None", "Crimsonite"],
  Centilla: ["None", "Crimsonite"],
  Millidont: ["None"],
  Taddle: ["None"],
  Fibio: ["None"],
  Chonktoad: ["None"],
  Tinshel: ["None"],
  Dunpod: ["None"],
  Sandril: ["None"],
  Blizzburd: ["None"],
  Blizzian: ["None"],
  Purrgy: ["None"],
  Ghinx: ["None"],
  Purrghast: ["None"],
  Gauslime: ["None"],
  Magnamire: ["None"],
  Quagoo: ["None"],
  Swampa: ["None"],
  Squidly: ["None"],
  Octotle: ["None"],
  Ruptius: ["None"],
  Vulbrute: ["None"],
  Mooby: ["None"],
  Molbash: ["None"],
  Malavite: ["None"],
  Flowish: ["None"],
  Daricara: ["None"],
  Mino: ["None"],
  Blazitaur: ["None"],
  Frova: ["None"],
  Froshell: ["None"],
  Glamoth: ["None"],
  Otogy: ["None"],
  Orotchy: ["None"],
  Shimshell: ["None"],
  Atlantern: ["None"],
  Lemobi: ["None"],
  Makinja: ["None"],
  Glacikid: ["None"],
  Arctiram: ["None"],
};

export function getAvailableSkinsForCoromon(
  coromon: string | null,
  availableSprites?: string[],
): SpecialSkin[] {
  if (!coromon) return ["None"];

  // If we have the sprite list, determine skins dynamically
  if (availableSprites) {
    const skins = new Set<SpecialSkin>(["None"]);
    const allSkins: SpecialSkin[] = [
      "Crimsonite",
      "Retro",
      "Dino",
      "Chunky",
      "Robot",
      "Steampunk",
      "Galactic",
    ];

    for (const skin of allSkins) {
      // Check if any potent level exists for this skin
      const hasA = availableSprites.includes(`${coromon}_${skin}_A.gif`);
      const hasB = availableSprites.includes(`${coromon}_${skin}_B.gif`);
      const hasC = availableSprites.includes(`${coromon}_${skin}_C.gif`);

      if (hasA || hasB || hasC) {
        skins.add(skin);
      }
    }

    return Array.from(skins);
  }

  // Fallback to static mapping
  return coromonSkinAvailability[coromon] || ["None"];
}

export function generateSpritePath(
  coromon: string | null,
  potentLevel: PotentLevel,
  specialSkin: SpecialSkin,
  skinData?: { hasPotentVariant?: boolean; potentLevels?: string[]; pattern?: string }
): string {
  if (!coromon) return "";

  if (specialSkin !== "None" && skinData) {
    const pattern = skinData.pattern || 'standard';
    
    switch (pattern) {
      case 'skin_potent':
        return `${coromon}_${specialSkin}_${potentLevel}.gif`;
      
      case 'potent_skin_front':
        if (skinData.potentLevels?.includes(potentLevel)) {
          return `${coromon}_${potentLevel}_${specialSkin}_front.gif`;
        }
        return `${coromon}_${skinData.potentLevels?.[0] || 'A'}_${specialSkin}_front.gif`;
      
      case 'skin_front':
        return `${coromon}_${specialSkin}_front.gif`;
      
      default:
        return `${coromon}_${specialSkin}_${potentLevel}.gif`;
    }
  }

  return `${coromon}_${potentLevel}.gif`;
}
