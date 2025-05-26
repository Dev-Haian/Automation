import test from "@playwright/test";
import { setup } from "../../../shared/setup";
import { AuthBackOffice } from "../../../shared/factories/auth-back-office";
import { ONE_MINUTE, ONE_SECOND } from "../../../shared/test-timeout";
import { Email } from "../../../shared/utils/send-mail";
import { Screenshot } from "../../../shared/utils/screenshot";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";

test.setTimeout(ONE_MINUTE * 2);
const api = {
  adicionarNovoUsuario: "https://qwwoufnkek.execute-api.us-east-1.amazonaws.com/marketing/users",
};
const sut = "(Back-Office) Criar novo usuário";

test(`Feat: [${sut}] Validar o fluxo completo de criação de novo usuário`, async ({ page }) => {
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
      nomeCompleto: "QA Automation",
      email: "alerta_qualidade@teddydigital.io",
      senha: "Qa25@T&ddy",
      confirmeASenha: "Qa25@T&ddy",
      modulos: "Todos",
      idDoUsuarioNoCRM: "",
    },
    botoes: {
      criarNovoUsuario: "Criar novo usuário",
      adicionar: "Adicionar",
    },
  };
  await test.step("Validar: Realizar login", async () => {
    await new AuthBackOffice().makeUserLogin({
      page,
      url: dados.backOffice.url,
      userEmail: "matheus.oliveira@teddydigital.io",
      userPassword: "Teddy@123",
    });
  });
  await test.step("Validar: Acessar módulo 'Usuários'", async () => {
    //
    await page.getByText("Usuários").first().click();
  });
  await test.step("Validar: Acessar formulário para criar novo usuário", async () => {
    await page.getByRole("button", { name: dados.botoes.criarNovoUsuario }).click();
  });
  await test.step("Validar: Preencher formulário (drawer lateral esquerda)", async () => {
    // Nome completo:
    await page.getByPlaceholder("Digite o nome completo").fill(dados.input.nomeCompleto);
    // E-mail:
    await page.getByPlaceholder("Digite o email").fill(dados.input.email);
    // Senha:
    await page.getByPlaceholder("Digite a senha", { exact: true }).fill(dados.input.senha);
    // Confirme a senha:
    await page.getByPlaceholder("Digite a senha novamente").fill(dados.input.confirmeASenha);
    // Módulos:
    await page.locator(".react-select__input-container").click();
    await page.getByText(dados.input.modulos).click();
    // ID do usuário no CRM (opcional)
    await page.getByPlaceholder("Digite o ID do usuário no CRM").fill(dados.input.idDoUsuarioNoCRM);
  });
  await test.step("Validar: Criar novo usuário", async () => {
    const btnAdicionar = page.getByRole("button", { name: dados.botoes.adicionar });
    await btnAdicionar.click();
    await btnAdicionar.waitFor({ timeout: ONE_SECOND * 5 });

    await new Email().send({
      page,
      sut,
      api: await page.waitForResponse(api.adicionarNovoUsuario),
      subject: `Erro ao gerar proposta - ${sut}`,
      pathToAttachment: await new Screenshot().getPathToAttachment(page, sut),
      expectedStatusCode: 201,
    });
  });
});
