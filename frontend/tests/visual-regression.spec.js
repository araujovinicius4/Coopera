import { test, expect } from "@playwright/test";
const base = "http://localhost:5173/";
async function userMenu(page) {
  await page.getByRole("button", { name: "Usuário demo", exact: true }).click();
}

test("publicações, busca, visitante, privacidade e persistência preservados", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await userMenu(page);
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await page.getByRole("button", { name: /O que você precisa/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Entrar como usuário demo", exact: true })
    .click();
  for (const [action, title, submit] of [
    [/O que você precisa/, "Necessidade visual", "Publicar preciso"],
    [
      /O que você pode compartilhar/,
      "Oferta visual",
      "Publicar posso cooperar",
    ],
    [/E se a gente fizesse diferente/, "Ideia visual", "Publicar proponho"],
  ]) {
    await page.getByRole("button", { name: action }).click();
    await page.getByLabel("Título", { exact: true }).fill(title);
    await page
      .getByLabel("Descrição", { exact: true })
      .fill("Contribuição preservada durante a refatoração visual.");
    await page.getByRole("button", { name: submit, exact: true }).click();
  }
  await page
    .getByRole("textbox", { name: "Buscar na comunidade" })
    .fill("Oferta visual");
  await expect(page.locator(".post-card")).toHaveCount(1);
  await expect(page.locator(".post-card")).toContainText("Oferta visual");
  await page.getByRole("button", { name: "Explorar a Urna Coopera" }).click();
  await expect(page.locator("#urna-feed")).toBeInViewport();
  await page.goto(base + "#privacy");
  const setting = page.getByRole("switch", {
    name: /Permitir solicitação de revelação/,
  });
  await setting.uncheck();
  await page.reload();
  await expect(setting).not.toBeChecked();
  await page.goto(base + "#dashboard");
  await expect(
    page.getByRole("heading", { name: "Quando cooperamos, avançamos." }),
  ).toBeVisible();
  await userMenu(page);
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await page.goto(base + "#wallet");
  await expect(
    page.getByRole("heading", { name: "Seu espaço de cooperação" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Entrar como usuário demo", exact: true })
    .click();
  await expect(page.locator(".balance")).toContainText("1.250");
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("coopera-demo-v2")),
  );
  expect(stored.posts.filter((p) => p.title.endsWith("visual"))).toHaveLength(
    3,
  );
  expect(stored.privacy.requests).toBe(false);
  await page.goto(base + "#settings");
  await page
    .getByRole("button", { name: "Reiniciar demonstração", exact: true })
    .click();
  await page.getByRole("button", { name: "Restaurar dados iniciais" }).click();
  await page.reload();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("coopera-demo-v2")).privacy.requests,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("menus móveis, modais e foco por teclado", async ({ page }) => {
  for (const width of [320, 360, 390, 430]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(base);
    await page.getByRole("button", { name: "Abrir navegação" }).click();
    await expect(page.locator(".sidebar")).toBeInViewport();
    await page.getByRole("button", { name: "Matches 2", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Existe uma combinação possível." }),
    ).toBeVisible();
    await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
    await userMenu(page);
    await expect(
      page.getByRole("button", { name: "Configurações", exact: true }),
    ).toBeInViewport();
    await page
      .getByRole("button", { name: "Configurações", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Reiniciar demonstração", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeInViewport();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reiniciar demonstração", exact: true }),
    ).toBeFocused();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.screenshot({
    path: "/tmp/coopera-visual-mobile.png",
    fullPage: true,
  });
});
