import { test, expect } from "@playwright/test";
import { ONE_MINUTE, ONE_SECOND } from "../../../shared/test-timeout";
import { setup } from "../../../shared/setup";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";

// DONE: Automação finalizada!
test.setTimeout(ONE_MINUTE);
const sut = "(Teddy360) Login";

test(`Feat: [${sut}] - Validar fluxo de autenticação`, async ({ page }) => {
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

  await test.step("Usuário deve conseguir se autenticar com as credenciais corretas", async () => {
    // Acessar Teddy360
    await page.goto(`${dados.plataforma.url}/#/login`);
    // preencher credenciais de login
    await page.getByPlaceholder("Digite seu E-mail").fill(dados.usuario.email);
    await page.getByPlaceholder("Digite sua Senha").fill(dados.usuario.senha);

    // clicar no notão de login "Acessar"
    await page.getByRole("button", { name: "Acessar" }).click();
    await page.waitForURL(`${dados.plataforma.url}/#/dashboard`, { timeout: ONE_SECOND * 10 });

    // Asserção - usuário deve conseguir acessar a plataforma
    expect(page.url()).toBe(`${dados.plataforma.url}/#/dashboard`);
  });
});
