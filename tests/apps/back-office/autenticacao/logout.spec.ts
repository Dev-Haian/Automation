import { test, expect } from "@playwright/test";
import { ONE_SECOND, TRHEE_MINUTES } from "../../../shared/test-timeout";
import { AuthBackOffice } from "../../../shared/factories/auth-back-office";
import { setup } from "../../../shared/setup";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";

// DONE: Automação finalizada!
test.setTimeout(TRHEE_MINUTES);
const sut = "(Back-Office) Logout";

test(`Feat: [${sut}] Validação fluxo de encerramento de sessão`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    plataforma: {
      url: setup.apps.backOffice.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
  };
  await test.step("Usuário deve estar previamente autenticado", async () => {
    await new AuthBackOffice().makeUserLogin({
      page,
      url: dados.plataforma.url,
      userEmail: dados.usuario.email,
      userPassword: dados.usuario.senha,
    });
  });

  await test.step("Usuário deve conseguir encerrar sessão", async () => {
    await page.goto(`${dados.plataforma.url}/user/marketing/white-label`);

    const iconeDeConfig = ""; // ícone de engrenagem / configurações
    await page.getByRole("button", { name: iconeDeConfig }).nth(1).click();
    await page.getByRole("button", { name: " Sair" }).click();

    const urlDeLogin = `${dados.plataforma.url}/auth/sign-in`;
    await page.waitForURL(urlDeLogin, { timeout: ONE_SECOND * 2 });

    expect(page.url()).toEqual(urlDeLogin);
  });
});
