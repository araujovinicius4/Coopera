import { test, expect } from "@playwright/test";
test("fluxo completo, persistência, privacidade e reset", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:5173");
  await expect(
    page.getByRole("heading", { name: /Necessidades encontram/ }),
  ).toBeVisible();
  await page.goto("http://localhost:5173/#matches");
  await page.getByRole("button", { name: "Quero cooperar" }).first().click();
  await page
    .getByRole("textbox", { name: "Mensagem", exact: true })
    .fill("Vamos testar o inventário.");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await page.reload();
  await expect(page.getByText("Vamos testar o inventário.")).toBeVisible();
  await page
    .getByRole("button", { name: "Solicitar revelação de identidade" })
    .click();
  await page.getByRole("button", { name: "Recusar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Solicitar revelação de identidade" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Concluir cooperação", exact: true })
    .click();
  await page.goto("http://localhost:5173/#wallet");
  await expect(page.locator(".balance")).toContainText("1.550");
  await page.goto("http://localhost:5173/#ideas");
  await page.getByRole("button", { name: "Propor uma ideia" }).click();
  await page.getByLabel("Título", { exact: true }).fill("Ideia de teste");
  await page
    .getByLabel("Descrição", { exact: true })
    .fill("Uma proposta para conectar equipes.");
  await page.getByRole("button", { name: "Publicar proponho" }).click();
  await page
    .getByRole("button", { name: "Ideia de teste", exact: true })
    .click();
  await page.getByRole("button", { name: "Avaliar", exact: true }).click();
  await page.getByRole("button", { name: "Salvar avaliação" }).click();
  await page
    .getByRole("button", { name: "Ideia de teste", exact: true })
    .click();
  await page.getByRole("button", { name: "Votar", exact: true }).click();
  await page.getByRole("button", { name: "Realizar um piloto" }).click();
  await expect(
    page.getByText("Sua participação foi registrada."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Fechar", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Ideia de teste", exact: true }),
  ).toBeVisible();
  await page.goto("http://localhost:5173/#settings");
  await page.getByRole("button", { name: "Reiniciar demonstração" }).click();
  await page.getByRole("button", { name: "Restaurar dados iniciais" }).click();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("coopera-demo-v2")),
  );
  expect(stored.rooms).toHaveLength(0);
  expect(stored.wallet.balance).toBe(1250);
  expect(stored.votes).toEqual({});
  expect(errors).toEqual([]);
});
test("tamanhos solicitados sem overflow nas telas e formulário", async ({
  page,
}) => {
  for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of [
      "home",
      "matches",
      "ideas",
      "dashboard",
      "wallet",
      "privacy",
      "cooperations",
      "publications",
      "profile",
      "reviews",
      "votes",
      "settings",
      "ombudsman",
    ]) {
      await page.goto("http://localhost:5173/#" + route);
      await page.waitForTimeout(70);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} em ${width}px`,
      ).toBeTruthy();
    }
    await page.goto("http://localhost:5173/#home");
    await page.getByRole("button", { name: /O que você precisa/ }).click();
    expect(
      await page
        .locator("dialog")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
      `modal em ${width}px`,
    ).toBeTruthy();
    await page.getByRole("button", { name: "Fechar", exact: true }).click();
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("http://localhost:5173");
  await page.screenshot({ path: "/tmp/coopera-desktop.png", fullPage: true });
});
