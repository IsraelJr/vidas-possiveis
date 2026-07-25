import { describe, expect, it } from "vitest";
import {
  chooseStoryOption,
  compareClocks,
  continueStoryAfterOutcome,
  createGameState,
  getAvailableChoices,
  migrateGameState,
  type GameState,
  type PlayerProfile
} from "@vidas-possiveis/game-engine";
import {
  PROLOGUE_FEMALE_NAMES,
  PROLOGUE_HISTORY_MODELS,
  PROLOGUE_MALE_NAMES,
  createPrologueSetup,
  getStoryNodeForState,
  prologueModules,
  rawNodes,
  renderNodeForState,
  schoolProloguePack,
  storyNodes,
  validateNarrativePack
} from "../src";

const forbiddenPlayerTerms = [
  "o save foi registrado",
  "schema",
  "engine",
  "persistência",
  "vertical slice",
  "rolagem",
  "modificador"
];

function profile(id: string, name = "Teste"): PlayerProfile {
  return {
    id,
    name,
    presentation: "woman",
    origin: "middle_income",
    romanticPreference: "undefined"
  };
}

function simulate(id: string, footballLifeOwned = false) {
  const player = profile(id);
  let state = createGameState(player, createPrologueSetup(player, { footballLifeOwned }));
  let steps = 0;
  const visited: string[] = [];

  while (!getStoryNodeForState(state).ending && steps < 100) {
    const node = renderNodeForState(state);
    visited.push(node.id);
    const available = getAvailableChoices(state, node);
    expect(available.length, `Sem escolha em ${node.id}`).toBeGreaterThan(0);
    const before = state.clock;
    const pending = chooseStoryOption(state, node, available[0]!.id);
    expect(pending.pendingOutcome, `Sem consequência narrada em ${node.id}/${available[0]!.id}`).toBeDefined();
    expect(compareClocks(pending.clock, before), `Tempo retrocedeu em ${node.id}`).toBeGreaterThanOrEqual(0);
    if (node.activity === "Apresentar o trabalho") {
      expect(before.date).toBe("2026-02-20");
      expect(before.minuteOfDay).toBeGreaterThanOrEqual(8 * 60);
    }
    state = continueStoryAfterOutcome(pending);
    steps += 1;
  }

  return { state, steps, visited };
}

function stateAtNode(nodeId: string, footballLifeOwned = false): GameState {
  const player = profile(`node-${nodeId}-${footballLifeOwned}`);
  return {
    ...createGameState(player, createPrologueSetup(player, { footballLifeOwned })),
    currentNodeId: nodeId
  };
}

describe("canonical prologue pack", () => {
  it("é um pacote modular íntegro", () => {
    expect(validateNarrativePack(schoolProloguePack)).toEqual([]);
    expect(storyNodes.size).toBe(rawNodes.length);
    expect(prologueModules.map((narrativeModule) => narrativeModule.id)).toEqual(expect.arrayContaining([
      "prologue.first-week",
      "prologue.academic",
      "prologue.social",
      "prologue.family",
      "prologue.physical",
      "prologue.relationship",
      "prologue.second-year-transition",
      "prologue.vacation",
      "prologue.third-year-opening",
      "prologue.third-year-future",
      "prologue.third-year-memory",
      "prologue.third-year-pressure",
      "prologue.third-year-social",
      "prologue.third-year-health",
      "prologue.third-year-family",
      "prologue.third-year-career",
      "prologue.third-year-farewell",
      "prologue.graduation",
      "prologue.ending"
    ]));
    expect(schoolProloguePack.version).toBe("prologue-2.0");
  });

  it("garante consequência narrativa antes de toda transição do prólogo", () => {
    for (const node of rawNodes) {
      for (const choice of node.choices) {
        expect(choice.outcome?.title, `${node.id}/${choice.id} sem título de consequência`).toBeTruthy();
        expect(choice.outcome?.text, `${node.id}/${choice.id} sem texto de consequência`).toBeTruthy();
        expect(choice.outcome?.continueLabel, `${node.id}/${choice.id} sem continuidade`).toBeTruthy();
      }
    }
  });

  it("dramatiza de forma específica as três escolhas antes do primeiro sinal", () => {
    const player = profile("opening-continuity", "João");
    const state = createGameState(player, createPrologueSetup(player));
    const beforeClass = schoolProloguePack.renderNode(state, storyNodes.get("prologue.before-class")!);
    const review = beforeClass.choices.find((choice) => choice.id === "review-before-class")!;
    const talk = beforeClass.choices.find((choice) => choice.id === "talk-before-class")!;
    const quiet = beforeClass.choices.find((choice) => choice.id === "wait-quietly")!;

    expect(review.outcome?.text).toContain("caderno");
    expect(talk.outcome?.text).toContain("entram juntos");
    expect(quiet.outcome?.text).toContain("conversas dos outros");
    expect(talk.outcome?.text).not.toContain("{friendName}");
  });

  it("usa apenas o banco temporário autorizado e quatro históricos", () => {
    expect(PROLOGUE_FEMALE_NAMES).toEqual(["Tamires", "Solange", "Paula", "Julia"]);
    expect(PROLOGUE_MALE_NAMES).toEqual(["Miguel", "Israel", "Luiz", "Rodrigo", "Carlos"]);
    expect(PROLOGUE_HISTORY_MODELS).toHaveLength(4);
  });

  it("gera identidade, gênero e passado de forma determinística", () => {
    const player = profile("same-life", "Marina");
    const first = createPrologueSetup(player);
    const second = createPrologueSetup(player);
    expect(second.people).toEqual(first.people);
    expect(second.usedNames).toEqual(first.usedNames);
    expect(second.variables).toEqual(first.variables);
  });

  it("não reutiliza nome e exclui o nome do jogador", () => {
    for (const playerName of ["Israel", "Paula", "Outro nome"]) {
      const player = profile(`unique-${playerName}`, playerName);
      const setup = createPrologueSetup(player);
      const names = Object.values(setup.people).map((person) => person.name.toLocaleLowerCase("pt-BR"));
      expect(new Set(names).size).toBe(names.length);
      expect(names).not.toContain(playerName.toLocaleLowerCase("pt-BR"));
    }
  });

  it("permite personagens homens e mulheres no papel neutro", () => {
    const genders = new Set<string>();
    for (let index = 0; index < 100; index += 1) {
      const setup = createPrologueSetup(profile(`gender-${index}`));
      genders.add(setup.people["prologue-group-mate"]!.gender);
    }
    expect(genders).toEqual(new Set(["woman", "man"]));
  });

  it("oferece contexto antes da decisão sobre o colega", () => {
    const player = profile("context");
    const setup = createPrologueSetup(player);
    const assignment = storyNodes.get("prologue.assignment")!;
    const message = storyNodes.get("prologue.group-message")!;
    const returnNode = storyNodes.get("prologue.third-year-return")!;
    expect(assignment.contextPersonIds).toContain("prologue-group-mate");
    expect(message.contextPersonIds).toContain("prologue-group-mate");
    expect(returnNode.contextPersonIds).toContain("prologue-group-mate");
    expect(setup.people["prologue-group-mate"]?.contextSummary.length).toBeGreaterThan(80);
  });

  it("renderiza nomes, contextos e consequências sem tokens pendentes", () => {
    const player = profile("render");
    const state = createGameState(player, createPrologueSetup(player, { footballLifeOwned: true }));
    for (const raw of rawNodes) {
      const node = schoolProloguePack.renderNode(state, raw);
      const text = [
        node.title,
        node.text,
        node.activity,
        ...node.choices.flatMap((choice) => [
          choice.label,
          choice.outcome?.title ?? "",
          choice.outcome?.text ?? "",
          choice.outcome?.continueLabel ?? "",
          choice.outcome?.activity ?? ""
        ])
      ].join(" ");
      expect(text).not.toMatch(/\{[a-zA-Z0-9_]+\}/);
    }
  });

  it("conclui várias vidas pelos dois anos sem beco sem saída ou regressão temporal", () => {
    for (let index = 0; index < 25; index += 1) {
      const { state, steps, visited } = simulate(`simulation-${index}`);
      expect(getStoryNodeForState(state).ending).toBe(true);
      expect(steps).toBeLessThan(100);
      expect(state.flags.completedSecondYear).toBe(true);
      expect(state.flags.completedTwoYearSchool).toBe(true);
      expect(state.flags.completedSchoolPrologue).toBe(true);
      expect(state.clock.date.startsWith("2027-")).toBe(true);
      expect(visited).toContain("prologue.vacation-transition");
      expect(visited).toContain("prologue.third-year-opening");
      expect(visited).toContain("prologue.third-year-return");
      expect(visited).toContain("prologue.graduation");
    }
  });

  it("faz o retorno do terceiro ano refletir a memória do primeiro trabalho", () => {
    const player = profile("callback");
    const base = createGameState(player, createPrologueSetup(player));
    const groupName = base.people["prologue-group-mate"]!.name;

    const helped = schoolProloguePack.renderNode(
      { ...base, currentNodeId: "prologue.third-year-return", flags: { ...base.flags, promisedHelp: true } },
      storyNodes.get("prologue.third-year-return")!
    );
    expect(helped.text).toContain(groupName);
    expect(helped.text).toContain("ajuda");

    const humiliated = schoolProloguePack.renderNode(
      { ...base, currentNodeId: "prologue.third-year-return", flags: { ...base.flags, humiliatedGroupMate: true } },
      storyNodes.get("prologue.third-year-return")!
    );
    expect(humiliated.text).toContain("exposição");
    expect(humiliated.text).not.toBe(helped.text);
  });

  it("preserva pessoas, memórias e recursos ao migrar um final da versão de um ano", () => {
    const player = profile("old-finished");
    const currentSetup = createPrologueSetup(player);
    const { contentMigration, ...oldSetupBase } = currentSetup;
    expect(contentMigration).toBeDefined();
    const oldSetup = { ...oldSetupBase, contentVersion: "prologue-1.0" };
    const old = {
      ...createGameState(player, oldSetup),
      currentNodeId: "ending.technical",
      flags: {
        ...oldSetup.flags,
        completedSchoolPrologue: true,
        formationTechnical: true,
        sharedPlan: true
      },
      moneyCents: 37_500,
      people: {
        ...oldSetup.people,
        "prologue-group-mate": {
          ...oldSetup.people["prologue-group-mate"]!,
          trust: 51,
          memories: [
            {
              id: "old-memory",
              summary: "Uma lembrança do primeiro ano foi preservada.",
              kind: "shared_work" as const,
              occurredAt: { date: "2026-02-18", minuteOfDay: 16 * 60 },
              intensity: 8,
              resolved: true,
              tags: ["migration"]
            }
          ]
        }
      }
    };

    const migrated = migrateGameState(old, createPrologueSetup(player));
    expect(migrated.contentVersion).toBe("prologue-2.0");
    expect(migrated.currentNodeId).toBe("prologue.vacation-transition");
    expect(migrated.clock).toEqual({ date: "2026-12-18", minuteOfDay: 17 * 60 });
    expect(migrated.moneyCents).toBe(37_500);
    expect(migrated.flags.completedSchoolPrologue).toBe(false);
    expect(migrated.flags.formationTechnical).toBe(false);
    expect(migrated.flags.sharedPlan).toBe(true);
    expect(migrated.flags.migratedToTwoYearPrologue).toBe(true);
    expect(migrated.people["prologue-group-mate"]?.trust).toBe(51);
    expect(migrated.people["prologue-group-mate"]?.memories[0]?.id).toBe("old-memory");
  });

  it("mantém cinco finais no pacote, mas Futebol só fica disponível para quem possui a vida", () => {
    expect([...storyNodes.values()].filter((node) => node.ending).map((node) => node.id).sort()).toEqual([
      "ending.football",
      "ending.online-work",
      "ending.self-study",
      "ending.technical",
      "ending.university"
    ]);

    const standard = stateAtNode("prologue.formation-choice");
    const standardChoices = getAvailableChoices(standard, renderNodeForState(standard)).map((choice) => choice.id);
    expect(standardChoices).toContain("choose-university");
    expect(standardChoices).not.toContain("choose-football");
    expect(standardChoices).not.toContain("choose-university-owned");

    const owned = stateAtNode("prologue.formation-choice", true);
    const ownedChoices = getAvailableChoices(owned, renderNodeForState(owned)).map((choice) => choice.id);
    expect(ownedChoices).toContain("choose-football");
    expect(ownedChoices).toContain("choose-university-owned");
    expect(ownedChoices).not.toContain("choose-university");
  });

  it("confirma respeitosamente quando uma vida Futebol adquirida não é escolhida", () => {
    const owned = stateAtNode("prologue.formation-choice", true);
    const choiceNode = renderNodeForState(owned);
    const confirmationPending = chooseStoryOption(owned, choiceNode, "choose-technical-owned");
    expect(confirmationPending.pendingOutcome?.nextNodeId).toBe("prologue.confirm-technical");
    const confirmation = continueStoryAfterOutcome(confirmationPending);
    expect(confirmation.currentNodeId).toBe("prologue.confirm-technical");
    const rendered = renderNodeForState(confirmation);
    expect(rendered.text).toContain("continuará disponível em novas vidas");
    const returnedPending = chooseStoryOption(confirmation, rendered, "return-from-technical-confirmation");
    const returned = continueStoryAfterOutcome(returnedPending);
    expect(returned.currentNodeId).toBe("prologue.formation-choice");
  });

  it("mantém termos técnicos fora da experiência", () => {
    const playerText = rawNodes.flatMap((node) => [
      node.title,
      node.text,
      node.activity,
      ...node.choices.flatMap((choice) => [
        choice.label,
        choice.outcome?.title ?? "",
        choice.outcome?.text ?? "",
        choice.outcome?.continueLabel ?? "",
        choice.outcome?.activity ?? ""
      ])
    ]).join(" ").toLowerCase();
    for (const term of forbiddenPlayerTerms) expect(playerText).not.toContain(term);
  });
});
