import { expect, test } from "@playwright/test";
import { TRHEE_MINUTES } from "../../../shared/test-timeout";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import {
  createBaseDados,
  dismissInitialModals,
  loginAsQaUser,
  openClientsModule,
} from "../../../shared/helpers";

/* Automação referente ao módulo de clientes
    Cenários:
        1- Criação de cliente
        2- Exclusão de cliente
            {Validação de sucesso de exclusão e validação da listagem}
*/

test.setTimeout(TRHEE_MINUTES);
const sut = "(Teddy360) Geração de clientes PF";

test(`Feat: [${sut}] Validar fluxo completo de criação de Cliente PF`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    ...createBaseDados("teddy360"),
    input: {
      cpf: "54212682338",
      nomecli: "Test - Automação clientes PF",
      nascimento: "10102000",
      estadocivil: "Solteiro",
      whatsapp: "11955645648",
      email: "beatriz.amaya@teddydigital.io",
      cep: "08310740",
      numero: "44",
    },
    botoes: {
      continuar: "Continuar",
      criarCliente: "Criar Cliente",
      pesquisar: "Pesquise...",
      nomeCliente: "Test - AutomaçãO Clientes PF",
      confirmarExclusaoCliente: "Confirmar exclusão",
      toastExclusao: "Deletado com sucesso!",
    },
  };
  await test.step("Validar: Realizar login", async () => {
    await loginAsQaUser(page, dados);
  });

  await test.step("Validar: Checar modais iniciais", async () => {
    await dismissInitialModals(page);
  });

  await test.step("Validar: acessar módulo clientes", async () => {
    await openClientsModule(page, dados.plataforma.url);
  });

  await test.step("Validar: Criação de cliente", async () => {
    await page.locator("lib-button", { hasText: " Criar novo cliente " }).click();
    await page.locator("label").filter({ hasText: "Pessoa Física" }).locator("div").click();

    // Preencher os campos do formulário de criação de cliente PF

    //CPF
    await page.getByRole("textbox", { name: "-00" }).fill(dados.input.cpf);

    //Nome do cliente
    await page.getByRole("textbox", { name: "Digite o nome completo" }).fill(dados.input.nomecli);

    //Data de nascimento
    await page.getByRole("textbox", { name: "/00/0000" }).fill(dados.input.nascimento);

    //Estado civil
    await page.getByText("Selecione Casado (a)").click();
    await page.getByText("Solteiro (a)").click();

    //Telefone
    await page.getByRole("textbox", { name: "Digite seu telefone" }).fill(dados.input.whatsapp);

    //Email
    await page.getByRole("textbox", { name: "Digite seu E-mail" }).fill(dados.input.email);

    //CEP
    await page.getByRole("textbox", { name: "Digite seu CEP" }).fill(dados.input.cep);
    await page.keyboard.press("Tab");

    //Número do endereço
    await page.getByRole("textbox", { name: "Digite o número" }).fill(dados.input.numero);

    // Aceitar os termos
    await page.locator(".checkmark").click();

    // Criar cliente
    await page.getByRole("button", { name: dados.botoes.criarCliente }).click();
  });

  await test.step("Validar: Exclusão de cliente", async () => {
    const iconeMaisOpcoes = "";

    // Exclusão do cliente criado
    test.slow();

    //Campo de pesquisa, através do nome do cliente
    await page.locator("#search div").nth(1).click();
    await page.getByRole("textbox", { name: dados.botoes.pesquisar }).fill("Test - AutomaçãO Clientes PF");

    // Verificar se o cliente está visível na lista
    await expect(page.getByRole("cell", { name: dados.botoes.nomeCliente }).locator("span")).toBeVisible();

    // Clicar no ícone de mais opções e excluir o cliente
    await page.getByRole("button", { name: iconeMaisOpcoes }).click();
    await page.locator("#background_primary").getByText("Apagar cliente").click();
    await page.getByRole("button", { name: dados.botoes.confirmarExclusaoCliente }).click();

    // Verificar se o cliente foi excluído com sucesso - |Toast de exclusão|
    await expect(page.locator("div").filter({ hasText: dados.botoes.toastExclusao }).nth(4)).toBeVisible();
  });
});
