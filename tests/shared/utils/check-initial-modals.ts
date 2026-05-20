import type { Page } from "@playwright/test";
import { ONE_SECOND } from "../test-timeout";

/**
 * Fecha modais iniciais (survey, notícias, descartar proposta) quando visíveis.
 * Encerra assim que não houver mais modais, com limite de 10s.
 */
export async function checkInitialModals(page: Page) {
  await page.waitForLoadState("domcontentloaded");

  const deadline = Date.now() + ONE_SECOND * 10;

  while (Date.now() < deadline) {
    const dismissed = await dismissVisibleModals(page);
    if (!dismissed) {
      break;
    }
    await page.waitForTimeout(300);
  }
}

async function dismissVisibleModals(page: Page): Promise<boolean> {
  let dismissed = false;

  const closeSurveyModal = page.getByRole("button", { name: "10" });
  if (await closeSurveyModal.isVisible()) {
    await closeSurveyModal.click();
    await page.getByPlaceholder("Eu recomendaria a Teddy").pressSequentially("Isso é uma automação dos QA's");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Close" }).click();
    dismissed = true;
  }

  const btnX = page.locator("lib-modal-header").getByRole("button", { name: "" });
  if (await btnX.isVisible()) {
    await btnX.click();
    dismissed = true;
  }

  const disardProposalButton = page.getByRole("button", { name: "Descartar proposta" });
  if (await disardProposalButton.isVisible()) {
    await disardProposalButton.click();
    dismissed = true;
  }

  return dismissed;
}
