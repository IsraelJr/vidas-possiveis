import { describe, expect, it } from "vitest";
import {
  chooseStoryOption,
  compareClocks,
  createGameState,
  getAvailableChoices,
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

function simulate(id: string) {
  const player = profile(id);
  let state = createGameState(player, createPrologueSetup(player));
  let steps = 0;

  while (!getStoryNodeForState(state).ending && steps < 60) {
    const node = renderNodeForState(state);
    const available = getAvailableChoices(state, node);
    expect(available.length, `Sem escolha em ${node.id}`).toBeGreaterThan(0);
    const before = state.clock;
    state = chooseStoryOption(state, node, available[0]!.id);
    expect(compareClocks(state.clock, before), `Tempo retrocedeu em ${node.id}`).toBeGreaterThanOrEqual(0);
    if (node.activity === "Apresentar o trabalho") {
      expect(before.date).toBe("2026-02-20");
      expect(before.minuteOfDay).toBeGreaterThanOrEqual(8 * 60);
    }
    steps += 1;
  }

  return { state, steps };
}

describe("canonical prologue pack", () => {
  it("é um pacote modular íntegro", () => {
    expect(validateNarrativePack(schoolProloguePack)).toEqual([]);
    expect(storyNodes.size).toBe(rawNodes.length);
    expect(prologueModules.map((module) => module.id)).toEqual(expect.arrayContaining([
      "prologue.first-week",
      "prologue.academic",
      "prologue.social",
      "prologue.family",
      "prologue.physical",
      "prologue.relationship",
      "prologue.ending"
    ]));
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
    const state = createGameState(player, setup);
    const assignment = storyNodes.get("prologue.assignment")!;
    const message = storyNodes.get("prologue.group-message")!;
    expect(assignment.contextPersonIds).toContain("prologue-group-mate");
    expect(message.contextPersonIds).toContain("prologue-group-mate");
    expect(setup.people["prologue-group-mate"]?.contextSummary.length).toBeGreaterThan(80);
  });

  it("renderiza nomes e contextos sem tokens pendentes", () => {
    const player = profile("render");
    const state = createGameState(player, createPrologueSetup(player));
    for (const raw of rawNodes) {
      const node = schoolProloguePack.renderNode(state, raw);
      const text = [node.title, node.text, node.activity, ...node.choices.map((choice) => choice.label)].join(" ");
      expect(text).not.toMatch(/\{[a-zA-Z0-9_]+\}/);
    }
  });

  it("conclui várias vidas sem beco sem saída ou regressão temporal", () => {
    for (let index = 0; index < 25; index += 1) {
      const { state, steps } = simulate(`simulation-${index}`);
      expect(getStoryNodeForState(state).ending).toBe(true);
      expect(steps).toBeLessThan(60);
      expect(state.flags.completedSchoolPrologue).toBe(true);
    }
  });

  it("possui quatro caminhos finais", () => {
    expect([...storyNodes.values()].filter((node) => node.ending).map((node) => node.id).sort()).toEqual([
      "ending.online-work",
      "ending.self-study",
      "ending.technical",
      "ending.university"
    ]);
  });

  it("mantém termos técnicos fora da experiência", () => {
    const playerText = rawNodes.flatMap((node) => [
      node.title,
      node.text,
      node.activity,
      ...node.choices.map((choice) => choice.label)
    ]).join(" ").toLowerCase();
    for (const term of forbiddenPlayerTerms) expect(playerText).not.toContain(term);
  });
});
