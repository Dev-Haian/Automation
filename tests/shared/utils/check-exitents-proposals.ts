import type { Page } from "@playwright/test";
import { ONE_SECOND } from "../test-timeout";

/**
 * Esta função verifica a visibilidade da modal de proposta em andamento.
 * A mesma tem como bônus verificar a visiblidade da modal de survey.
 *
 * Caso uma (ou ambas) as modais estejam visiveis, esta função vai fechá-las, clicando nos botões:
 * - Descartar Proposta;
 * - "X" para fechar a modal de survey;
 *
 * Caso contrário, a função apenas segue o fluxo normal da automação.
 */
export async function checkExistentsProposals(page: Page) {
  await page.waitForTimeout(ONE_SECOND * 7);

  const closeSurveyModal = page.locator("//html/body/ampl-survey/survey/div[2]/i");
  if (await closeSurveyModal.isVisible()) {
    await closeSurveyModal.click();
  }

  const disardProposalButton = page.getByRole("button", { name: "Descartar proposta" });
  if (await disardProposalButton.isVisible()) {
    await disardProposalButton.click();
  }
}
