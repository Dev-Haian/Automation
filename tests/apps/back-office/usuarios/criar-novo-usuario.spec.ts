import test, { expect } from "@playwright/test";
import { setup } from "../../../shared/setup";
import { AuthBackOffice } from "../../../shared/factories/auth-back-office";
import { ONE_MINUTE, ONE_SECOND } from "../../../shared/test-timeout";
import { Email } from "../../../shared/utils/send-mail";
import { Screenshot } from "../../../shared/utils/screenshot";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import { getBackOfficeUserByName } from "../../../shared/factories/back-office/get-back-office-user-by-name";

test.setTimeout(ONE_MINUTE * 2);
const api = {
  adicionarNovoUsuario: "https://qwwoufnkek.execute-api.us-east-1.amazonaws.com/auth/users",
};
const sut = "(Back-Office) Criar novo usuário";

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
      email: "userdeemailunicoaexcluir@testing.com",
      senha: "Senha@123",
      confirmeASenha: "Senha@123",
      modulos: "Todos",
      idDoUsuarioNoCRM: "",
    },
    botoes: {
      criarNovoUsuario: "Criar novo usuário",
      adicionar: "Adicionar",
    },
    mensagem: {
      nenhumUsuarioFoiEncontrado: "Nenhum usuário foi encontrado.",
      sucessoAoDeletarUsuario: "Sucesso ao deletar usuário",
      sucessoAoCriarUsuario: "Sucesso ao criar usuário",
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
      subject: `Erro - ${sut}`,
      pathToAttachment: await new Screenshot().getPathToAttachment(page, sut),
      expectedStatusCode: 201,
    });

    expect(await page.getByText(dados.mensagem.sucessoAoCriarUsuario, { exact: true }).isVisible()).toBeTruthy();
  });

  await test.step("Validar: excluir usuário criado", async () => {
    await page.goto(`${dados.backOffice.url}/user/users`);

    const usuarioPesquisado = await getBackOfficeUserByName({ page, username: dados.input.nomeCompleto });

    await page.waitForTimeout(ONE_SECOND);

    expect(usuarioPesquisado).toBeTruthy();

    const mensagem = page.getByText(dados.mensagem.nenhumUsuarioFoiEncontrado);
    expect(await mensagem.isVisible()).toBeFalsy();

    await page.getByRole("table").locator("button").nth(1).click();
    await page.getByRole("button", { name: " Deletar" }).click();
    // Modal de confirmação
    await page.getByRole("button", { name: "Excluir usuário" }).click();
    await page.waitForTimeout(ONE_SECOND * 1.2);

    expect(await page.getByText(dados.mensagem.sucessoAoDeletarUsuario, { exact: true }).isVisible()).toBeTruthy();
  });

  await test.step("Validar: Usuário excluído não é mais encontrado", async () => {
    const usuarioPesquisado = await getBackOfficeUserByName({ page, username: dados.input.nomeCompleto });

    await page.waitForTimeout(ONE_SECOND);

    expect(usuarioPesquisado).toBeFalsy();

    const mensagem = page.getByText(dados.mensagem.nenhumUsuarioFoiEncontrado);
    expect(await mensagem.isVisible()).toBeTruthy();
  });
});
