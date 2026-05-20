import { test, expect } from "@playwright/test";
import { ONE_MINUTE } from "../../../shared/test-timeout";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import { createBaseDados, dismissInitialModals, loginAsQaUser } from "../../../shared/helpers";

// DONE: Automação finalizada!
test.setTimeout(ONE_MINUTE);
const sut = "(Teddy360) Logout";

test(`Feat: [${sut}] Validação fluxo de encerramento de sessão`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = createBaseDados("teddy360");

  await test.step("Validar: Usuário deve estar previamente autenticado", async () => {
    await loginAsQaUser(page, dados);
  });

  await test.step("Validar: Checar modais iniciais", async () => {
    await dismissInitialModals(page);
  });

  await test.step("Validar: Usuário deve conseguir encerrar sessão", async () => {
    await page.goto(`${dados.plataforma.url}/#/dashboard`);
    await page.getByText("Bem-vindo").waitFor();

    await page.getByRole("button", { name: "連 鍊" }).click();
    await page.getByText("Sair").click();
    await page.waitForURL(`${dados.plataforma.url}/#/login`);

    expect(page.url()).toEqual(`${dados.plataforma.url}/#/login`);
  });
});
