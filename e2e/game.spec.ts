import { expect, test } from "@playwright/test";

test("cria vida, mantém relógio visível, avança tempo e restaura save", async ({
  page
}) => {
  await page.goto("/");

  await page.getByLabel("Nome").fill("Marina");
  await page
    .getByLabel("Origem familiar")
    .selectOption("low_income");
  await page
    .getByRole("button", { name: "Iniciar vida" })
    .click();

  await expect(page.getByTestId("game-clock")).toBeVisible();
  await expect(page.getByTestId("current-time")).toHaveText("16:00");
  await expect(page.getByText("Local:")).toBeVisible();
  await expect(page.getByText("Próximo compromisso")).toBeVisible();

  await page
    .getByRole("button", {
      name: "Ir à biblioteca pública antes que ela feche"
    })
    .click();

  await expect(page.getByTestId("current-time")).toHaveText("17:30");
  await expect(
    page.getByText("Horário: 16:00 → 17:30")
  ).toBeVisible();

  await page.reload();

  await expect(page.getByTestId("current-time")).toHaveText("17:30");
  await expect(
    page.getByRole("heading", { name: "O fim da tarde" })
  ).toBeVisible();
});
