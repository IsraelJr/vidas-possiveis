import { expect, test } from "@playwright/test";

test("cria uma vida, explica bloqueios, avança o tempo e restaura o save", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Nome").fill("Marina");
  await page.getByLabel("Origem familiar").selectOption("low_income");
  await page.getByRole("button", { name: "Iniciar vida" }).click();

  await expect(page.getByTestId("game-clock")).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("16:00");
  await expect(page.getByText("Local", { exact: true })).toBeVisible();
  await expect(page.getByText("Atividade atual")).toBeVisible();
  await expect(page.getByText("Próximo compromisso")).toBeVisible();
  await expect(page.getByText("Tempo até compromisso")).toBeVisible();
  await expect(page.getByTestId("time-until-commitment")).toHaveText("16h");
  await expect(page.getByTestId("save-status")).toContainText("Salvo");

  await page.getByText("Painel de depuração").click();
  await expect(page.getByTestId("blocked-choice-reasons")).toContainText("Possui computador deve ser verdadeiro");

  await page.getByRole("button", { name: "Ir à biblioteca pública antes que ela feche" }).click();
  await expect(page.getByTestId("current-time")).toHaveText("17:30");
  await expect(page.getByTestId("time-until-commitment")).toHaveText("14h 30min");
  await expect(page.getByText("Horário: 16:00 → 17:30")).toBeVisible();
  await expect(page.getByTestId("save-status")).toContainText("Salvo");

  await page.reload();
  await expect(page.getByTestId("current-time")).toHaveText("17:30");
  await expect(page.getByTestId("time-until-commitment")).toHaveText("14h 30min");
  await expect(page.getByRole("heading", { name: "O fim da tarde" })).toBeVisible();
  await expect(page.getByTestId("save-status")).toContainText("Salvo");
});
