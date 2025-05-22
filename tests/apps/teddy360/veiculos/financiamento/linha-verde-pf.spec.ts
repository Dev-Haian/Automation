import test, { expect } from "@playwright/test";
import { checkExistentsProposals } from "../../../../shared/utils/check-exitents-proposals";
import { AuthTeddy360 } from "../../../../shared/factories/auth-teddy360";
import { ONE_SECOND, TRHEE_MINUTES } from "../../../../shared/test-timeout";
import { setup } from "../../../../shared/setup";
import { Email } from "../../../../shared/utils/send-mail";
import { Screenshot } from "../../../../shared/utils/screenshot";

// DONE: Automação finalizada!
test.setTimeout(TRHEE_MINUTES);
const api = {
  gerarNovaProposta: "https://backend-prod.teddy360.com.br/clients/requests",
};
const sut = "(Teddy360) Financiamento Linha Verde (PF)";

test(`Feat: [${sut}] Validar fluxo completo de geração de propostas na plataforma`, async ({ page }) => {
  const dados = {
    plataforma: {
      url: setup.apps.teddy360.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
    input: {
      quantidadeDeMaquinasLinhaVerde: "25",
      marcaModeloVersao: "Test",
      valorTotalDaCompra: "100000",
      valorTotalASerFinanciado: "90000",
      relatoSobreOProponente: "Isso é uma automação de Test",
      previsaoDeFaturamento: "35000",
      relacaoDosPrincipaisClientes: "Isso é uma automação de Test",
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

  await test.step("Validar: Checar propostas existentes", async () => {
    await checkExistentsProposals(page);
  });

  await test.step("Validar: acessar módulo Clientes", async () => {
    await page.locator("#itens-menu").getByText("Clientes").click();
    await page.waitForURL(`${dados.plataforma.url}/#/client-list`);

    expect(page.url()).toEqual(`${dados.plataforma.url}/#/client-list`);
  });

  await test.step("Validar: selecionar um cliente PF e clicar em nova proposta", async () => {
    const ultimoCliente = -1;
    const iconeDeNovaProposta = "ﮒ ﮓ ﮔ ﮕ";

    await page.getByRole("button", { name: iconeDeNovaProposta }).nth(ultimoCliente).click();
  });

  await test.step(`Validar: acessar e iniciar jornada de ${sut}`, async () => {
    await page.locator("lib-button", { hasText: "Veículos" }).click();
    await page.locator("lib-button", { hasText: "Financiamento Linha Verde" }).click();

    await page.getByRole("button", { name: dados.botoes.continuar }).click();
  });

  await test.step(`Validar: preenchimento do formulário de ${sut}`, async () => {
    await page.waitForTimeout(ONE_SECOND * 12);
    // Quantidade de Maquinas Linha Verde
    await page.getByPlaceholder("Informe a quantidade d").pressSequentially(dados.input.quantidadeDeMaquinasLinhaVerde);
    // Marca, Modelo e Versão das Maquinas Linha Verde
    await page.getByPlaceholder("Descreva com detalhes a Marca").pressSequentially(dados.input.marcaModeloVersao);
    // Valor Total da Compra
    await page.getByPlaceholder("Informe o valor total da compra").pressSequentially(dados.input.valorTotalDaCompra);
    // Valor a ser Financiado
    await page.getByPlaceholder("Valor total a ser financiado").pressSequentially(dados.input.valorTotalASerFinanciado);
    // Relato sobre o Proponente e Motivo da aquisição
    await page
      .locator("lib-input-area-text")
      .filter({ hasText: "Relato sobre o Proponente e" })
      .getByRole("textbox")
      .fill(dados.input.relatoSobreOProponente);
    // Previsão de faturamento com as aquisições
    await page.getByPlaceholder("informar qual a previsão de").pressSequentially(dados.input.previsaoDeFaturamento);
    // Relação dos principais clientes do Proponente
    await page.getByPlaceholder("Descreva o nome dos").pressSequentially(dados.input.relacaoDosPrincipaisClientes);
  });
  // INFO: para avançar e finalizar a automação, mude 'skip' para 'step'. Após isso, remove esse comentário
  await test.skip(`Validar: Geração da proposta de ${sut}`, async () => {
    const button = page.getByRole("button", { name: dados.botoes.gerarNovaProposta });
    await button.click();
    await button.waitFor({ timeout: ONE_SECOND * 5 });

    await new Email().send({
      page,
      sut,
      api: await page.waitForResponse(api.gerarNovaProposta),
      subject: `Erro ao gerar proposta - ${sut}`,
      pathToAttachment: await new Screenshot().getPathToAttachment(page, sut),
      expectedStatusCode: 201,
    });
  });
});
