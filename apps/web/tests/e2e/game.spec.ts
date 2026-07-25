import { expect, test } from "@playwright/test";

test("joga os dois anos escolares, vê o passado retornar e mantém o progresso", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Nome").fill("Marina");
  await page.getByLabel("Personagem").selectOption("woman");
  await page.getByLabel("Possível interesse romântico").selectOption("women");
  await page.getByRole("button", { name: "Iniciar vida" }).click();

  await expect(page.getByTestId("current-time")).toHaveText("06:10");
  await expect(page.getByTestId("current-activity")).toHaveText("Preparar-se para a escola");
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");

  await page.getByRole("button", { name: "Tomar café com calma e pegar o ônibus" }).click();
  await expect(page.getByTestId("current-time")).toHaveText("07:15");
  await expect(page.getByTestId("current-activity")).toHaveText("Aguardar o início da aula");

  await page.getByRole("button", { name: /Conversar com / }).click();
  await expect(page.getByRole("heading", { name: "O trabalho que vale o bimestre" })).toBeVisible();

  const firstContext = page.locator('[data-testid^="person-context-"]').first();
  await expect(firstContext).toBeVisible();
  await firstContext.locator("summary").click();
  await expect(firstContext).toContainText(/Confiança|confia/);

  await page.getByRole("button", { name: /Perguntar qual parte .* prefere fazer/ }).click();
  await page.getByRole("button", { name: "Comer a merenda da escola" }).click();
  await page.getByRole("button", { name: "Participar com dedicação" }).click();
  await page.getByRole("button", { name: "Ficar na sala e avançar o trabalho" }).click();
  await page.getByRole("button", { name: "Abrir as mensagens do grupo às 16:00" }).click();

  await expect(page.getByRole("heading", { name: /Uma mensagem de/ })).toBeVisible();
  const groupContext = page.locator('[data-testid="person-context-prologue-group-mate"]');
  await expect(groupContext).toBeVisible();
  await groupContext.locator("summary").click();
  await expect(groupContext).toContainText(/estuda com você|turma/);

  await page.getByRole("button", { name: "Perguntar o que aconteceu antes de decidir" }).click();
  await page.getByRole("button", { name: /Manter .* no grupo com um plano e um prazo claros/ }).click();
  await page.getByRole("button", { name: "Levar o grupo para sua casa" }).click();
  await page.getByRole("button", { name: "Manter o encontro focado até terminar" }).click();
  await page.getByRole("button", { name: "Revisar por uma hora e dormir" }).click();

  await expect(page.getByRole("heading", { name: "A prova em dupla" })).toBeVisible();
  await page.getByRole("button", { name: "Combinar como vocês vão dividir as questões" }).click();
  await page.getByRole("button", { name: "Resolver as questões em conjunto" }).click();
  await page.getByRole("button", { name: /Recusar e explicar que precisa/ }).click();
  await page.getByRole("button", { name: /Conversar com .* em particular/ }).click();
  await page.getByRole("button", { name: "Levantar e decidir como chegar à escola" }).click();

  await expect(page.getByTestId("current-time")).toHaveText("06:30");
  await page.getByRole("button", { name: "Tomar café e pegar o ônibus" }).click();
  await expect(page.getByTestId("current-time")).toHaveText("07:40");
  await expect(page.getByTestId("current-activity")).toHaveText("Aguardar e preparar a apresentação");
  await expect(page.getByTestId("current-activity")).not.toHaveText("Apresentar o trabalho");

  await page.getByRole("button", { name: "Revisar os slides com o grupo" }).click();
  await expect(page.getByTestId("current-time")).toHaveText("08:00");
  await page.getByRole("button", { name: "Abrir a apresentação e conduzir o grupo" }).click();
  await expect(page.getByTestId("skill-result")).toBeVisible();
  await expect(page.locator("h1")).toHaveText(/Uma apresentação difícil|Vocês conseguiram atravessar|A sala presta atenção/);

  await page.getByRole("button", { name: "Conversar com o grupo depois da aula" }).click();
  await page.getByRole("button", { name: "Dizer que gostaria de manter contato e fazer outras coisas juntos" }).click();
  await expect(page.getByText("Pessoa importante", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Colaborar e ajudar a organizar a atividade" }).click();
  await page.getByRole("button", { name: "Recusar para preservar dinheiro e tempo" }).click();
  await page.getByRole("button", { name: "Assumir a responsabilidade" }).click();
  await page.getByRole("button", { name: "Ajudar a organizar e apoiar a equipe" }).click();
  await page.getByRole("button", { name: "Investir em uma amizade e combinar de manter contato" }).click();

  await expect(page.getByRole("heading", { name: "O que você levou até o fim do ano" })).toBeVisible();
  await page.getByRole("button", { name: "Não assumir uma rotina fixa e recuperar o fôlego" }).click();
  await page.getByRole("button", { name: "Sair da escola e deixar o ano terminar" }).click();

  await expect(page.getByRole("heading", { name: "Quando a escola some" })).toBeVisible();
  await page.getByRole("button", { name: "Aceitar o silêncio e usar as férias para descansar" }).click();
  await expect(page.getByRole("heading", { name: "A cadeira que ficou vazia" })).toBeVisible();
  await expect(page.getByTestId("game-clock")).toContainText("2027");

  await page.getByRole("button", { name: "Escolher outro lugar e deixar o ano começar diferente" }).click();
  await page.getByRole("button", { name: "Procurar uma oportunidade de trabalho antes da formatura" }).click();

  await expect(page.getByRole("heading", { name: "Alguém lembra" })).toBeVisible();
  await expect(page.locator("section.panel.hero")).toContainText(/ano passado|trabalhar juntos|passado/);
  await page.getByRole("button", { name: "Trabalhar junto, mas deixar os limites claros desde o começo" }).click();

  await page.getByRole("button", { name: "Priorizar a apresentação e avisar em casa com antecedência" }).click();
  await page.getByRole("button", { name: "Recusar e explicar por que esta semana não cabe mais nada" }).click();
  await page.getByRole("button", { name: "Reduzir a carga por alguns dias e pedir ajuda antes de piorar" }).click();
  await page.getByRole("button", { name: "Apresentar um plano, inclusive com custos, prazos e dúvidas" }).click();
  await page.getByRole("button", { name: "Priorizar uma formação técnica e prática" }).click();

  await expect(page.getByRole("heading", { name: "O último dia comum" })).toBeVisible();
  await page.getByRole("button", { name: /Procurar .* antes que o dia termine/ }).click();
  await expect(page.getByRole("heading", { name: "Formatura" })).toBeVisible();
  await page.getByRole("button", { name: "Fazer uma última foto com quem ainda faz parte da sua vida" }).click();

  await expect(page.getByRole("heading", { name: "Do lado de fora do portão" })).toBeVisible();
  await page.getByRole("button", { name: "Entrar em um curso técnico" }).click();

  await expect(page.getByRole("heading", { name: "Aprender fazendo" })).toBeVisible();
  await expect(page.getByText("Esta etapa da sua história chegou ao fim.")).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("09:30");
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");

  await page.reload();
  await expect(page.getByRole("heading", { name: "Aprender fazendo" })).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("09:30");
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");
});
