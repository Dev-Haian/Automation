import { expect, type Page } from "@playwright/test";
import { NEW_PROPOSAL_BUTTON_ICON } from "../constants";
import { AuthTeddy360 } from "../factories/auth-teddy360";
import { checkInitialModals } from "../utils/check-initial-modals";
import type { BaseDados } from "./test-context";

export type PersonType = "PF" | "PJ";

type AuthSlice = Pick<BaseDados, "plataforma" | "usuario">;

export async function loginAsQaUser(page: Page, auth: AuthSlice): Promise<void> {
  await new AuthTeddy360().makeUserLogin({
    page,
    url: auth.plataforma.url,
    userEmail: auth.usuario.email,
    userPassword: auth.usuario.senha,
  });
}

export async function dismissInitialModals(page: Page): Promise<void> {
  await checkInitialModals(page);
}

export async function openClientsModule(page: Page, baseUrl: string): Promise<void> {
  await page.locator("#itens-menu").getByText("Clientes").click();
  await page.waitForURL(`${baseUrl}/#/client-list`);
  expect(page.url()).toEqual(`${baseUrl}/#/client-list`);
}

export async function selectLastClientNewProposal(
  page: Page,
  options?: { personType?: PersonType }
): Promise<void> {
  if (options?.personType === "PF") {
    await page.locator("lib-tab-item").filter({ hasText: "Pessoa Física" }).first().click();
  }

  if (options?.personType === "PJ") {
    await page.locator("lib-tab-item").filter({ hasText: "Pessoa Jurídica" }).first().click();
  }

  await page.getByRole("button", { name: NEW_PROPOSAL_BUTTON_ICON }).nth(-1).click();
}
