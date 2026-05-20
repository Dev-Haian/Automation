import { expect, test } from "@playwright/test";
import { ONE_SECOND, TRHEE_MINUTES } from "../../../../shared/test-timeout";
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
test.setTimeout(TRHEE_MINUTES);
const sut = "(Teddy360) Financiamento de Veículos Leves (PF)";

test(`Feat: [${sut}] Validar fluxo completo de geração de propostas na plataforma`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    ...createBaseDados("teddy360"),
    input: {
      passo1: {
        marcaOuMontadora: "byd",
        modeloDoVeiculo: "D1 Diamond",
        anoDeFabricacao: "2024",
        anoDoModelo:
          "div:nth-child(4) > lib-dropdown > .dropdown > lib-dropdown-item:nth-child(2) > .dropdown-item > .default > .item" /* 2025 */,
        valorDoVeiculo: "150.000,00",
        valorDeEntrada: "50.000,00",
        genero: "Masculino",
        nomeCompletoDaMae: "Mary Does",
      },
      passo3: {
        numeroDaCnhOuRg: "123456789",
        orgaoEmissor: "CREA",
        uf: "SP",
        estado: "São Paulo",
        municipio: "São Bernardo do Campo",
        nacionalidade: "Brasileira / Brasileiro",
        tipoDeResidencia: "Própria",
      },
      passo4: {
        naturezaDaOcupacao: "Produtor Rural",
        profissao: "PECUARIA",
        rendaMensal: "012345",
      },
    },
    botoes: {
      continuar: COMMON_BUTTONS.continuar,
      finalizar: "Finalizar",
      prosseguirComAPropostaManual: "Prosseguir com a proposta manual",
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
    await page.locator("lib-button", { hasText: "Financiamento de veículos" }).click();

    await page.getByRole("button", { name: "Continuar" }).click();

    await page.locator("label").filter({ hasText: "Preencher Proposta" }).click();
    await page.locator("lib-button", { hasText: "Iniciar Proposta agora" }).click();

    await page.locator(".title", { hasText: "Veículos Leves" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.step("Validar: (1° Etapa) avançar no formulário inicial", async () => {
    // Condições do veículo (Padrão: Novo)
    // Possui habilitação? (Padrão: Sim)
    // Veículo é para uso comercial? (Padrão: Não)
    // Tipo de veículo (Padrão: Carro)
    // Marca ou Montadora
    await page.locator("div:nth-child(2) > .select > .after-component > lib-icon > .icon").first().click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill(dados.input.passo1.marcaOuMontadora);
    await page.locator(".options > lib-dropdown-item > .dropdown-item > .default > .item").first().click();
    // Modelo do veículo
    await page
      .locator(
        "div:nth-child(3) > lib-select-search > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill(dados.input.passo1.modeloDoVeiculo);
    await page.getByText(dados.input.passo1.modeloDoVeiculo).first().click();
    // Ano do fabricação
    await page
      .locator(
        "div:nth-child(3) > lib-select > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    await page.getByText(dados.input.passo1.anoDeFabricacao).first().click();
    // Ano do modelo
    await page
      .locator(
        "lib-select:nth-child(3) > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .click();
    await page.locator(dados.input.passo1.anoDoModelo).first().click();
    // UF de licenciamento (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Valor do veículo
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Valor do veículo R$" })
      .getByPlaceholder("Text Input")
      .pressSequentially(dados.input.passo1.valorDoVeiculo);
    // Valor de entrada
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Valor da entrada R$" })
      .getByPlaceholder("Text Input")
      .pressSequentially(dados.input.passo1.valorDeEntrada);
    // Nome Completo (Padrão: este campo já vem preenchido do cadastro do cliente)
    // CPF (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Nascimento (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Gênero
    await page
      .locator(
        "div:nth-child(6) > lib-select > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .click();
    await page.getByText(dados.input.passo1.genero).first().click();
    // Telefone (Padrão: este campo já vem preenchido do cadastro do cliente)
    // E-email (Padrão: este campo já vem preenchido do cadastro do cliente)
    // // Estado civil (⚠️ revisar este campo)
    // await page.locator(".flex-05 > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon").click();
    // const maritalStatus = "Solteiro";
    // await page.getByText(maritalStatus).first().click();
    // Nome Completo da Mãe
    await page
      .getByPlaceholder("Digite o nome completo da mãe")
      .pressSequentially(dados.input.passo1.nomeCompletoDaMae);
    // Após preencher o formulário, o usuário deve clicar em "Continuar"
    await page.getByRole("button", { name: dados.botoes.continuar }).click();
  });

  await test.step("Validar: (2° Etapa) ver as condições dos parceiros", async () => {
    // Timeout adicionado para garantir o carregamento dos parceiros
    // (Verificar: há uma história sobre um loading de 25s na tela "Condições dos parceiros"?) ???
    await page.waitForTimeout(1000 * 25);
    await page.getByRole("button", { name: dados.botoes.prosseguirComAPropostaManual }).click();
  });

  await test.step("Validar: (3° Etapa) avançar com os dados pessoais do cliente", async () => {
    // Número da CNH ou RG
    await page
      .getByPlaceholder("Digite o número da CNH ou RG")
      .first()
      .pressSequentially(dados.input.passo3.numeroDaCnhOuRg);
    // Órgão Emissor
    await page.locator(".ng-star-inserted > .icon").first().click();
    await page.getByText(dados.input.passo3.orgaoEmissor).first().click();
    // UF
    await page
      .locator(".flex-1 > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon")
      .first()
      .click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill(dados.input.passo3.uf);
    await page
      .locator(
        ".flex-1 > .container-field > .form-group-select > .select > .dropdown > .options > lib-dropdown-item > .dropdown-item > .default > .item"
      )
      .first()
      .click();
    // Estado
    await page
      .locator(
        "div:nth-child(2) > lib-select-search > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill(dados.input.passo3.estado);
    await page.getByText(dados.input.passo3.estado).first().click();
    // Município
    await page
      .locator(
        "div:nth-child(2) > lib-select-search:nth-child(2) > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill(dados.input.passo3.municipio);
    await page.getByText(dados.input.passo3.municipio).first().click();
    // Nacionalidade
    await page
      .locator(
        "div:nth-child(2) > lib-select-search:nth-child(3) > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill(dados.input.passo3.nacionalidade);
    await page.getByText(dados.input.passo3.nacionalidade).first().click();
    // CEP (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Endereço (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Número (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Bairro (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Complemento (ℹ️ Opcional)
    // Cidade (Padrão: este campo já vem preenchido do cadastro do cliente)
    // UF (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Tipo de residência
    await page
      .locator("lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon")
      .first()
      .click();
    await page.getByText(dados.input.passo3.tipoDeResidencia).first().click();
    // Após preencher o formulário, o usuário deve clicar em "Continuar"
    await page.getByRole("button", { name: dados.botoes.continuar }).click();
  });

  await test.step("Validar: (4° Etapa) avançar com os dados profissionais do cliente", async () => {
    // Natureza da Ocupação
    await page.locator(".ng-star-inserted > .icon").first().click();
    await page.getByText(dados.input.passo4.naturezaDaOcupacao).click();
    // Profissão
    await page.locator("div:nth-child(2) > .select > .after-component > lib-icon > .icon").first().click();
    await page.getByText(dados.input.passo4.profissao).first().click();
    // Renda Mensal
    await page.getByPlaceholder("0,00").first().pressSequentially(dados.input.passo4.rendaMensal);
    // Após preencher o formulário, o usuário deve clicar em "Continuar"
    await page.getByRole("button", { name: dados.botoes.continuar }).click();
  });
  // INFO: para avançar e finalizar a automação, mude 'skip' para 'step'. Após isso, remove esse comentário
  await test.step("Validar: (5° Etapa) finalizar a jornada e gerar proposta", async () => {
    // Checkbox 'Ao prosseguir, você confirma que leu todos os detalhes...'
    await page.locator(".accept-terms > lib-checkbox > .input-checkbox > .checkmark").click();
    await page.waitForTimeout(ONE_SECOND * 1.2);
    const botao = page.getByRole("button", { name: dados.botoes.finalizar });
    botao.click();
    botao.waitFor({ timeout: 1000 * 5 });
  });
});
