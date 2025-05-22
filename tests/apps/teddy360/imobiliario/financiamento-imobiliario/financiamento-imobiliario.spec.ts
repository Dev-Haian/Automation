import { expect, test } from "@playwright/test";
import { FIVE_MINUTES } from "../../../../shared/test-timeout";
import { setup } from "../../../../shared/setup";
import { AuthTeddy360 } from "../../../../shared/factories/auth-teddy360";
import { checkExistentsProposals } from "../../../../shared/utils/check-exitents-proposals";

// DONE: Automação finalizada! (Beatriz)
test.setTimeout(FIVE_MINUTES);
const sut = "(Teddy360) Financiamento de imobiliário (PF)";

test(`Fluxo Completo de Proposta de ${sut} na Plataforma`, async ({ page }) => {
  const dados = {
    plataforma: {
      url: setup.apps.teddy360.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
    input: {
      cep: "08310740",
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

  await test.step("Validar: acessar módulo clientes", async () => {
    // acessar módulo "clientes"
    await page.locator("#itens-menu").getByText("Clientes").click();
    await page.waitForURL(`${dados.plataforma.url}/#/client-list`);
    // Verificar se a url atual da página é igual a rota "#/client-list"
    expect(page.url()).toEqual(`${dados.plataforma.url}/#/client-list`);
  });

  await test.step("Validar: selecionar um cliente PF e clicar em nova proposta", async () => {
    const primeiroCliente = 0;
    const iconeDeNovaProposta = "ﮒ ﮓ ﮔ ﮕ";
    // Selecionar o primeiro cliente
    await page.getByRole("button", { name: iconeDeNovaProposta }).nth(primeiroCliente).click();
  });

  await test.step(`Usuário Deve Conseguir Acessar e Iniciar Jornada de ${sut}`, async () => {
    await page.locator("lib-button", { hasText: "Imobiliário" }).click();
    await page.locator("lib-button", { hasText: "Financiamento imobiliário" }).click();

    await page.getByRole("button", { name: "Continuar" }).click();

    await page.locator("label").filter({ hasText: "Preencher Proposta" }).click();
    await page.locator("lib-button", { hasText: "Iniciar Proposta agora" }).click();

    await page.locator(".title", { hasText: "Residencial" }).click();
    await page.getByRole("button", { name: "Preencher proposta" }).click();
  });

  await test.step("Validar: (1° Etapa) Usuário deve conseguir avançar no Formulário de Dados Pessoais", async () => {
    //Verifica se está na página correta
    await expect(page.getByText("Preencha os dados da proposta!")).toBeVisible();
    // RG, Orgão Emissor, Emissão do RG, UF de emissão do documento
    await page.getByPlaceholder("Digite o número").fill("125480128");
    await page.locator(".after-component > lib-icon > .icon").first().click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill("SSP");
    await page.locator(".options > lib-dropdown-item > .dropdown-item > .default > .item").first().click();
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Emissão do RG" })
      .getByPlaceholder("/00/0000")
      .fill("02/04/2022");
    await page
      .locator(
        "lib-select-search:nth-child(4) > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon"
      )
      .first()
      .click();
    await page.getByRole("textbox", { name: "Pesquisa..." }).fill("SP");
    await page
      .locator(
        "lib-select-search:nth-child(4) > .container-field > .form-group-select > .select > .dropdown > .options > lib-dropdown-item > .dropdown-item > .default > .item"
      )
      .click();
    await page.waitForTimeout(3000);
    //Gênero
    await page
      .locator("lib-select-field > .form-group-select > .select > .after-component > lib-icon > .icon")
      .first()
      .click();
    await page.getByText("Masculino").click();
    //Nome da Mãe
    await page.getByPlaceholder("Digite o nome").fill("Renata ");
    //Estado Civil
    //await page.getByText("Selecione Casado (a)").click();
    //await page.getByText("Solteiro (a)").click();
    //Vive em união estável?
    await page.locator("label").filter({ hasText: "Não" }).locator("div").first().click();
    //Natureza da ocupação
    await page.locator("lib-select-search").filter({ hasText: "Natureza da Ocupação" }).first().click();
    await page.getByText("Assalariado").first().click();
    //Profissão
    await page.getByText("Selecione Advogado Afiador de").first().click();
    await page.getByText("Advogado").click();
    //Renda
    await page.getByPlaceholder("R$").pressSequentially("18.00");
    //Data de Admissão
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Data de Admissão" })
      .getByPlaceholder("/00/0000")
      .fill("03/09/2024");
    //Empresa empregadora
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Nome da Empregadora" })
      .getByPlaceholder("Digite o nome")
      .first()
      .fill("Teddy Hub Digital LTDA");
    //Principal Banco Correntista
    await page
      .locator(".flex-1 > .container-field > .form-group-select > .select > .after-component > lib-icon > .icon")
      .first()
      .click();
    await page.getByText("Banco Inter").click();
    //CEP
    await page.getByPlaceholder("00000-000", { exact: true }).fill(dados.input.cep);
    await page.getByPlaceholder("Digite seu endereço").click();
    await page.getByPlaceholder("0", { exact: true }).fill("654");
    //Botão continuar
    await page.getByRole("button", { name: "Continuar" }).first().click();
    //Botão Confirmar do modal de participantes
    await page.getByRole("button", { name: "Confirmar" }).first().click();
    await page.waitForTimeout(1000 * 5);
  });

  await test.step("Validar: (2° Etapa) Usuário deve avançar no Formulário de Dados do imóvel", async () => {
    //Verifica se está na página correta
    await expect(page.getByText("QA - Beatriz Amaya, Agora,")).toBeVisible();
    // UF do imóvel
    await page.locator("div:nth-child(2) > .select > .after-component > lib-icon > .icon").click();
    await page.waitForTimeout(1000 * 2);
    await page.getByPlaceholder("Pesquisa...").first().fill("SP");
    await page.locator("lib-select-search lib-dropdown-item div").filter({ hasText: "SP" }).nth(3).click();
    // Valor do imóvel
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Valor do imóvelR$Mínimo: R$" })
      .getByPlaceholder("00.000,00")
      .pressSequentially("30000");
    // Valor de entrada
    //await page.waitForTimeout(1000 * 2);
    await page
      .locator("lib-input-text")
      .filter({ hasText: "Valor de entrada O valor mí" })
      .getByPlaceholder("00.000,00")
      .pressSequentially("22000");
    // FGTS ? Sim ou Não
    await page.locator(".container-radios-column > .group-radio > div:nth-child(2) > label > .custom-radio").click();
    // Taxas ITBI e Registros
    await page
      .locator(".container-radios-column > .container-radios > .group-radio > div:nth-child(2) > label > .custom-radio")
      .click();
    // Botão Continuar - Validação da Rota SIMULATION
    const [response] = await Promise.all([
      page.waitForResponse(res => res.url().includes("/real-estate/simulation") && res.status() === 201),
      await page.getByRole("button", { name: "Continuar" }).click(),
    ]);
    expect(response.status()).toBe(201);
  });

  await test.step("Validar: (3° Etapa) Usuário deve conseguir visualizar os resultados e gerar proposta", async () => {
    //Esperar o loading dos parceiros carregarem
    await page.waitForTimeout(1000 * 50);
    //Verifica se está na página correta
    await expect(page.getByRole("button", { name: "   Recalcular" })).toBeVisible();
    //Verifica se o INTER está visível
    //await expect(page.getByRole("button", { name: "  " }).nth(2)).toBeVisible();
    //Gerar proposta e Valida o status da resposta
    const [response] = await Promise.all([
      page.waitForResponse(res => res.url().includes("/real-estate/v2/create-proposal") && res.status() === 201),
      await page.getByRole("button", { name: "  Gerar e acompanhar" }).click(),
    ]);
    expect(response.status()).toBe(201);
    //Esperar o loading dos parceiros carregarem
    await page.waitForTimeout(1000 * 40);
    //Modal Pré finalização
    await expect(page.locator("app-results-simulator").getByRole("button", { name: "" })).toBeVisible();
    //Botão avançar
    await page.getByRole("button", { name: "Avançar" }).click();
  });

  await test.step("Validar: (4° Etapa) Usuário deve conseguir visualizar o drawer de documentos e visualizar card da proposta", async () => {
    //Esperar o loading dos parceiros carregarem
    await page.waitForTimeout(1000 * 30);
    //Drawer de doc visivel
    await page.getByText("Não deixe de enviar a documentação Cerca de 50% das propostas exigem o envio de").isVisible();
    //Fechar Drawer de Doc
    await page.locator("app-drawer-container").getByRole("button", { name: "" }).click();
    //Card da proposta aberto e visivel
    await expect(page.getByText("Cancelar Proposta Documentos")).toBeVisible();
    //Fechar card
    await page.locator(".click > .icon").first().click();
    //Fechar o modal de doc pendente
    await page.getByRole("button", { name: "Fechar" }).click();
    //Visualizar card no kanban
    await expect(page.locator(".header-business").first()).toBeVisible();
  });
});
