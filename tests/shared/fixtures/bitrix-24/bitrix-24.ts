import { test as pw } from "@playwright/test";
import { setup } from "../../setup";
import { ONE_SECOND } from "../../test-timeout";

class Bitrix24 {
  private url = "https://teddy360.hub23.com.br/";
  private access = {
    email: setup.user.email,
    password: setup.user.password,
  };

  private async login(email: string, password: string) {
    pw("Realizar login no Bitrix24", async ({ page }) => {
      await page.goto(this.url);

      await page.locator('input[name="USER_LOGIN"]').fill(email);
      await page.locator('input[name="USER_PASSWORD"]').fill(password);

      const button = page.getByRole("button", { name: "Login" });
      button.click();
      button.waitFor({ timeout: ONE_SECOND * 5 });
    });
  }

  async findProposalById(proposalId: string) {
    await this.login(this.access.email, this.access.password);

    pw("Obter proposta pelo ID", async ({ page }) => {
      await page.goto(`https://teddy360.hub23.com.br/crm/deal/details/${proposalId}/`);
    });
  }
}

type QaAutomationForBitrix24 = {
  bitrix24: Bitrix24;
};

const CRM = pw.extend<QaAutomationForBitrix24>({
  bitrix24: async ({ page }, use) => {
    await use(new Bitrix24());
  },
});

export { CRM };
