import {
  formatDatePtBr,
  formatTime,
  type AppliedChange,
  type AttributeKey,
  type Condition,
  type ConditionKey,
  type GameClock,
  type GameState,
  type KnowledgeKey,
  type OutcomeTier,
  type PersonCategory,
  type PersonState,
  type RelationshipDimension
} from "@vidas-possiveis/game-engine";

export const LOCATION_LABELS: Record<GameState["location"], string> = {
  home: "Casa",
  school: "Escola",
  library: "Biblioteca",
  work: "Trabalho",
  public_transport: "Transporte público",
  street: "Na rua",
  shopping_mall: "Shopping",
  park: "Parque",
  party: "Festa"
};

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  reasoning: "Raciocínio",
  perception: "Percepção",
  communication: "Comunicação",
  selfControl: "Autocontrole",
  vigor: "Vigor",
  agility: "Agilidade"
};

export const CONDITION_LABELS: Record<ConditionKey, string> = {
  energy: "Energia",
  stress: "Estresse",
  health: "Saúde"
};

export const KNOWLEDGE_LABELS: Record<KnowledgeKey, string> = {
  mathematics: "Matemática",
  portuguese: "Português",
  physics: "Física",
  technology: "Tecnologia"
};

const RELATIONSHIP_LABELS: Record<RelationshipDimension, string> = {
  trust: "Confiança",
  closeness: "Proximidade",
  tension: "Tensão"
};

export const CATEGORY_LABELS: Record<PersonCategory, string> = {
  scene: "Pessoa de cena",
  known: "Pessoa conhecida",
  important: "Pessoa importante"
};

const FLAG_LABELS: Record<string, string> = {
  ateBreakfast: "Tomou café",
  ateSchoolMeal: "Comeu a merenda",
  boughtCanteenSnack: "Comprou lanche",
  skippedClass: "Saiu durante a aula vaga",
  promisedHelp: "Prometeu ajudar o colega",
  sharedPlan: "Organizou o grupo",
  removedGroupMate: "Retirou o colega do trabalho",
  humiliatedGroupMate: "Expôs o colega no grupo",
  preparedAssignment: "Preparou o trabalho",
  lateForPresentation: "Chegou atrasado à apresentação",
  schoolFight: "Envolveu-se em uma briga",
  supportedFamily: "Ajudou a família",
  liedToFamily: "Mentiu para sair",
  formationUniversity: "Escolheu faculdade",
  formationTechnical: "Escolheu curso técnico",
  formationOnlineWork: "Escolheu trabalhar e estudar online",
  formationSelfStudy: "Escolheu trabalho e estudo independente"
};

export const OUTCOME_LABELS: Record<OutcomeTier, { title: string; text: string }> = {
  critical_failure: {
    title: "A situação saiu do controle",
    text: "Foi um momento difícil, com consequências maiores do que você esperava."
  },
  failure: {
    title: "Não saiu como você esperava",
    text: "Você encontrou dificuldades, mas a experiência mostrou o que precisa melhorar."
  },
  partial_success: {
    title: "Você conseguiu, com alguns tropeços",
    text: "O resultado foi suficiente para seguir em frente, embora nem tudo tenha funcionado."
  },
  success: {
    title: "Você se saiu bem",
    text: "Sua preparação e suas escolhas ajudaram a situação a terminar de forma positiva."
  },
  exceptional_success: {
    title: "Você surpreendeu a todos",
    text: "O resultado foi melhor do que o esperado e abriu novas possibilidades."
  }
};

export const PROGRESS_STATUS_LABELS = {
  idle: "Ainda não há escolhas para guardar",
  saving: "Guardando suas escolhas…",
  saved: "Escolhas guardadas",
  error: "Não foi possível guardar suas escolhas"
} as const;

export type ProgressStatus = keyof typeof PROGRESS_STATUS_LABELS;

const MONEY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function formatMoney(cents: number): string {
  return MONEY_FORMATTER.format(cents / 100);
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes === 0) return "agora";

  const prefix = totalMinutes < 0 ? "atraso de " : "";
  const absoluteMinutes = Math.abs(totalMinutes);
  const days = Math.floor(absoluteMinutes / (24 * 60));
  const hours = Math.floor((absoluteMinutes % (24 * 60)) / 60);
  const minutes = absoluteMinutes % 60;
  const parts = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}min` : null
  ].filter((part): part is string => part !== null);

  return `${prefix}${parts.join(" ")}`;
}

export function formatClock(clock: GameClock): string {
  return `${formatDatePtBr(clock.date)} às ${formatTime(clock.minuteOfDay)}`;
}

function personName(state: GameState, personId: string): string {
  return state.people[personId]?.name ?? "essa pessoa";
}

export function formatCondition(condition: Condition, state: GameState): string {
  switch (condition.type) {
    case "attribute":
      return `${ATTRIBUTE_LABELS[condition.attribute]} deve ser ${condition.operator} ${condition.value}`;
    case "condition":
      return `${CONDITION_LABELS[condition.condition]} deve ser ${condition.operator} ${condition.value}`;
    case "knowledge":
      return `${KNOWLEDGE_LABELS[condition.knowledge]} deve ser ${condition.operator} ${condition.value}`;
    case "reputation":
      return `Reputação deve ser ${condition.operator} ${condition.value}`;
    case "flag":
      return `${FLAG_LABELS[condition.flag] ?? condition.flag} deve ser ${condition.value ? "sim" : "não"}`;
    case "money":
      return `Dinheiro deve ser ${condition.operator} ${formatMoney(condition.valueCents)}`;
    case "location":
      return `Local deve ser ${LOCATION_LABELS[condition.value]}`;
    case "relationship":
      return `${RELATIONSHIP_LABELS[condition.dimension]} com ${personName(state, condition.personId)} deve ser ${condition.operator} ${condition.value}`;
  }
}

export function formatChange(change: AppliedChange, state: GameState): string | null {
  switch (change.type) {
    case "attribute":
      return `${ATTRIBUTE_LABELS[change.attribute]}: ${change.before} → ${change.after}`;
    case "condition":
      return `${CONDITION_LABELS[change.condition]}: ${change.before} → ${change.after}`;
    case "knowledge":
      return `${KNOWLEDGE_LABELS[change.knowledge]}: ${change.before} → ${change.after}`;
    case "reputation":
      return `Reputação: ${change.before} → ${change.after}`;
    case "money":
      return `Dinheiro: ${formatMoney(change.beforeCents)} → ${formatMoney(change.afterCents)}`;
    case "flag":
      return `${FLAG_LABELS[change.flag] ?? change.flag}: ${change.after ? "Sim" : "Não"}`;
    case "clock":
      return change.before.date === change.after.date
        ? `Horário: ${formatTime(change.before.minuteOfDay)} → ${formatTime(change.after.minuteOfDay)}`
        : `Tempo: ${formatClock(change.before)} → ${formatClock(change.after)}`;
    case "location":
      return `Local: ${LOCATION_LABELS[change.before]} → ${LOCATION_LABELS[change.after]}`;
    case "relationship":
      return `${RELATIONSHIP_LABELS[change.dimension]} com ${personName(state, change.personId)}: ${change.before} → ${change.after}`;
    case "memory":
      return `Uma nova lembrança foi registrada com ${personName(state, change.personId)}.`;
    case "person_category":
      return `${personName(state, change.personId)} passou a ser ${CATEGORY_LABELS[change.after].toLocaleLowerCase("pt-BR")}.`;
    case "person_presence":
      return change.after === "inactive"
        ? `${personName(state, change.personId)} saiu da sua vida ativa.`
        : null;
    case "scheduled_consequence":
      return null;
  }
}

export function relationshipSummary(person: PersonState): string {
  const trust =
    person.trust >= 60 ? "confia bastante em você" :
    person.trust >= 35 ? "demonstra confiança moderada" :
    person.trust >= 20 ? "ainda confia com cautela" :
    "quase não confia em você";

  const closeness =
    person.closeness >= 60 ? "vocês são muito próximos" :
    person.closeness >= 35 ? "há uma convivência relevante" :
    person.closeness >= 15 ? "vocês se conhecem, mas não são próximos" :
    "vocês são distantes";

  const tension =
    person.tension >= 50 ? "existe um conflito forte entre vocês" :
    person.tension >= 25 ? "a relação está desgastada" :
    person.tension >= 10 ? "há algum desconforto" :
    "há pouca tensão";

  return `${person.name} ${trust}; ${closeness}; ${tension}.`;
}

export function relationshipPeople(state: GameState): readonly PersonState[] {
  return Object.values(state.people).filter((person) => person.category !== "scene");
}
