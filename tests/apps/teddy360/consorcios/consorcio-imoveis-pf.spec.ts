import test from "@playwright/test";
import { ONE_SECOND, TRHEE_MINUTES } from "../../../shared/test-timeout";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import {
  COMMON_BUTTONS,
  createBaseDados,
  dismissInitialModals,
  loginAsQaUser,
  openClientsModule,
  selectLastClientNewProposal,
} from "../../../shared/helpers";

// TODO: Automação a fazer!
test.setTimeout(TRHEE_MINUTES);
const sut = "(Teddy360) Consórcio - Imóveis (PF)";

test(`Feat: [${sut}] Validar fluxo completo de geração de propostas na plataforma`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = {
    ...createBaseDados("conkey"),
    input: {
      campo: "valor de input do campo",
    },
    botoes: {
      continuar: COMMON_BUTTONS.continuar,
      enviarProposta: "Enviar nova proposta",
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
    await selectLastClientNewProposal(page);
  });

  await test.step(`Validar: acessar e iniciar jornada de ${sut}`, async () => {
    await page.locator("lib-button", { hasText: "Consórcios" }).click();
    await page.locator("lib-button", { hasText: "Consórcio - Imóveis" }).click();

    await page.getByRole("button", { name: dados.botoes.continuar }).click();

    await page.locator("label").filter({ hasText: "Busca Manual" }).locator("div").click();
    await page.getByRole("button", { name: "  Busca Manual" }).click();
  });

  await test.step(`Validar: preenchimento do formulário de ${sut}`, async () => {
    // Automatizar o preenchimento dos forms
  });

  await test.skip(`Validar: Enviar proposta de ${sut}`, async () => {
    const botao = page.getByRole("button", { name: dados.botoes.enviarProposta });
    await botao.click();
    await botao.waitFor({ timeout: ONE_SECOND * 5 });
  });
});
