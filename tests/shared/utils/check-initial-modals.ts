import type { Page } from "@playwright/test";
import { ONE_SECOND } from "../test-timeout";

/**
 * Esta função verifica a visibilidade das modais iniciais da plataforma.
 *
 * Caso nenhuma modal seja encontrada, a função apenas segue o fluxo normal da automação.
 */
export async function checkInitialModals(page: Page) {
  await page.waitForTimeout(ONE_SECOND * 3.5);

  // Modal de survey
  const closeSurveyModal = page.locator("//html/body/ampl-survey/survey/div[2]/i");
  if (await closeSurveyModal.isVisible()) {
    await closeSurveyModal.click();
  }

  // Modal de notícias (qualquer notícias)
  const btnX = page.locator("lib-modal-header").getByRole("button", { name: "" });
  if (await btnX.isVisible()) {
    await btnX.click();
  }

  // Modal de descartar propostas
  const disardProposalButton = page.getByRole("button", { name: "Descartar proposta" });
  if (await disardProposalButton.isVisible()) {
    await disardProposalButton.click();
  }
}
