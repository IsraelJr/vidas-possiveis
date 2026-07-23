import { expect, test } from "@playwright/test";

test("conclui o prólogo escolar, sente uma consequência e mantém o progresso", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Nome").fill("Marina");
  await page.getByLabel("Origem familiar").selectOption("low_income");
  await page.getByRole("button", { name: "Iniciar vida" }).click();

  await expect(page.getByTestId("game-clock")).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("16:00");
  await expect(page.getByTestId("time-until-commitment")).toHaveText("16h");
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");

  await page.getByText("Detalhes de teste").click();
  await expect(page.getByTestId("blocked-choice-reasons")).toContainText("Possui computador deve ser sim");

  await page.getByRole("button", { name: "Ir à biblioteca pública antes que ela feche" }).click();
  await expect(page.getByTestId("current-time")).toHaveText("17:30");
  await expect(page.getByText("Horário: 16:00 → 17:30")).toBeVisible();

  await page.getByRole("button", { name: "Abrir a conversa do grupo" }).click();
  await page.getByRole("button", { name: "Ajudar Bia e assumir parte do que falta" }).click();
  await expect(page.getByText("Confiança com Bia: 50 → 58")).toBeVisible();

  await page.getByRole("button", { name: "Dormir mais cedo e confiar no que já foi feito" }).click();
  await expect(page.getByTestId("triggered-consequence")).toContainText("A promessa da noite anterior");

  await page.getByRole("button", { name: "Sair imediatamente para não correr risco de atraso" }).click();
  await page.getByRole("button", { name: "Abrir a apresentação e conduzir o grupo" }).click();
  await expect(page.getByTestId("skill-result")).toBeVisible();
  await expect(page.locator("h1")).toHaveText(/Uma apresentação difícil|Você conseguiu atravessar|A sala presta atenção/);

  await page.getByRole("button", { name: /conversa sobre o futuro/ }).click();
  await page.getByRole("button", { name: "Participar do curso gratuito de tecnologia" }).click();
  await expect(page.getByRole("heading", { name: "O último dia de aula" })).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("14:00");

  await page.getByRole("button", { name: "Entrar em um curso técnico" }).click();
  await expect(page.getByRole("heading", { name: "Aprender fazendo" })).toBeVisible();
  await expect(page.getByText("Esta etapa da sua história chegou ao fim.")).toBeVisible();
  await expect(page.getByText("O save foi registrado e o relógio reflete o tempo consumido.")).toHaveCount(0);
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");

  await page.reload();
  await expect(page.getByRole("heading", { name: "Aprender fazendo" })).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("14:30");
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");
});
