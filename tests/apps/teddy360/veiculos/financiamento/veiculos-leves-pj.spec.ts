import { expect, test } from "@playwright/test";
import { ONE_MINUTE } from "../../../../shared/test-timeout";
import { getCurrentAutomation } from "../../../../shared/logs/get-current-automation";
import {
  createBaseDados,
  dismissInitialModals,
  loginAsQaUser,
  openClientsModule,
  selectLastClientNewProposal,
} from "../../../../shared/helpers";

// DONE: Automação finalizada!
test.setTimeout(ONE_MINUTE * 1.5);
const sut = "(Teddy360) Financiamento de Veículos Leves (PJ)";

test(`Feat: [${sut}] Validar fluxo completo de geração de propostas na plataforma`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    ...createBaseDados("teddy360"),
    input: {
      bancoQuePossuiConta: "BraTest",
      agencia: "9876",
      contaCorrente: "1234567-8",
      capitalSocial: "123456789",
      faturamentoDosUltimos12Meses: "123456789",
      dataDaAbertura: "12/12/1999",
      telefoneDeContato: "11912345678",
      nomeDoSocioAvalista: "John Doe Test",
      cpfDoSocioAvalista: "02504235887",
      RgOuCnhDoSocioAvalista: "525252525252",
      dataDeNascimentoDoSocioAvalista: "10/10/1999",
      estadoCivilDoSocioAvalista: "Solteiro (a)",
      nacionalidadeDoSocioAvalista: "Test",
      cepDoSocio: "4444444",
      numeroDeResidenciaDoSocio: "256",
    },
    botoes: {
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

  await test.step("Validar: selecionar um cliente PJ e clicar em nova proposta", async () => {
    await selectLastClientNewProposal(page, { personType: "PJ" });
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
    // Tipo da proposta
    await page.getByText("Financiamento", { exact: true }).click();
    // Dados do veículo
    await page.getByText("0 Km").click();
    // Tipo do veículos
    await page.getByRole("textbox", { name: "Digite o tipo do veículo" }).fill("Carro");
    // Marca ou Montadora
    await page.getByRole("textbox", { name: "Digite a marca ou montadora" }).fill("VOLVO");
    // Modelo do Veículo
    await page.getByRole("textbox", { name: "Digite o modelo do veículo" }).fill("Sedan");
    // Versão do Modelo
    await page.getByRole("textbox", { name: "Versão do modelo" }).fill("1.0 Turbo");
    // Cor do veículo
    await page.getByRole("textbox", { name: "Digite a cor do veículo" }).fill("Prata");
    // Transmissão
    await page.getByText(/Selecione a transmissão/).click();
    await page.getByText("Automático").click();
    // Combústivel
    await page.getByRole("textbox", { name: "Digite o combustível" }).fill("Petróleo");
    // Ano de fabricação
    await page
      .locator(
        "span:nth-child(1) > lib-select > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    const year2024 =
      "div:nth-child(4) > lib-dropdown > .dropdown > lib-dropdown-item:nth-child(2) > .dropdown-item > .default > .item";
    await page.locator(year2024).first().click();
    // Ano do modelo
    await page
      .locator(
        "span:nth-child(2) > lib-select > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    const year2025 =
      "div:nth-child(4) > lib-dropdown > .dropdown > lib-dropdown-item:nth-child(3) > .dropdown-item > .default > .item";
    await page.locator(year2025).first().click();
    // Estado do licenciamento
    await page.locator("div:nth-child(2) > .select > .after-component > lib-icon > .icon").first().click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill("São Paulo");
    await page.locator(".options > lib-dropdown-item > .dropdown-item > .default > .item").first().click();
    // Valor do licenciamento
    await page.getByPlaceholder("R$").pressSequentially("555.222,00");
    // Valor da compra do veículo
    await page.getByPlaceholder("0,00", { exact: true }).pressSequentially("1.555.222,00");
    // Prazo de pagamento
    await page.getByRole("textbox", { name: "Digite o prazo de meses" }).fill("19");
    // Após preencher o formulário, o usuário deve clicar em "Continuar"
    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.step("Validar: (2° Etapa) preencher os dados extras do cliente", async () => {
    // Banco Que Possui Conta
    await page
      .getByRole("textbox", { name: "Digite o Nome do banco" })
      .pressSequentially(dados.input.bancoQuePossuiConta);
    // Agencia
    await page.getByRole("textbox", { name: "0000", exact: true }).pressSequentially(dados.input.agencia);
    // Conta Corrente
    await page.getByRole("textbox", { name: "0000000-" }).pressSequentially(dados.input.contaCorrente);
    // Capital Social
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Capital Social R$" })
      .getByPlaceholder("0,00")
      .pressSequentially(dados.input.capitalSocial);
    // Faturamento Dos Ultimos 12 Meses
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Faturamento dos últimos 12" })
      .getByPlaceholder("0,00")
      .pressSequentially(dados.input.faturamentoDosUltimos12Meses);
    // Data Da Abertura
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Data de abertura" })
      .getByPlaceholder("/00/0000")
      .pressSequentially(dados.input.dataDaAbertura);
    // Telefone De Contato
    await page.getByRole("textbox", { name: "(00) 00000-" }).pressSequentially(dados.input.telefoneDeContato);
    // Nome Do Socio Avalista
    await page
      .getByRole("textbox", { name: "Digite o nome completo" })
      .pressSequentially(dados.input.nomeDoSocioAvalista);
    // CPF Do Socio Avalista
    await page.getByRole("textbox", { name: "000.000.000-" }).pressSequentially(dados.input.cpfDoSocioAvalista);
    // RG ou CNH do Sócio Avalista
    await page
      .getByRole("textbox", { name: "Digite o RG ou CNH do sócio" })
      .pressSequentially(dados.input.RgOuCnhDoSocioAvalista);
    // Data De Nascimento Do Socio Avalista
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Data de nascimento do sócio" })
      .getByPlaceholder("/00/0000")
      .pressSequentially(dados.input.dataDeNascimentoDoSocioAvalista);
    // Estado Civil Do Socio Avalista
    await page.locator(".after-component > lib-icon > .icon").first().click();
    await page.getByText(dados.input.estadoCivilDoSocioAvalista).first().click();
    // Nacionalidade Do Socio Avalista
    await page
      .getByRole("textbox", { name: "Digite a Nacionalidade do Só" })
      .pressSequentially(dados.input.nacionalidadeDoSocioAvalista);
    // CEP Do Socio
    await page
      .locator(
        "//html/body/app-root/app-layout/section/div[2]/div/div/new-proposal/div/div/app-vehicle-financing/div[3]/div/form/div[5]/span[2]/lib-input-text/div/lib-input/div/div/input"
      )
      .pressSequentially(dados.input.cepDoSocio);

    await page.getByPlaceholder("Digite a Cidade").first().pressSequentially("Testando");
    // Número de Residência do Sócio
    await page
      .getByRole("textbox", { name: "000", exact: true })
      .first()
      .pressSequentially(dados.input.numeroDeResidenciaDoSocio);
    await page.waitForTimeout(1000 * 5);
  });
  // INFO: para avançar e finalizar a automação, mude 'skip' para 'step'. Após isso, remove esse comentário
  await test.step("Validar: (3° Etapa) finalizar a jornada e gerar proposta", async () => {
    await page.getByRole("button", { name: dados.botoes.gerarNovaProposta }).click();
  });
});
