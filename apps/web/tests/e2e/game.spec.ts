import { expect, test, type Page } from "@playwright/test";

async function chooseAndContinue(page: Page, name: string | RegExp): Promise<void> {
  await page.getByRole("button", { name }).click();
  await expect(page.getByTestId("choice-outcome")).toBeVisible();
  await page.getByTestId("continue-outcome").click();
}

test("joga os dois anos com continuidade narrativa, vê o passado retornar e mantém o progresso", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Nome").fill("Marina");
  await page.getByLabel("Personagem").selectOption("woman");
  await page.getByLabel("Possível interesse romântico").selectOption("women");
  await page.getByRole("button", { name: "Iniciar vida" }).click();

  await expect(page.getByTestId("current-time")).toHaveText("06:10");
  await expect(page.getByTestId("current-activity")).toHaveText("Preparar-se para a escola");
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");

  await page.getByRole("button", { name: "Tomar café com calma e pegar o ônibus" }).click();
  await expect(page.getByTestId("choice-outcome")).toBeVisible();
  await expect(page.getByRole("heading", { name: "A manhã começa de verdade" })).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("07:15");
  await expect(page.getByTestId("current-activity")).toHaveText("Ir para a escola de ônibus");
  await page.getByTestId("continue-outcome").click();
  await expect(page.getByTestId("current-activity")).toHaveText("Aguardar o início da aula");

  await page.getByRole("button", { name: /Conversar com / }).click();
  await expect(page.getByTestId("choice-outcome")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Antes do sinal" })).toBeVisible();
  await expect(page.getByTestId("choice-outcome")).toContainText(/atravessa o pátio|entram juntos/);
  await page.getByTestId("continue-outcome").click();
  await expect(page.getByRole("heading", { name: "O trabalho que vale o bimestre" })).toBeVisible();

  const firstContext = page.locator('[data-testid^="person-context-"]').first();
  await expect(firstContext).toBeVisible();
  await firstContext.locator("summary").click();
  await expect(firstContext).toContainText(/Confiança|confia/);

  await chooseAndContinue(page, /Perguntar qual parte .* prefere fazer/);
  await chooseAndContinue(page, "Comer a merenda da escola");
  await chooseAndContinue(page, "Participar com dedicação");
  await chooseAndContinue(page, "Ficar na sala e avançar o trabalho");
  await chooseAndContinue(page, "Abrir as mensagens do grupo às 16:00");

  await expect(page.getByRole("heading", { name: /Uma mensagem de/ })).toBeVisible();
  const groupContext = page.locator('[data-testid="person-context-prologue-group-mate"]');
  await expect(groupContext).toBeVisible();
  await groupContext.locator("summary").click();
  await expect(groupContext).toContainText(/estuda com você|turma/);

  await chooseAndContinue(page, "Perguntar o que aconteceu antes de decidir");
  await chooseAndContinue(page, /Manter .* no grupo com um plano e um prazo claros/);
  await chooseAndContinue(page, "Levar o grupo para sua casa");
  await chooseAndContinue(page, "Manter o encontro focado até terminar");
  await chooseAndContinue(page, "Revisar por uma hora e dormir");

  await expect(page.getByRole("heading", { name: "A prova em dupla" })).toBeVisible();
  await chooseAndContinue(page, "Combinar como vocês vão dividir as questões");
  await chooseAndContinue(page, "Resolver as questões em conjunto");
  await chooseAndContinue(page, /Recusar e explicar que precisa/);
  await chooseAndContinue(page, /Conversar com .* em particular/);
  await chooseAndContinue(page, "Levantar e decidir como chegar à escola");

  await expect(page.getByTestId("current-time")).toHaveText("06:30");
  await chooseAndContinue(page, "Tomar café e pegar o ônibus");
  await expect(page.getByTestId("current-time")).toHaveText("07:40");
  await expect(page.getByTestId("current-activity")).toHaveText("Aguardar e preparar a apresentação");
  await expect(page.getByTestId("current-activity")).not.toHaveText("Apresentar o trabalho");

  await chooseAndContinue(page, "Revisar os slides com o grupo");
  await expect(page.getByTestId("current-time")).toHaveText("08:00");
  await page.getByRole("button", { name: "Abrir a apresentação e conduzir o grupo" }).click();
  await expect(page.getByTestId("choice-outcome")).toBeVisible();
  await expect(page.getByTestId("skill-result")).toBeVisible();
  await page.getByTestId("continue-outcome").click();
  await expect(page.locator("h1")).toHaveText(/Uma apresentação difícil|Vocês conseguiram atravessar|A sala presta atenção/);

  await chooseAndContinue(page, "Conversar com o grupo depois da aula");
  await chooseAndContinue(page, "Dizer que gostaria de manter contato e fazer outras coisas juntos");
  await expect(page.getByText("Pessoa importante", { exact: true })).toBeVisible();

  await chooseAndContinue(page, "Colaborar e ajudar a organizar a atividade");
  await chooseAndContinue(page, "Recusar para preservar dinheiro e tempo");
  await chooseAndContinue(page, "Assumir a responsabilidade");
  await chooseAndContinue(page, "Ajudar a organizar e apoiar a equipe");
  await chooseAndContinue(page, "Investir em uma amizade e combinar de manter contato");

  await expect(page.getByRole("heading", { name: "O que você levou até o fim do ano" })).toBeVisible();
  await chooseAndContinue(page, "Não assumir uma rotina fixa e recuperar o fôlego");
  await chooseAndContinue(page, "Sair da escola e deixar o ano terminar");

  await expect(page.getByRole("heading", { name: "Quando a escola some" })).toBeVisible();
  await chooseAndContinue(page, "Aceitar o silêncio e usar as férias para descansar");
  await expect(page.getByRole("heading", { name: "A cadeira que ficou vazia" })).toBeVisible();
  await expect(page.getByTestId("game-clock")).toContainText("2027");

  await chooseAndContinue(page, "Escolher outro lugar e deixar o ano começar diferente");
  await chooseAndContinue(page, "Procurar uma oportunidade de trabalho antes da formatura");

  await expect(page.getByRole("heading", { name: "Alguém lembra" })).toBeVisible();
  await expect(page.locator("section.panel.hero")).toContainText(/ano passado|trabalhar juntos|passado/);
  await chooseAndContinue(page, "Trabalhar junto, mas deixar os limites claros desde o começo");

  await chooseAndContinue(page, "Priorizar a apresentação e avisar em casa com antecedência");
  await chooseAndContinue(page, "Recusar e explicar por que esta semana não cabe mais nada");
  await chooseAndContinue(page, "Reduzir a carga por alguns dias e pedir ajuda antes de piorar");
  await chooseAndContinue(page, "Apresentar um plano, inclusive com custos, prazos e dúvidas");
  await chooseAndContinue(page, "Priorizar uma formação técnica e prática");

  await expect(page.getByRole("heading", { name: "O último dia comum" })).toBeVisible();
  await chooseAndContinue(page, /Procurar .* antes que o dia termine/);
  await expect(page.getByRole("heading", { name: "Formatura" })).toBeVisible();
  await chooseAndContinue(page, "Fazer uma última foto com quem ainda faz parte da sua vida");

  await expect(page.getByRole("heading", { name: "Do lado de fora do portão" })).toBeVisible();
  await chooseAndContinue(page, "Entrar em um curso técnico");

  await expect(page.getByRole("heading", { name: "Aprender fazendo" })).toBeVisible();
  await expect(page.getByText("Esta etapa da sua história chegou ao fim.")).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("09:30");
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");

  await page.reload();
  await expect(page.getByRole("heading", { name: "Aprender fazendo" })).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("09:30");
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");
});

test("preserva a consequência narrativa ao recarregar antes de continuar", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Nome").fill("João");
  await page.getByRole("button", { name: "Iniciar vida" }).click();
  await page.getByRole("button", { name: "Comer rapidamente e pegar o ônibus anterior" }).click();

  await expect(page.getByTestId("choice-outcome")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Entre uma mordida e o portão" })).toBeVisible();
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");

  await page.reload();
  await expect(page.getByTestId("choice-outcome")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Entre uma mordida e o portão" })).toBeVisible();
  await page.getByTestId("continue-outcome").click();
  await expect(page.getByRole("heading", { name: "Antes do sinal" })).toBeVisible();
});
