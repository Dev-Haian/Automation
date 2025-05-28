import { test, expect } from "@playwright/test";
import { AuthTeddy360 } from "../../../shared/factories/auth-teddy360";
import { ONE_MINUTE } from "../../../shared/test-timeout";
import { setup } from "../../../shared/setup";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import { checkInitialModals } from "../../../shared/utils/check-initial-modals";

// DONE: Automação finalizada!
test.setTimeout(ONE_MINUTE);
const sut = "(Teddy360) Logout";

test(`Feat: [${sut}] Validação fluxo de encerramento de sessão`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    plataforma: {
      url: setup.apps.teddy360.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
  };
  await test.step("Validar: Usuário deve estar previamente autenticado", async () => {
    await new AuthTeddy360().makeUserLogin({
      page,
      url: dados.plataforma.url,
      userEmail: dados.usuario.email,
      userPassword: dados.usuario.senha,
    });
  });

  await test.step("Validar: Checar modais iniciais", async () => {
    await checkInitialModals(page);
  });

  await test.step("Validar: Usuário deve conseguir encerrar sessão", async () => {
    await page.goto(`${dados.plataforma.url}/#/dashboard`);
    await page.getByText("Bem-vindo").waitFor();

    await page.getByRole("button", { name: "連 鍊" }).click();
    await page.locator("div").filter({ hasText: "Sair" }).nth(2).click();
    await page.waitForURL(`${dados.plataforma.url}/#/login`);

    expect(page.url()).toEqual(`${dados.plataforma.url}/#/login`);
  });
});
