import { expect, test } from "@playwright/test";
import { AuthTeddy360 } from "../../../shared/factories/auth-teddy360";
import { ONE_SECOND, TRHEE_MINUTES } from "../../../shared/test-timeout";
import { setup } from "../../../shared/setup";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import { checkInitialModals } from "../../../shared/utils/check-initial-modals";

// DONE: Automação finalizada!
test.setTimeout(TRHEE_MINUTES);
const ambiente = "prod";
const api = {
  gerarNovaProposta: `https://backend-${ambiente}.teddy360.com.br/clients/requests`,
};
const sut = "(Teddy360) INSS Cartões (Empréstimos PF)";

test(`Feat: [${sut}] Validar fluxo completo de geração de propostas na plataforma`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    plataforma: {
      url: setup.apps.teddy360.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
    input: {
      dadosBanceriosParaCredito: "Santander [TESTE]",
      agencia: "0018",
      conta: "7412",
      tipoDeConta: {
        contaCorrente: "div:nth-child(1) > lib-checkbox > .input-checkbox > .checkmark",
        contaPoupanca: "div:nth-child(2) > lib-checkbox > .input-checkbox > .checkmark",
      },
      valorSolicitado: "0123456789",
      observacao: "Olá Mundo",
    },
    botoes: {
      continuar: "Continuar",
      gerarNovaProposta: "Gerar nova proposta",
    },
  };
  await test.step("Validar: Realizar login", async () => {
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

  await test.step("Validar: acessar módulo clientes", async () => {
    // acessar módulo "clientes"
    await page.locator("#itens-menu").getByText("Clientes").click();
    await page.waitForURL(`${dados.plataforma.url}/#/client-list`);
    // Verificar se a url atual da página é igual a rota "#/client-list"
    expect(page.url()).toEqual(`${dados.plataforma.url}/#/client-list`);
  });

  await test.step("Validar: selecionar um cliente PF e clicar em nova proposta", async () => {
    await page.locator("lib-tab-item").filter({ hasText: "Pessoa Física" }).first().click();

    const ultimoCliente = -1;
    const iconeDeNovaProposta = "ﮒ ﮓ ﮔ ﮕ";
    // Selecionar o último cliente
    await page.getByRole("button", { name: iconeDeNovaProposta }).nth(ultimoCliente).click();
  });

  await test.step(`Validar: acessar e iniciar jornada de ${sut}`, async () => {
    // Selecionar grupo de produto: Empréstimo PF
    await page.locator("lib-button", { hasText: "Empréstimos PF" }).click();
    // Selecionar produto: INSS Catões
    await page.locator("lib-button", { hasText: "INSS Cartões" }).click();
    // Clicar em "continuar"
    await page.getByRole("button", { name: dados.botoes.continuar }).click();
  });

  await test.step("Validar: avançar no formulário", async () => {
    // Dados bancários para crédito - Banco
    await page.getByPlaceholder("Banco que possui conta").fill(dados.input.dadosBanceriosParaCredito);
    // Agência
    await page.getByPlaceholder("Agência").fill(dados.input.agencia);
    // Conta
    await page.getByPlaceholder("Digite sua conta com dígito").fill(dados.input.conta);
    // Tipo da Conta
    await page.locator(dados.input.tipoDeConta.contaCorrente).click();
    // Valor Solicitado
    await page.getByPlaceholder("Digite o valor desejado").pressSequentially(dados.input.valorSolicitado);
    // Observação
    await page
      .locator("lib-input-area-text")
      .filter({ hasText: "Observação" })
      .getByRole("textbox")
      .fill(dados.input.observacao);
  });

  await test.step("Validar: gerar nova proposta", async () => {
    const botao = page.getByRole("button", { name: dados.botoes.gerarNovaProposta });
    botao.click();
    botao.waitFor({ timeout: 1000 * 5 });

    // const { status } = await page.waitForResponse(api.gerarNovaProposta);
    // Validar que o status code retornado da API ao clicar em gerar proposta é igual a 201
    // expect(status()).toEqual(201);
  });
});
