import type { Page } from "@playwright/test";
import { ONE_SECOND } from "../test-timeout";

/**
 * Esta função verifica a visibilidade das modais iniciais da plataforma.
 *
 * Caso nenhuma modal seja encontrada, a função apenas segue o fluxo normal da automação.
 */
export async function checkInitialModals(page: Page) {
  await page.waitForTimeout(ONE_SECOND * 10);

  // Modal de survey
  const closeSurveyModal = page.getByRole("button", { name: "10" });
  if (await closeSurveyModal.isVisible()) {
    await closeSurveyModal.click();

    await page.getByPlaceholder("Eu recomendaria a Teddy").pressSequentially("Isso é uma automação dos QA's");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Close" }).click();
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
