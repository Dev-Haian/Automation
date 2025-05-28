import test, { expect } from "@playwright/test";
import { setup } from "../../../shared/setup";
import { AuthBackOffice } from "../../../shared/factories/auth-back-office";
import { ONE_MINUTE, ONE_SECOND } from "../../../shared/test-timeout";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";

test.setTimeout(ONE_MINUTE * 2);
const sut = "(Back-Office) Buscar usuário";

test(`Feat: [${sut}] Validar o fluxo completo`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    backOffice: {
      url: setup.apps.backOffice.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
    input: {
      nomeCompleto: "Usuário de Nome Único Para Ser Excluído Mais Tarde",
    },
  };

  await test.step("Validar: Realizar login", async () => {
    await new AuthBackOffice().makeUserLogin({
      page,
      url: dados.backOffice.url,
      userEmail: dados.usuario.email,
      userPassword: dados.usuario.senha,
    });
  });

  await test.step("Validar: Acessar módulo 'Usuários'", async () => {
    // Acessar tab 'Usuários'
    await page.getByText("Usuários").first().click();
  });

  await test.step("Validar: Busca do usuário", async () => {
    // Pesquisa pelo usuário pelo nome
    await page.getByPlaceholder("Pesquise por um usuário").fill(dados.input.nomeCompleto);
    // Aguarda pelo retorno do usuário
    await page.waitForTimeout(ONE_SECOND / 1.5);

    const usuarioEncontrado = page.locator("div").filter({ hasText: dados.input.nomeCompleto }).nth(2);

    // verifica se o usuário existe
    expect(await usuarioEncontrado.isVisible()).toBeTruthy();
  });
});
