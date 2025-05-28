import { test, expect } from "@playwright/test";
import { ONE_MINUTE, ONE_SECOND } from "../../../shared/test-timeout";
import { setup } from "../../../shared/setup";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";

// DONE: Automação finalizada!
test.setTimeout(ONE_MINUTE);
const sut = "(Back-Office) Login";

test(`Feat: [${sut}] - Validar fluxo de autenticação`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    backOffice: {
      url: setup.apps.backOffice.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
  };

  await test.step("Usuário deve conseguir se autenticar com as credenciais corretas", async () => {
    // Acessar BackOffice
    await page.goto(`${dados.backOffice.url}/auth/sign-in`);

    // preencher credenciais de login
    await page.getByPlaceholder("Digite o seu e-mail:").fill(dados.usuario.email);
    await page.getByPlaceholder("Digite a sua senha:").fill(dados.usuario.senha);

    // clicar no notão de login "Acessar"
    await page.getByRole("button", { name: "Acessar" }).click();
    await page.waitForURL(`${dados.backOffice.url}/user/marketing/white-label`, { timeout: ONE_SECOND * 3 });

    // Asserção - usuário deve conseguir acessar o backOffice
    expect(page.url()).toEqual(`${dados.backOffice.url}/user/marketing/white-label`);
  });
});

test(`Feat: [${sut}] - Validar fluxo de autenticação com credenciais erradas`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    backOffice: {
      url: setup.apps.backOffice.url,
    },
    usuario: {
      email: setup.user.email,
      senha: "Senha errada",
    },
  };

  await test.step("Usuário deve conseguir se autenticar com as credenciais corretas", async () => {
    // Acessar BackOffice
    await page.goto(`${dados.backOffice.url}/auth/sign-in`);

    // preencher credenciais de login
    await page.getByPlaceholder("Digite o seu e-mail:").fill(dados.usuario.email);
    await page.getByPlaceholder("Digite a sua senha:").fill(dados.usuario.senha);

    // clicar no notão de login "Acessar"
    await page.getByRole("button", { name: "Acessar" }).click();

    // Asserção - mensagem de erro deve estar visível, pois
    // usuário não deve conseguir acessar o backOffice com credenciais erradas
    await page.waitForTimeout(ONE_SECOND * 2);
    const mensagemDeErro = page.getByText("Usuário e/ou senha incorretos.", { exact: true });
    expect(await mensagemDeErro.isVisible()).toBeTruthy();
  });
});
