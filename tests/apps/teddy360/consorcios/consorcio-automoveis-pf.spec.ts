import test, { expect } from "@playwright/test";
import { AuthTeddy360 } from "../../../shared/factories/auth-teddy360";
import { ONE_SECOND, TRHEE_MINUTES } from "../../../shared/test-timeout";
import { setup } from "../../../shared/setup";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import { checkInitialModals } from "../../../shared/utils/check-initial-modals";

// TODO: Automação a fazer!
test.setTimeout(TRHEE_MINUTES);
const api = {
  enviarProposta: "https://backend-consorcio-prod.teddy360.com.br/proposals/send-proposal",
};
const sut = "(Teddy360) Consórcio - Automóveis (PF)";

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
    input: {
      campo: "valor de input do campo",
    },
    botoes: {
      continuar: "Continuar",
      enviarProposta: "Enviar nova proposta",
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
    await page.locator("lib-button", { hasText: "Consórcios" }).click();
    await page.locator("lib-button", { hasText: "Consórcio - Automóveis" }).click();

    await page.getByRole("button", { name: dados.botoes.continuar }).click();

    await page.locator("label").filter({ hasText: "Busca Manual" }).locator("div").click();
    await page.getByRole("button", { name: "  Busca Manual" }).click();
  });

  await test.step(`Validar: preenchimento do formulário de ${sut}`, async () => {
    // Automatizar o preenchimento dos forms
  });
  // INFO: para avançar e finalizar a automação, mude 'skip' para 'step'. Após isso, remove esse comentário
  await test.skip(`Validar: Enviar proposta de ${sut}`, async () => {
    const botao = page.getByRole("button", { name: dados.botoes.enviarProposta });
    await botao.click();
    await botao.waitFor({ timeout: ONE_SECOND * 5 });
  });
});
