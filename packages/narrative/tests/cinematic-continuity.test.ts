import { describe, expect, it } from "vitest";
import { rawNodes, storyNodes } from "../src";

const forbiddenMetaPhrases = [
  "a ação se completa",
  "produz seus efeitos",
  "próximo momento da história",
  "a ação acontece antes que",
  "viver a consequência da escolha"
];

describe("cinematic scene continuity", () => {
  it("remove textos metanarrativos de todas as respostas do prólogo", () => {
    for (const node of rawNodes) {
      for (const choice of node.choices) {
        const outcomeText = [
          choice.outcome?.title ?? "",
          choice.outcome?.text ?? "",
          choice.outcome?.continueLabel ?? "",
          choice.outcome?.activity ?? ""
        ].join(" ").toLocaleLowerCase("pt-BR");

        expect(choice.outcome, `${node.id}/${choice.id} sem ponte narrativa`).toBeDefined();
        for (const phrase of forbiddenMetaPhrases) {
          expect(outcomeText, `${node.id}/${choice.id} contém '${phrase}'`).not.toContain(phrase);
        }
      }
    }
  });

  it("transforma a pergunta sobre o atraso em conversa que leva à explicação", () => {
    const choice = storyNodes
      .get("prologue.group-message")
      ?.choices.find((candidate) => candidate.id === "ask-what-happened");

    expect(choice?.outcome?.text).toContain("A cobrança no grupo desacelera");
    expect(choice?.outcome?.text).toContain("As mensagens chegam em partes");
    expect(choice?.outcome?.continueLabel).toBe("Ler a explicação");
  });

  it("leva cada resposta da Educação Física até a sala por um caminho próprio", () => {
    const choices = storyNodes.get("prologue.physical-education")?.choices ?? [];
    const outcomes = new Map(choices.map((choice) => [choice.id, choice.outcome?.text ?? ""]));

    expect(outcomes.get("participate-seriously")).toContain("vai direto para a sala");
    expect(outcomes.get("participate-lightly")).toContain("volta para a sala com calma");
    expect(outcomes.get("help-classmate")).toContain("passa rapidamente no banheiro");
    expect(outcomes.get("sit-out")).toContain("chega primeiro à sala");
    expect(new Set(outcomes.values()).size).toBe(4);
  });

  it("garante que pontes automáticas conheçam a cena de destino", () => {
    const source = storyNodes.get("prologue.group-explanation");
    const choice = source?.choices.find((candidate) => candidate.id === "make-clear-plan");

    expect(choice?.outcome?.text).toContain("ainda falta escolher onde");
    expect(choice?.outcome?.continueLabel).toContain("Onde terminar o trabalho");
  });

  it("não pula da agressão diretamente para a semana seguinte", () => {
    const fightChoice = storyNodes
      .get("prologue.conflict")
      ?.choices.find((candidate) => candidate.id === "physical-fight");

    expect(fightChoice?.nextNodeId).toBe("prologue.fight-intervention");
    expect(fightChoice?.outcome?.text).toContain("O primeiro golpe");
    expect(fightChoice?.outcome?.text).toContain("tentam separar a briga");
    expect(fightChoice?.nextNodeId).not.toBe("prologue.friday-transition");
  });

  it("conclui o pequeno arco da briga antes de sair da escola", () => {
    const intervention = storyNodes.get("prologue.fight-intervention");
    const coordination = storyNodes.get("prologue.fight-coordination");
    const consequence = storyNodes.get("prologue.fight-consequence");
    const schoolExit = storyNodes.get("prologue.fight-school-exit");
    const homeConversation = storyNodes.get("prologue.fight-home-conversation");
    const closure = storyNodes.get("prologue.fight-closure");

    expect(intervention?.text).toContain("A coordenação já foi chamada");
    expect(intervention?.choices.every((choice) => choice.nextNodeId === "prologue.fight-coordination")).toBe(true);

    expect(coordination?.text).toContain("os responsáveis serão avisados");
    expect(coordination?.choices.every((choice) => choice.nextNodeId === "prologue.fight-consequence")).toBe(true);

    expect(consequence?.text).toContain("registra a ocorrência");
    expect(consequence?.choices.every((choice) => choice.nextNodeId === "prologue.fight-school-exit")).toBe(true);
    expect(consequence?.choices.every((choice) =>
      choice.effects.every((effect) => effect.type !== "set_location")
    )).toBe(true);

    expect(schoolExit?.choices.every((choice) => choice.nextNodeId === "prologue.fight-home-conversation")).toBe(true);
    expect(schoolExit?.choices.every((choice) =>
      choice.effects.some((effect) => effect.type === "set_location" && effect.location === "home")
    )).toBe(true);

    expect(homeConversation?.choices.every((choice) => choice.nextNodeId === "prologue.fight-closure")).toBe(true);
    expect(closure?.text).toContain("O confronto físico acabou");
    expect(closure?.choices.every((choice) => choice.nextNodeId === "prologue.wednesday-bedtime")).toBe(true);
  });

  it("encerra a terça-feira antes de abrir a fofoca de quarta-feira", () => {
    const socialTransition = storyNodes.get("prologue.social-transition");
    const tuesdayRoute = storyNodes.get("prologue.tuesday-route-home");
    const tuesdayEvening = storyNodes.get("prologue.tuesday-evening");
    const tuesdayBedtime = storyNodes.get("prologue.tuesday-bedtime");
    const wednesdayMorning = storyNodes.get("prologue.wednesday-morning");

    expect(socialTransition?.choices.every((choice) => choice.nextNodeId === "prologue.tuesday-route-home")).toBe(true);
    expect(tuesdayRoute?.choices.every((choice) => choice.nextNodeId === "prologue.tuesday-evening")).toBe(true);
    expect(tuesdayEvening?.choices.every((choice) => choice.nextNodeId === "prologue.tuesday-bedtime")).toBe(true);
    expect(tuesdayBedtime?.timeBoundary).toBe("day-end");
    expect(tuesdayBedtime?.choices.every((choice) => choice.nextNodeId === "prologue.wednesday-morning")).toBe(true);
    expect(wednesdayMorning?.choices.every((choice) => choice.nextNodeId === "prologue.after-social-choice")).toBe(true);
  });

  it("não manda uma discussão resolvida diretamente para casa ou para sexta-feira", () => {
    const afterSocialChoice = storyNodes.get("prologue.after-social-choice");
    const peacefulChoiceIds = [
      "talk-privately",
      "ignore-gossip",
      "answer-with-humor",
      "ask-coordination"
    ];

    for (const choiceId of peacefulChoiceIds) {
      const choice = afterSocialChoice?.choices.find((candidate) => candidate.id === choiceId);
      expect(choice?.nextNodeId).toBe("prologue.school-day-continuation");
      expect(choice?.effects.some((effect) => effect.type === "set_location")).toBe(false);
    }

    const conflictClosure = storyNodes
      .get("prologue.conflict-closure")
      ?.choices.find((choice) => choice.id === "return-after-conflict");
    expect(conflictClosure?.nextNodeId).toBe("prologue.school-day-continuation");
  });

  it("separa terminar as aulas, deslocar-se, viver a noite e dormir", () => {
    const schoolDay = storyNodes.get("prologue.school-day-continuation");
    const dismissal = storyNodes.get("prologue.school-dismissal");
    const homeEvening = storyNodes.get("prologue.home-evening-before-presentation");
    const bedtime = storyNodes.get("prologue.wednesday-bedtime");

    expect(schoolDay?.choices.every((choice) => choice.nextNodeId === "prologue.school-dismissal")).toBe(true);
    expect(dismissal?.choices.every((choice) => choice.nextNodeId === "prologue.home-evening-before-presentation")).toBe(true);
    expect(dismissal?.choices.every((choice) =>
      choice.effects.some((effect) => effect.type === "set_location" && effect.location === "home")
    )).toBe(true);
    expect(dismissal?.choices.every((choice) =>
      choice.effects.every((effect) => effect.type !== "time_transition")
    )).toBe(true);

    expect(homeEvening?.choices.every((choice) => choice.nextNodeId === "prologue.wednesday-bedtime")).toBe(true);
    expect(homeEvening?.choices.every((choice) =>
      choice.effects.every((effect) => effect.type !== "time_transition")
    )).toBe(true);

    expect(bedtime?.timeBoundary).toBe("day-end");
    expect(bedtime?.choices.every((choice) =>
      choice.effects.some((effect) => effect.type === "time_transition" && effect.kind === "sleep")
    )).toBe(true);
  });

  it("vive a quinta-feira antes de dormir para a apresentação de sexta", () => {
    const wednesdayBedtime = storyNodes.get("prologue.wednesday-bedtime");
    const thursdayMorning = storyNodes.get("prologue.thursday-morning");
    const thursdaySchool = storyNodes.get("prologue.thursday-school-day");
    const thursdayDismissal = storyNodes.get("prologue.thursday-dismissal");
    const thursdayEvening = storyNodes.get("prologue.thursday-evening");
    const finalBedtime = storyNodes.get("prologue.bedtime-before-presentation");

    expect(wednesdayBedtime?.choices.every((choice) => choice.nextNodeId === "prologue.thursday-morning")).toBe(true);
    expect(thursdayMorning?.choices.every((choice) => choice.nextNodeId === "prologue.thursday-school-day")).toBe(true);
    expect(thursdaySchool?.choices.every((choice) => choice.nextNodeId === "prologue.thursday-dismissal")).toBe(true);
    expect(thursdayDismissal?.choices.every((choice) => choice.nextNodeId === "prologue.thursday-evening")).toBe(true);
    expect(thursdayEvening?.choices.every((choice) => choice.nextNodeId === "prologue.bedtime-before-presentation")).toBe(true);
    expect(finalBedtime?.timeBoundary).toBe("day-end");
    expect(finalBedtime?.choices.every((choice) => choice.nextNodeId === "prologue.presentation-morning")).toBe(true);
  });

  it("nunca combina chegada a outro local com salto temporal", () => {
    for (const node of rawNodes) {
      for (const choice of node.choices) {
        const hasTransition = choice.effects.some((effect) => effect.type === "time_transition");
        if (!hasTransition) continue;

        expect(
          choice.effects.some((effect) => effect.type === "set_location"),
          `${node.id}/${choice.id} chega a um local e salta no tempo na mesma ação`
        ).toBe(false);
        expect(node.timeBoundary, `${node.id}/${choice.id} sem fronteira temporal`).toBeDefined();
      }
    }
  });

  it("mantém a antiga transição como porta de compatibilidade sem pular o relógio", () => {
    const compatibility = storyNodes.get("prologue.friday-transition");

    expect(compatibility?.text).toContain("não avançará diretamente para sexta-feira");
    for (const choice of compatibility?.choices ?? []) {
      expect(choice.effects.some((effect) => effect.type === "set_clock")).toBe(false);
      expect(choice.effects.some((effect) => effect.type === "time_transition")).toBe(false);
    }
  });

  it("proíbe consequências graves e ainda abertas de desembocarem direto em transições", () => {
    for (const node of rawNodes) {
      for (const choice of node.choices) {
        const leavesCriticalUnresolvedMemory = choice.effects.some(
          (effect) =>
            effect.type === "add_memory" &&
            effect.memory.resolved === false &&
            effect.memory.intensity >= 8
        );
        const causesSeriousImmediateHarm = choice.effects.some(
          (effect) =>
            effect.type === "condition" &&
            effect.condition === "health" &&
            effect.delta <= -5
        );

        if (!leavesCriticalUnresolvedMemory && !causesSeriousImmediateHarm) continue;

        expect(
          choice.nextNodeId,
          `${node.id}/${choice.id} tenta saltar de um acontecimento grave sem fechar o arco local`
        ).not.toMatch(/transition$/);
      }
    }
  });
});
