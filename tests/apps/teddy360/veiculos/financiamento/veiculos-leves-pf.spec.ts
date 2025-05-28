import { expect, test } from "@playwright/test";
import { TRHEE_MINUTES } from "../../../../shared/test-timeout";
import { AuthTeddy360 } from "../../../../shared/factories/auth-teddy360";
import { Email } from "../../../../shared/utils/send-mail";
import { Screenshot } from "../../../../shared/utils/screenshot";
import { setup } from "../../../../shared/setup";
import { getCurrentAutomation } from "../../../../shared/logs/get-current-automation";
import { checkInitialModals } from "../../../../shared/utils/check-initial-modals";

// FIXME: A jornada de veículos está em refatoração (no back e front)!
test.setTimeout(TRHEE_MINUTES);
const api = {
  gerarNovaProposta: "https://backend-prod.teddy360.com.br/simulation-teddy/vehcicle/create-proposal",
};
const sut = "(Teddy360) Financiamento de Veículos Leves (PF)";

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
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill("byd");
    await page.locator(".options > lib-dropdown-item > .dropdown-item > .default > .item").first().click();
    // Modelo do veículo
    await page
      .locator(
        "div:nth-child(3) > lib-select-search > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    const searchedVehicle = "D1 Diamond";
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill(searchedVehicle);
    await page.getByText(searchedVehicle).first().click();
    // Ano do fabricação
    await page
      .locator(
        "div:nth-child(3) > lib-select > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    const year2024 = "2024";
    await page.getByText(year2024).first().click();
    // Ano do modelo
    await page
      .locator(
        "lib-select:nth-child(3) > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .click();
    const year2025 =
      "div:nth-child(4) > lib-dropdown > .dropdown > lib-dropdown-item:nth-child(2) > .dropdown-item > .default > .item";
    await page.locator(year2025).first().click();
    // UF de licenciamento (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Valor do veículo
    const vehicleValue = "151.28800";
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Valor do veículoR$" })
      .getByPlaceholder("Text Input")
      .pressSequentially(vehicleValue);
    // Valor de entrada
    const vehicleEntryValue = "512.8800";
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Valor da entradaR$" })
      .getByPlaceholder("Text Input")
      .pressSequentially(vehicleEntryValue);
    // Nome Completo (Padrão: este campo já vem preenchido do cadastro do cliente)
    // CPF (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Nascimento (Padrão: este campo já vem preenchido do cadastro do cliente)
    // Gênero
    await page
      .locator(
        "div:nth-child(6) > lib-select > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .click();
    const gender = "masculino";
    await page.getByText(gender).first().click();
    // Telefone (Padrão: este campo já vem preenchido do cadastro do cliente)
    // E-email (Padrão: este campo já vem preenchido do cadastro do cliente)
    // // Estado civil (⚠️ revisar este campo)
    // await page.locator(".flex-05 > .container-field > lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon").click();
    // const maritalStatus = "Solteiro";
    // await page.getByText(maritalStatus).first().click();
    // Nome Completo da Mãe
    const customerMomFullName = "Mary Does";
    await page.getByPlaceholder("Digite o nome completo da mãe").pressSequentially(customerMomFullName);
    // Após preencher o formulário, o usuário deve clicar em "Continuar"
    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.step("Validar: (2° Etapa) ver as condições dos parceiros", async () => {
    // Timeout adicionado para garantir o carregamento dos parceiros
    // (Verificar: há uma história sobre um loading de 25s na tela "Condições dos parceiros"?) ???
    await page.waitForTimeout(1000 * 25);
    await page.getByRole("button", { name: "Prosseguir com a proposta manual" }).click();
  });

  await test.step("Validar: (3° Etapa) avançar com os dados pessoais do cliente", async () => {
    // Número da CNH ou RG
    await page.getByPlaceholder("Digite o número da CNH ou RG").first().pressSequentially("123456789");
    // Órgão Emissor
    await page.locator(".ng-star-inserted > .icon").first().click();
    await page.getByText("CREA").first().click();
    // UF
    await page
      .locator(".flex-1 > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon")
      .first()
      .click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill("SP");
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
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill("São Paulo");
    await page.getByText("São Paulo").first().click();
    // Município
    await page
      .locator(
        "div:nth-child(2) > lib-select-search:nth-child(2) > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill("São Bernardo do Campo");
    await page.getByText("São Bernardo do Campo").first().click();
    // Nacionalidade
    await page
      .locator(
        "div:nth-child(2) > lib-select-search:nth-child(3) > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    const nacionality = "Brasileira / Brasileiro";
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill(nacionality);
    await page.getByText(nacionality).first().click();
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
    const typeOfResidence = "Própria";
    await page.getByText(typeOfResidence).first().click();
    // Após preencher o formulário, o usuário deve clicar em "Continuar"
    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.step("Validar: (4° Etapa) avançar com os dados profissionais do cliente", async () => {
    // Natureza da Ocupação
    await page.locator(".ng-star-inserted > .icon").first().click();
    await page.getByText("Produtor Rural").click();
    // Profissão
    await page.locator("div:nth-child(2) > .select > .after-component > lib-icon > .icon").first().click();
    await page.getByText("PECUARIA").first().click();
    // Renda Mensal
    await page.getByPlaceholder("0,00").first().pressSequentially("012345");
    // Após preencher o formulário, o usuário deve clicar em "Continuar"
    await page.getByRole("button", { name: "Continuar" }).click();
  });
  // INFO: para avançar e finalizar a automação, mude 'skip' para 'step'. Após isso, remove esse comentário
  await test.skip("Validar: (5° Etapa) finalizar a jornada e gerar proposta", async () => {
    await page.waitForTimeout(1000 * 1.5);

    const button = page.getByRole("button", { name: "Finalizar" });
    button.click();
    button.waitFor({ timeout: 1000 * 5 });

    // ⚠️ revisar URL da API!
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
