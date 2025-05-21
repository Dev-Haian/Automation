import { expect, test } from "@playwright/test";
import { TRHEE_MINUTES } from "../../../../shared/test-timeout";
import { AuthTeddy360 } from "../../../../shared/factories/auth-teddy360";
import { checkExistentsProposals } from "../../../../shared/utils/check-exitents-proposals";
import { setup } from "../../../../shared/setup";

// FIXME: A jornada de veículos está em refatoração (no back e front)!
test.setTimeout(TRHEE_MINUTES);
const sut = "Financiamento de Veículos Leves (PJ)";

test(`Feat: [${sut}] Validar fluxo completo de geração de propostas na plataforma`, async ({ page }) => {
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

  await test.step("Validar: Checar propostas existentes", async () => {
    await checkExistentsProposals(page);
  });

  await test.step("Validar: acessar módulo Clientes", async () => {
    await page.locator("#itens-menu").getByText("Clientes").click();
    await page.waitForURL(`${dados.plataforma.url}/#/client-list`);

    expect(page.url()).toEqual(`${dados.plataforma.url}/#/client-list`);
  });

  await test.step("Validar: selecionar um cliente PJ e clicar em nova proposta", async () => {
    // Clicando na tab "Pessoa Jurídica"
    await page
      .locator("div > lib-tab-item:nth-child(2) > button > lib-button > button", { hasText: /Pessoa Jurídica/ })
      .click();

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
    //
  });
  // INFO: para avançar e finalizar a automação, mude 'skip' para 'step'. Após isso, remove esse comentário
  await test.skip("Validar: (3° Etapa) finalizar a jornada e gerar proposta", async () => {
    await page.waitForTimeout(1000 * 5);
    await page.getByRole("button", { name: "Finalizar" }).click();
  });
});
