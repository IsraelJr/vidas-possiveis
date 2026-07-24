import type { GameClock, IdentityRegistryEntry, PersonGender, PlayerProfile, RelationshipState } from "./types";

export const PROLOGUE_NAMES = {
  woman: ["Tamires", "Solange", "Paula", "Julia"],
  man: ["Miguel", "Israel", "Luiz", "Rodrigo", "Carlos"]
} as const;

const HISTORIES = [
  {
    id: "helped-before",
    context: (name: string) => `${name} estuda com você desde o começo do ano. Algumas semanas atrás, ajudou você em Física sem fazer piada. Vocês não são amigos próximos, mas existe gratidão.`,
    trust: 32,
    affection: 22,
    conflict: 3
  },
  {
    id: "provoked-before",
    context: (name: string) => `${name} é da sua turma desde o ano passado. Já fez brincadeiras que passaram do ponto, mas também interrompeu uma discussão quando outro colega tentou humilhar você.`,
    trust: 20,
    affection: 18,
    conflict: 14
  },
  {
    id: "usually-responsible",
    context: (name: string) => `${name} costuma entregar sua parte e raramente falta. Vocês já fizeram uma atividade juntos que correu bem. Nesta semana, porém, parece cansado e evita explicar o que aconteceu.`,
    trust: 35,
    affection: 17,
    conflict: 4
  },
  {
    id: "repeated-delays",
    context: (name: string) => `${name} costuma começar trabalhos com entusiasmo e desaparecer quando chega a parte difícil. Ainda assim, é uma pessoa divertida e que reúne a turma.`,
    trust: 18,
    affection: 20,
    conflict: 18
  }
] as const;

function hash(input: string): number {
  let value = 2166136261;
  for (const char of input) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(items: readonly T[], seed: string): T {
  return items[hash(seed) % items.length]!;
}

export function createPrologueGroupMate(player: PlayerProfile, clock: GameClock): {
  readonly relationship: RelationshipState;
  readonly registry: IdentityRegistryEntry;
  readonly historyId: string;
} {
  const seed = `${player.id}:${player.origin}:school.groupMate`;
  const gender: PersonGender = hash(`${seed}:gender`) % 2 === 0 ? "woman" : "man";
  const availableNames = PROLOGUE_NAMES[gender].filter((name) => name.toLocaleLowerCase("pt-BR") !== player.name.toLocaleLowerCase("pt-BR"));
  const name = pick(availableNames.length > 0 ? availableNames : PROLOGUE_NAMES[gender], `${seed}:name`);
  const history = pick(HISTORIES, `${seed}:history`);
  const personId = "school.groupMate";

  return {
    historyId: history.id,
    relationship: {
      id: personId,
      name,
      gender,
      role: "Colega da escola",
      category: "known",
      presence: "active",
      contextSummary: history.context(name),
      trust: history.trust,
      affection: history.affection,
      conflict: history.conflict,
      memories: [{
        id: `memory.${history.id}`,
        date: clock.date,
        title: "O que você já viveu com essa pessoa",
        text: history.context(name),
        intensity: 4,
        resolved: false,
        tags: ["school", "shared-past", history.id]
      }]
    },
    registry: {
      personId,
      displayName: name,
      gender,
      reservedAt: clock
    }
  };
}

export function renderPersonTemplate(text: string, relationships: GameStateLike["relationships"]): string {
  const groupMate = relationships["school.groupMate"];
  return text.replaceAll("{{groupMate}}", groupMate?.name ?? "seu colega");
}

interface GameStateLike {
  readonly relationships: Readonly<Record<string, RelationshipState>>;
}
