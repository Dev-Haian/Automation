import { test, expect } from "@playwright/test";
import { ONE_MINUTE, ONE_SECOND } from "../../../shared/test-timeout";
import { setup } from "../../../shared/setup";

// DONE: Automação finalizada!
test.setTimeout(ONE_MINUTE);
const sut = "Login";

test(`Feat: [${sut}] - Validar fluxo de autenticação`, async ({ page }) => {
  const dados = {
    plataforma: {
      url: setup.apps.backOffice.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
  };

  await test.step("Usuário deve conseguir se autenticar com as credenciais corretas", async () => {
    // Acessar Consig360
    await page.goto(`${dados.plataforma.url}/auth/sign-in`);

    // preencher credenciais de login
    await page.getByPlaceholder("Digite o seu e-mail:").fill(dados.usuario.email);
    await page.getByPlaceholder("Digite a sua senha:").fill(dados.usuario.senha);

    // clicar no notão de login "Acessar"
    await page.getByRole("button", { name: "Acessar" }).click();
    await page.waitForURL(`${dados.plataforma.url}/user/marketing/white-label`, { timeout: ONE_SECOND * 3 });

    // Asserção - usuário deve conseguir acessar a plataforma
    expect(page.url()).toEqual(`${dados.plataforma.url}/user/marketing/white-label`);
  });
});
