import test from "@playwright/test";
import { ONE_MINUTE, ONE_SECOND } from "../../../../shared/test-timeout";
import { getCurrentAutomation } from "../../../../shared/logs/get-current-automation";
import {
  COMMON_BUTTONS,
  createBaseDados,
  dismissInitialModals,
  loginAsQaUser,
  openClientsModule,
  selectLastClientNewProposal,
} from "../../../../shared/helpers";

// DONE: Automação finalizada!
test.setTimeout(ONE_MINUTE * 1.5);
const sut = "(Teddy360) Financiamento Linha Verde (PF)";

test(`Feat: [${sut}] Validar fluxo completo de geração de propostas na plataforma`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    ...createBaseDados("teddy360"),
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
      continuar: COMMON_BUTTONS.continuar,
      gerarNovaProposta: "Gerar nova proposta",
    },
  };

  await test.step("Validar: Realizar login", async () => {
    await loginAsQaUser(page, dados);
  });

  await test.step("Validar: Checar modais iniciais", async () => {
    await dismissInitialModals(page);
  });

  await test.step("Validar: acessar módulo Clientes", async () => {
    await openClientsModule(page, dados.plataforma.url);
  });

  await test.step("Validar: selecionar um cliente PF e clicar em nova proposta", async () => {
    await selectLastClientNewProposal(page, { personType: "PF" });
  });

  await test.step(`Validar: acessar e iniciar jornada de ${sut}`, async () => {
    await page.locator("lib-button", { hasText: "Veículos" }).click();
    await page.locator("lib-button", { hasText: "Financiamento Linha Verde" }).click();

    await page.getByRole("button", { name: dados.botoes.continuar }).click();
  });

  await test.step(`Validar: preenchimento do formulário de ${sut}`, async () => {
    await page.waitForTimeout(ONE_SECOND * 6);
    await page.getByPlaceholder("Informe a quantidade d").pressSequentially(dados.input.quantidadeDeMaquinasLinhaVerde);
    await page.getByPlaceholder("Descreva com detalhes a Marca").pressSequentially(dados.input.marcaModeloVersao);
    await page.getByPlaceholder("Informe o valor total da compra").pressSequentially(dados.input.valorTotalDaCompra);
    await page.getByPlaceholder("Valor total a ser financiado").pressSequentially(dados.input.valorTotalASerFinanciado);
    await page
      .locator("lib-input-area-text")
      .filter({ hasText: "Relato sobre o Proponente e" })
      .getByRole("textbox")
      .fill(dados.input.relatoSobreOProponente);
    await page.getByPlaceholder("informar qual a previsão de").pressSequentially(dados.input.previsaoDeFaturamento);
    await page.getByPlaceholder("Descreva o nome dos").fill(dados.input.relacaoDosPrincipaisClientes);
  });

  await test.step(`Validar: Geração da proposta de ${sut}`, async () => {
    const botao = page.getByRole("button", { name: dados.botoes.gerarNovaProposta });
    await botao.click();
    await botao.waitFor({ timeout: ONE_SECOND * 5 });
  });
});
