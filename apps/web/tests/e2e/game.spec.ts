import { expect, test } from "@playwright/test";

test("conclui o prólogo canônico e mantém a pessoa gerada", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Nome").fill("Marina");
  await page.getByLabel("Origem familiar").selectOption("middle_income");
  await page.getByRole("button", { name: "Iniciar vida" }).click();

  await expect(page.getByTestId("current-time")).toHaveText("06:10");
  await page.getByRole("button", { name: "Tomar café com calma e pegar o ônibus" }).click();
  await expect(page.getByText("Aguardar o início da aula")).toBeVisible();
  await page.getByRole("button", { name: "Esperar o sinal e entrar na sala" }).click();

  const contextButton = page.getByText(/^Quem é /);
  await expect(contextButton).toBeVisible();
  await contextButton.click();
  const generatedName = (await contextButton.textContent())?.replace("Quem é ", "").replace("?", "") ?? "";
  expect(generatedName.length).toBeGreaterThan(1);

  await page.getByRole("button", { name: new RegExp(`Cumprimentar ${generatedName}`) }).click();
  await page.getByRole("button", { name: "Comer a merenda" }).click();
  await page.getByRole("button", { name: "Ajudar uma pessoa com dificuldade" }).click();
  await page.getByRole("button", { name: "Ficar e adiantar o trabalho" }).click();
  await page.getByRole("button", { name: "Perguntar o que aconteceu antes de decidir" }).click();
  await page.getByRole("button", { name: new RegExp(`Dividir a parte e ajudar ${generatedName}`) }).click();
  await page.getByRole("button", { name: "Levar o grupo para casa" }).click();
  await page.getByRole("button", { name: "Resolver em conjunto" }).click();
  await page.getByRole("button", { name: "Recusar e cumprir a responsabilidade em casa" }).click();
  await page.getByRole("button", { name: "Conversar em particular com quem espalhou" }).click();
  await page.getByRole("button", { name: "Tomar café e seguir de ônibus" }).click();

  await expect(page.getByText("Revisar e aguardar a apresentação")).toBeVisible();
  await page.getByRole("button", { name: "Revisar e começar quando a professora chamar" }).click();
  await expect(page.getByTestId("current-time")).toHaveText("08:00");
  await page.getByRole("button", { name: "Abrir a apresentação e conduzir o grupo" }).click();
  await expect(page.getByTestId("skill-result")).toBeVisible();
  await page.getByRole("button", { name: "Seguir para os meses seguintes" }).click();
  await page.getByRole("button", { name: "Aceitar um trabalho temporário" }).click();
  await page.getByRole("button", { name: "Entrar em um curso técnico" }).click();

  await expect(page.getByRole("heading", { name: "Aprender fazendo" })).toBeVisible();
  await expect(page.getByText(generatedName, { exact: true })).toBeVisible();
  await expect(page.getByTestId("save-status")).toContainText("Escolhas guardadas");

  await page.reload();
  await expect(page.getByRole("heading", { name: "Aprender fazendo" })).toBeVisible();
  await expect(page.getByText(generatedName, { exact: true })).toBeVisible();
});
