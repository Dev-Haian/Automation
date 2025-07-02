import { expect, test } from "@playwright/test";
import { AuthBackOffice } from "../../../shared/factories/auth-back-office";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import { setup } from "../../../shared/setup";
import { ONE_MINUTE, ONE_SECOND } from "../../../shared/test-timeout";
import { SelectList } from "../../../shared/components/select-list";

// TODO: Completar a automação de cadastro de Pessoa Física no Back-office
test.setTimeout(ONE_MINUTE * 1.5);
const api = {
  adicionarPessoaFisica: "https://qwwoufnkek.execute-api.us-east-1.amazonaws.com/full-fast/persons",
};
const sut = "(Back-Office) Cadastrar Pessoa Física no Full Fast";

test(`Feat: [${sut}] validar fluxo completo`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    plataforma: {
      url: setup.apps.backOffice.url,
    },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
    input: {
      nome: "Single QaTest",
      cpf: "11647402379",
      email: "john.doe.test@test.com",
      telefone: "(11) 91234-5678",
      cep: "44444-444", // deve preencher endereço, bairro, cidade e estado
      endereço: "Rua Via Coletora B",
      numero: "123",
      bairro: "Nossa Senhora das Graças",
      cidade: "Santo Antônio de Jesus",
      estado: "BA",
      quantidadeDeUsuariosNaPlataforma: "10",
      valorAcordadoComOSocioAdministrador: "1000000000",
      formaDePagamento: "Grátis",
      comissionamentoItau: "0,4%",
      comissionamentoBradesco: "0,5%",
      comissionamentoSantander: "0,6%",
      comissionamentoInterCaixaCredBlueEBari: "0,4%",
      qualAProducaoDoParceiro: "100000",
      quantoTempoDeMercado: "10",
      quantidadeDeFuncionarios: "10",
      breveRelato: "Isso Se Trata de Um Test do QA", // opcional
    },
    botoes: {
      adicionarCadastro: " Adicionar cadastro",
      adicionar: " Adicionar",
      deletar: " Deletar",
    },
    tabs: {
      pessoaFisica: " Pessoa Física",
    },
    menuItem: {
      fullfast: "Full Fast",
    },
  };

  await test.step("Validar: Realizar login", async () => {
    await new AuthBackOffice().makeUserLogin({
      page,
      url: dados.plataforma.url,
      userEmail: dados.usuario.email,
      userPassword: dados.usuario.senha,
    });
  });

  await test.step("Validar: Acessar módulo Full Fast", async () => {
    await page.getByText(dados.menuItem.fullfast).first().click();
  });

  await test.step("Validar: Acessar tab Pessoa Física", async () => {
    await page.getByRole("link", { name: dados.tabs.pessoaFisica }).click();
  });

  await test.step("Validar: Acessar formulário de cadastro de pessoa física", async () => {
    await page.getByRole("button", { name: dados.botoes.adicionarCadastro }).click();
  });

  await test.step("Validar: Preencher formulário", async () => {
    // Nome completo:
    await page.getByPlaceholder("Digite o nome").fill(dados.input.nome);
    // CPF:
    await page.getByPlaceholder("000.000.000-00").fill(dados.input.cpf);
    // Email:
    await page.getByPlaceholder("Digite o e-mail").fill(dados.input.email);
    // Telefone:
    await page.getByPlaceholder("Digite o telefone").fill(dados.input.telefone);
    // CEP:
    await page.getByPlaceholder("00000-000").fill(dados.input.cep);
    // Número
    await page.getByPlaceholder("Digite o número").fill(dados.input.numero);
    // ℹ️ Validar carregamento de dados do endereço após informar o CEP
    const { endereço, bairro, cidade, estado } = dados.input;

    expect(page.getByText(endereço)).toBeTruthy();
    expect(page.getByText(bairro)).toBeTruthy();
    expect(page.getByText(cidade)).toBeTruthy();
    expect(page.getByText(estado)).toBeTruthy();

    // Possui loja física
    // await page.getByTestId("toggle").nth(0).click(); // Ao definir este campo, será preciso implementar lógica para obter arquivo do OS

    // Quantidade de usuários na plataforma:
    await page
      .getByPlaceholder("Considerando o acesso do master, digite a quantidade")
      .fill(dados.input.quantidadeDeUsuariosNaPlataforma);
    // Valor acordado com o sócio-administrador:
    await page
      .getByLabel("Valor acordado com o sócio-administrador:", { exact: true })
      .fill(dados.input.valorAcordadoComOSocioAdministrador);
    // Forma de pagamento
    await new SelectList().selectListWithoutSearch({
      page,
      path: "div:nth-child(15) > div > .sc-eEFyrX > .react-select__control > .react-select__indicators > .react-select__indicator > .sc-gNZgCX",
      optionToSelect: dados.input.formaDePagamento,
    });
    // ℹ️ Tabela de Comissionamento [Esse campo vem bloqueado com a opção "The House Pesonalizada"]
    // Comissionamento Itau
    await new SelectList().selectListWithoutSearch({
      page,
      path: "div:nth-child(18) > div > .sc-eEFyrX > .react-select__control > .react-select__indicators > .react-select__indicator > .sc-gNZgCX",
      optionToSelect: dados.input.comissionamentoItau,
    });
    // Comissionamento Bradesco
    await new SelectList().selectListWithoutSearch({
      page,
      path: "div:nth-child(19) > div > .sc-eEFyrX > .react-select__control > .react-select__indicators > .react-select__indicator > .sc-gNZgCX",
      optionToSelect: dados.input.comissionamentoBradesco,
    });
    // Comissionamento Santander
    await new SelectList().selectListWithoutSearch({
      page,
      path: "div:nth-child(20) > div > .sc-eEFyrX > .react-select__control > .react-select__indicators > .react-select__indicator > .sc-gNZgCX",
      optionToSelect: dados.input.comissionamentoSantander,
    });
    // Comissionamento Inter, Caixa, Credblue e Bari
    await new SelectList().selectListWithoutSearch({
      page,
      path: "div:nth-child(21) > div > .sc-eEFyrX > .react-select__control > .react-select__indicators > .react-select__indicator > .sc-gNZgCX",
      optionToSelect: dados.input.comissionamentoInterCaixaCredBlueEBari,
    });
    // Qual a produção do parceiro?
    await page.getByLabel("Qual a produção do parceiro?").fill(dados.input.qualAProducaoDoParceiro);
    // Quanto tempo de mercado?
    await page.getByPlaceholder("Digite o tempo").fill(dados.input.quantoTempoDeMercado);
    // Quantidade de funcionários:
    await page.getByPlaceholder("Digite a quantidade", { exact: true }).fill(dados.input.quantidadeDeFuncionarios);
    // Breve relato: (opcional)
    await page
      .locator("div")
      .filter({ hasText: "Breve relato: (opcional)" })
      .getByRole("textbox")
      .getByRole("paragraph")
      .fill(dados.input.breveRelato);
    // switch "já possui cadastro na Teddy?"
    await page.getByTestId("toggle").nth(1).click();
    // switch "Houve visita no estabelecimento comercial?"
    await page.getByTestId("toggle").nth(2).click();
    // switch "É uma indicação?"
    await page.getByTestId("toggle").nth(3).click();
    // switch "Possui cadastro em outras promotoras?"
    await page.getByTestId("toggle").nth(4).click();
    // checkbox "Estou ciente e concordo com o uso destes..."
    await page.getByRole("checkbox").click();
  });

  await test.step("Validar: Cadastrar pessoa física", async () => {
    const btnAdicionar = page.getByRole("button", { name: dados.botoes.adicionar });
    await btnAdicionar.click();
    await btnAdicionar.waitFor({ timeout: ONE_SECOND * 5 });

    const mensagemDeSucesso = page.getByText("Sucesso ao criar Pessoa Física.", { exact: true });
    expect(await mensagemDeSucesso.isVisible()).toBeTruthy();
  });

  await test.step("Validar: Deletar pessoa física criada", async () => {
    // await page.getByRole("link", { name: dados.tabs.pessoaFisica }).click();
    await page.locator("tr").filter({ hasText: dados.input.nome }).locator("button").nth(1).click();
    await page.getByRole("button", { name: dados.botoes.deletar }).click();

    const alertaParaExcluirUsuario = "Esta ação não poderá ser desfeita! Desejo mesmo prosseguir com a exclusão?";
    expect(await page.getByText(alertaParaExcluirUsuario).isVisible()).toBeTruthy();

    await page.getByRole("button", { name: "Excluir usuário" }).click();

    await page.waitForTimeout(ONE_SECOND * 1.5);
  });
});
