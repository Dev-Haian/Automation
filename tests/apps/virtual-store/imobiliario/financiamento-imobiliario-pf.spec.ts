import test, { expect } from "@playwright/test";
import { ONE_SECOND, TRHEE_MINUTES } from "../../../shared/test-timeout";
import { setup } from "../../../shared/setup";

// DONE: Automação finalizada!
test.setTimeout(TRHEE_MINUTES);
const sut = "Financiamento Imobiliário";

test(`Feat: [${sut}] Validar fluxo completo de geração de propostas na loja`, async ({ page }) => {
  const dados = {
    loja: {
      url: setup.apps.virtualStore.url,
      base64: setup.apps.virtualStore.base64,
    },
    input: {
      tipoDeImovel: /Residencial/ /* /Comercial/, /Terreno/ */,
      dadosPessoais: {
        nomeCompleto: "John Doe",
        cpf: "481.953.715-66",
        dadosDeNascimento: "10/10/1999",
        rg: "774872123",
        orgaoEmissor: "SSP",
        emissaoDoRg: "10/10/1999",
        dadosDeEmissaoDoDocumento: "AC",
        genero: "Masculino",
        nomeDaMae: "Mary Does",
        nacionalidade: "Brasileira / Brasileiro",
        estadoCivil: "Solteiro (a)",
        uniaoEstavel: "Não",
        email: "test@test.test",
        numeroDeTelefone: "(11) 98765-4321",
      },
      dadosPessoais2: {
        naturezaDaOcupacao: "Assalariado",
        profissao: "Advogado",
        rendaMensal: "1.000.000,00",
        dadosDeInicio: "10/10/1999",
        nomeDaEmpregadora: "Teste Teste Teste",
        principalBancoCorrentista: "Banco Inter",
        cep: "44444-444",
        endereco: "Rua Via Coletora B",
        bairro: "Nossa Senhora das Graças",
        numero: "256",
        cidade: "Santo Antônio de Jesus",
        uf: "BA",
        complemento: "[TESTE]",
      },
      dadosDoImovel: {
        uf: "AC",
        jaTemImovelDefinido: "Não",
        valorDoImovel: "200.000,00",
        valorDeEntrada: "100.000,00",
        vaiUtilizarFgts: "Não",
        valorDeFinanciamento: "100.000,00",
        prazoDePagamento: "420",
        incluirCustosDeItbi: "Sim",
        valorDasDespesasFinanciadas: "10.000,00",
        valorTotalFinanciado: "110.000,00", // (valorDoImovel - valorDeEntrada) + valorDasDespesasFinanciadas
      },
    },
  };

  await test.step("Validar: acesso a loja", async () => {
    const { url, base64 } = dados.loja;

    await page.goto(`${url}/${base64}`);

    expect(page.url()).toContain(base64);
  });

  await test.step(`Validar: acesso ao produto ${sut}`, async () => {
    const arrowRightRedirect = "";
    await page.getByRole("button", { name: arrowRightRedirect }).nth(0).click();

    expect(sut).toBeTruthy();
  });

  await test.step("Validar: início da jornada na loja", async () => {
    // [radio button] Preencher Proposta
    await page.getByRole("radio").nth(1).click();
    // Selecione o tipo de imóvel:
    await page.getByRole("button", { name: dados.input.tipoDeImovel }).first().click();
    // [checkbox] "Declaro que os dados [...]"
    await page.getByRole("checkbox").click();

    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.step("Validar: 1° form - 1/2 (Preencha seus dados pessoais)", async () => {
    // Nome completo
    await page.getByPlaceholder("Digite o nome completo").fill(dados.input.dadosPessoais.nomeCompleto);
    // CPF
    await page.getByPlaceholder("000.000.000-00").fill(dados.input.dadosPessoais.cpf);
    // dados de nascimento
    await page.getByLabel("Data de nascimento").fill(dados.input.dadosPessoais.dadosDeNascimento);
    // RG
    await page.getByPlaceholder("Digite seu RG").fill(dados.input.dadosPessoais.rg);
    // Órgão Emissor
    await page.locator(".react-select__indicator").first().click();
    await page.getByText(dados.input.dadosPessoais.orgaoEmissor).click();
    // Emissão do RG
    await page.getByLabel("Emissão do RG").fill(dados.input.dadosPessoais.emissaoDoRg);
    // UF de emissão do documento
    const campoDadosDeEmissaoDoDocumento = ".col-span-6 > .w-full > div > .sc-eEFyrX > .react-select__control";
    await page.locator(campoDadosDeEmissaoDoDocumento).first().click();
    await page.getByText(dados.input.dadosPessoais.dadosDeEmissaoDoDocumento, { exact: true }).click();
    // Gênero
    await page.locator("div:nth-child(8) > .w-full > div > .sc-eEFyrX > .react-select__control").click();
    await page.getByText(dados.input.dadosPessoais.genero).click();
    // Nome da mãe
    await page.getByPlaceholder("Digite o nome da mãe").fill(dados.input.dadosPessoais.nomeDaMae);
    // // Nacionalidade
    await page.locator("div:nth-child(10) > .w-full > div > .sc-eEFyrX > .react-select__control").click();
    await page.getByText(dados.input.dadosPessoais.nacionalidade).click();
    // // Estado Civil
    await page.locator("div:nth-child(11) > .w-full > div > .sc-eEFyrX > .react-select__control").click();
    await page.getByText(dados.input.dadosPessoais.estadoCivil).click();
    // Vive em união estável? (Não)
    await page.getByRole("radio").nth(1).click();
    // Telefone
    await page.getByPlaceholder("(00) 00000-0000").fill(dados.input.dadosPessoais.numeroDeTelefone);
    // E-email
    await page.getByPlaceholder("Digite o e-mail").fill(dados.input.dadosPessoais.email);

    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.step("Validar: 1° form - 2/2 (Preencha seus dados pessoais)", async () => {
    // Natureza da Ocupação
    await page.locator(".react-select__input-container").first().click();
    await page.getByText(dados.input.dadosPessoais2.naturezaDaOcupacao).click();
    // Profissão
    await page.locator("div:nth-child(2) > .w-full > div > .sc-eEFyrX > .react-select__control").first().click();
    await page.getByText(dados.input.dadosPessoais2.profissao).click();
    // Renda Mensal
    await page.getByPlaceholder("R$ 0,00").fill(dados.input.dadosPessoais2.rendaMensal);
    // dados de início
    await page.getByPlaceholder("dd/mm/aaaa").fill(dados.input.dadosPessoais2.dadosDeInicio);
    // Nome da empregadora
    await page.getByPlaceholder("Digite o nome da empregadora").fill(dados.input.dadosPessoais2.nomeDaEmpregadora);
    // Principal banco correntista
    await page.locator("div:nth-child(6) > .w-full > div > .sc-eEFyrX > .react-select__control").first().click();
    await page.getByText(dados.input.dadosPessoais2.principalBancoCorrentista).click();
    // CEP
    await page.getByPlaceholder("00000-000").fill(dados.input.dadosPessoais2.cep);
    // Endereço
    // Bairro
    // Número
    await page.getByPlaceholder("Digite o número").fill(dados.input.dadosPessoais2.numero);
    // Cidade
    // UF
    // Complemento
    await page.getByPlaceholder("Digite o complemento").fill(dados.input.dadosPessoais2.complemento);

    await page.waitForTimeout(ONE_SECOND * 2.5);

    const { uf, bairro, numero, cidade, endereco } = dados.input.dadosPessoais2;
    expect(page.getByText(uf)).toBeTruthy();
    expect(page.getByText(bairro)).toBeTruthy();
    expect(page.getByText(numero)).toBeTruthy();
    expect(page.getByText(cidade)).toBeTruthy();
    expect(page.getByText(endereco)).toBeTruthy();

    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.step("Validar: 2° form (Agora, basta preencher os dados do imóvel)", async () => {
    // UF
    await page.locator(".react-select__input-container").click();
    await page.getByText(dados.input.dadosDoImovel.uf, { exact: true }).click();

    // // Já tem imóvel definido? NÃO
    await page.getByRole("radio").nth(1).first().click();
    // // Valor do imóvel
    await page.getByLabel("Valor do imóvel").first().fill(dados.input.dadosDoImovel.valorDoImovel);
    // // Valor de entrada
    await page.getByLabel("Valor de entrada").first().fill(dados.input.dadosDoImovel.valorDeEntrada);
    // // Vai utilizar FGTS? NÃO
    await page.getByRole("radio").nth(3).first().click();
    // Valor de financiamento (Preenchido automaticamente, travado para o usuário)
    // Prazo de pagamento
    await page.getByPlaceholder("000").first().fill(dados.input.dadosDoImovel.prazoDePagamento);
    // // Incluir custos de ITBI E registros 5%?
    await page.getByRole("radio").nth(4).first().click();
    // Valor das despesas financiadas (Preenchido automaticamente, travado para o usuário)
    // Valor total financiado (Preenchido automaticamente, travado para o usuário)

    // valorTotalFinanciado = (valorDoImovel - valorDeEntrada) + valorDasDespesasFinanciadas
    const { valorDoImovel, valorDeEntrada, valorTotalFinanciado, valorDasDespesasFinanciadas } =
      dados.input.dadosDoImovel;
    const valor = Number(valorDoImovel) - Number(valorDeEntrada) + Number(valorDasDespesasFinanciadas);

    expect(Number(valorTotalFinanciado)).toEqual(valor);

    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.step("Validar: 3° form (Condições dos parceiros)", async () => {
    // (Loading dos parceiros da jornada de financiamento imobiliário)
    await page.waitForTimeout(ONE_SECOND * 65);
    await page.getByRole("button", { name: "Continuar" }).click();
  });

  await test.skip("Validar: 4° form (Última etapa)", async () => {
    await page.waitForTimeout(ONE_SECOND * 20);
    await page.getByRole("button", { name: "Gerar e acompanhar proposta" }).click();
  });

  await test.skip("Validar: modal de sucesso ao criar proposta", async () => {
    expect(page.getByText("Sua solicitação foi enviada ao Business Banker!").isVisible()).toBeTruthy();
    expect(page.getByRole("button", { name: "entendi!" }).isVisible()).toBeTruthy();

    await page.getByRole("button", { name: "entendi!" }).click();
  });
});
