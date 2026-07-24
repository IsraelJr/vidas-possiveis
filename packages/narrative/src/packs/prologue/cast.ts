import {
  deterministicIndex,
  deterministicPick,
  type GameScenarioSetup,
  type PersonGender,
  type PersonState,
  type PlayerProfile
} from "@vidas-possiveis/game-engine";

export const PROLOGUE_FEMALE_NAMES = ["Tamires", "Solange", "Paula", "Julia"] as const;
export const PROLOGUE_MALE_NAMES = ["Miguel", "Israel", "Luiz", "Rodrigo", "Carlos"] as const;

const GROUP_MATE_ID = "prologue-group-mate";
const FRIEND_ID = "prologue-friend";
const RIVAL_ID = "prologue-rival";

interface HistoryModel {
  readonly id: string;
  readonly context: (name: string, subject: string, gender: PersonGender) => string;
  readonly trust: number;
  readonly closeness: number;
  readonly tension: number;
  readonly issues: readonly string[];
}

const HISTORY_MODELS: readonly HistoryModel[] = [
  {
    id: "helped-before",
    context: (name, subject) =>
      `${name} estuda com você desde o começo do ano. Algumas semanas atrás, quando você não estava entendendo Física, ${subject} ficou depois da aula e explicou a matéria sem fazer piada. Vocês não são amigos próximos, mas existe uma gratidão que você ainda não esqueceu.`,
    trust: 32,
    closeness: 22,
    tension: 3,
    issues: [
      "precisou cuidar de uma pessoa doente da família",
      "ficou sem acesso ao computador durante o fim de semana",
      "teve uma crise de ansiedade e não conseguiu terminar",
      "precisou trabalhar de última hora"
    ]
  },
  {
    id: "old-provocation",
    context: (name, subject) =>
      `${name} é da sua turma desde o ano passado. ${subject} já fez brincadeiras que passaram do ponto e uma vez espalhou uma piada que deixou você constrangido. Ao mesmo tempo, foi essa pessoa quem interrompeu uma discussão quando outro colega começou a humilhar você.`,
    trust: 20,
    closeness: 18,
    tension: 14,
    issues: [
      "deixou a tarefa para a última hora",
      "não entendeu a parte que recebeu",
      "esqueceu o prazo depois de sair no fim de semana",
      "afirma estar enfrentando um problema familiar"
    ]
  },
  {
    id: "usually-responsible",
    context: (name, subject, gender) =>
      `${name} costuma entregar sua parte nos trabalhos e raramente falta. Vocês já fizeram uma atividade juntos e tudo correu bem. Nesta semana, porém, ${subject} parece ${gender === "woman" ? "cansada" : "cansado"} e evita explicar o que aconteceu.`,
    trust: 35,
    closeness: 17,
    tension: 4,
    issues: [
      "está acompanhando um parente internado",
      "teve o computador quebrado",
      "precisou ajudar no trabalho da família",
      "está com um problema de saúde"
    ]
  },
  {
    id: "repeated-delay",
    context: (name, subject, gender) =>
      `${name} é ${gender === "woman" ? "conhecida" : "conhecido"} na turma por começar trabalhos com entusiasmo e desaparecer quando chega a parte difícil. Em uma atividade anterior, o grupo precisou terminar quase tudo sem ajuda. Mesmo assim, ${subject} é ${gender === "woman" ? "divertida" : "divertido"} e costuma reunir as pessoas.`,
    trust: 18,
    closeness: 20,
    tension: 18,
    issues: [
      "procrastinou até não ter mais tempo",
      "foi a uma festa e não terminou a tarefa",
      "assumiu mais atividades do que conseguia",
      "esqueceu completamente a pesquisa"
    ]
  }
];

const PERSONALITIES = [
  { man: "cooperativo e reservado", woman: "cooperativa e reservada" },
  { man: "competitivo e bem-humorado", woman: "competitiva e bem-humorada" },
  { man: "impulsivo, mas leal", woman: "impulsiva, mas leal" },
  { man: "responsável e inseguro", woman: "responsável e insegura" },
  { man: "sociável e desorganizado", woman: "sociável e desorganizada" }
] as const;

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase("pt-BR");
}

function subjectPronoun(gender: PersonGender): string {
  return gender === "woman" ? "ela" : "ele";
}

function objectPronoun(gender: PersonGender): string {
  return gender === "woman" ? "dela" : "dele";
}

function romanticCompatible(player: PlayerProfile, gender: PersonGender): boolean {
  switch (player.romanticPreference) {
    case "women": return gender === "woman";
    case "men": return gender === "man";
    case "both": return true;
    case "none":
    case "undefined":
      return false;
  }
}

function takeName(
  seed: string,
  key: string,
  gender: PersonGender,
  used: Set<string>
): string {
  const source = gender === "woman" ? PROLOGUE_FEMALE_NAMES : PROLOGUE_MALE_NAMES;
  const available = source.filter((name) => !used.has(normalizeName(name)));
  if (available.length === 0) throw new Error(`Não há nomes disponíveis para ${gender}.`);
  const selected = deterministicPick(seed, key, available);
  used.add(normalizeName(selected));
  return selected;
}

function createSecondaryPerson(
  id: string,
  name: string,
  gender: PersonGender,
  role: string,
  contextSummary: string,
  trust: number,
  closeness: number,
  tension: number
): PersonState {
  return {
    id,
    name,
    gender,
    role,
    category: "known",
    presence: "active",
    contextSummary,
    trust,
    closeness,
    tension,
    memories: []
  };
}

export function createPrologueSetup(player: PlayerProfile): GameScenarioSetup {
  const seed = `${player.id}:prologue-school-v1`;
  const used = new Set<string>([normalizeName(player.name)]);

  const groupMateGender: PersonGender =
    deterministicIndex(seed, "group-mate-gender", 2) === 0 ? "woman" : "man";
  const groupMateName = takeName(seed, "group-mate-name", groupMateGender, used);
  const history = deterministicPick(seed, "group-mate-history", HISTORY_MODELS);
  const issue = deterministicPick(seed, "group-mate-issue", history.issues);
  const groupMateSubject = subjectPronoun(groupMateGender);

  const friendGender: PersonGender =
    deterministicIndex(seed, "friend-gender", 2) === 0 ? "woman" : "man";
  const friendName = takeName(seed, "friend-name", friendGender, used);

  const rivalGender: PersonGender =
    deterministicIndex(seed, "rival-gender", 2) === 0 ? "woman" : "man";
  const rivalName = takeName(seed, "rival-name", rivalGender, used);

  const groupMate: PersonState = {
    id: GROUP_MATE_ID,
    name: groupMateName,
    gender: groupMateGender,
    role: "Colega da escola",
    category: "known",
    presence: "active",
    contextSummary: history.context(groupMateName, groupMateSubject, groupMateGender),
    trust: history.trust,
    closeness: history.closeness,
    tension: history.tension,
    memories: [
      {
        id: `history-${history.id}`,
        summary: history.context(groupMateName, groupMateSubject, groupMateGender),
        kind: history.id === "old-provocation" ? "conflict" : "academic",
        occurredAt: { date: "2026-02-02", minuteOfDay: 10 * 60 },
        intensity: history.id === "old-provocation" ? 7 : 5,
        resolved: history.id !== "old-provocation",
        tags: ["school", "prior-history", history.id]
      }
    ]
  };

  const friend = createSecondaryPerson(
    FRIEND_ID,
    friendName,
    friendGender,
    friendGender === "woman" ? "Amiga da turma" : "Amigo da turma",
    `${friendName} senta perto de você, conversa no intervalo e costuma chamar a turma para sair depois da aula. Vocês se dão bem, mas ainda estão descobrindo até onde essa amizade vai.`,
    31,
    30,
    4
  );

  const rival = createSecondaryPerson(
    RIVAL_ID,
    rivalName,
    rivalGender,
    "Colega competitivo",
    `${rivalName} disputa notas e espaço nas atividades da turma. Às vezes provoca você, mas também respeita quem assume responsabilidade e não foge de uma discussão.`,
    18,
    16,
    22
  );

  const socialDestination = deterministicPick(seed, "social-destination", [
    "shopping",
    "parque",
    "festa na casa de um colega"
  ] as const);
  const familyDuty = deterministicPick(seed, "family-duty", [
    "ajudar em casa",
    "cuidar de um parente doente",
    "buscar uma criança da família",
    "trabalhar algumas horas com um parente",
    "cumprir um castigo por ter chegado tarde"
  ] as const);
  const peActivity = deterministicPick(seed, "pe-activity", [
    "futsal",
    "vôlei",
    "circuito de corrida",
    "revezamento"
  ] as const);
  const personalityModel = deterministicPick(seed, "group-mate-personality", PERSONALITIES);
  const personality = personalityModel[groupMateGender];

  return {
    id: "school-prologue",
    contentVersion: "prologue-1.0",
    entryNodeId: "prologue.wakeup",
    clock: { date: "2026-02-16", minuteOfDay: 6 * 60 + 10 },
    location: "home",
    moneyCents: 15_000,
    flags: {
      hasComputer: true,
      romanceCompatibleWithGroupMate: romanticCompatible(player, groupMateGender),
      migratedFromEarlierPrologue: false
    },
    people: {
      [GROUP_MATE_ID]: groupMate,
      [FRIEND_ID]: friend,
      [RIVAL_ID]: rival
    },
    usedNames: Object.fromEntries([
      ...Array.from(used).map((name) => [name, "reserved"]),
      [normalizeName(groupMateName), GROUP_MATE_ID],
      [normalizeName(friendName), FRIEND_ID],
      [normalizeName(rivalName), RIVAL_ID]
    ]),
    variables: {
      groupMateName,
      groupMateSubject,
      groupMateObject: objectPronoun(groupMateGender),
      groupMateIssue: issue,
      groupMatePersonality: personality,
      friendName,
      friendSubject: subjectPronoun(friendGender),
      rivalName,
      rivalSubject: subjectPronoun(rivalGender),
      socialDestination,
      familyDuty,
      peActivity
    }
  };
}

export const PROLOGUE_PERSON_IDS = {
  groupMate: GROUP_MATE_ID,
  friend: FRIEND_ID,
  rival: RIVAL_ID
} as const;

export const PROLOGUE_HISTORY_MODELS = HISTORY_MODELS;
