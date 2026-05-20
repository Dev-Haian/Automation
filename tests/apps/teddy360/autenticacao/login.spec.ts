import { test, expect } from "@playwright/test";
import { ONE_MINUTE, ONE_SECOND } from "../../../shared/test-timeout";
import { getCurrentAutomation } from "../../../shared/logs/get-current-automation";
import { createBaseDados, loginAsQaUser } from "../../../shared/helpers";

// DONE: Automação finalizada!
test.setTimeout(ONE_MINUTE);
const sut = "(Teddy360) Login";

test(`Feat: [${sut}] - Validar fluxo de autenticação`, async ({ page }) => {
  getCurrentAutomation(sut);

  const dados = createBaseDados("teddy360");

  await test.step("Usuário deve conseguir se autenticar com as credenciais corretas", async () => {
    await loginAsQaUser(page, dados);
    await page.waitForURL(`${dados.plataforma.url}/#/dashboard`, { timeout: ONE_SECOND * 10 });
    expect(page.url()).toBe(`${dados.plataforma.url}/#/dashboard`);
  });
});
