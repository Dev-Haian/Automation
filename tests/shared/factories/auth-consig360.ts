import { expect, type Page } from "@playwright/test";
import { ONE_SECOND } from "../test-timeout";

type UserLoginProps = { page: Page; userEmail: string; userPassword: string; url: string };
type UserLogoutProps = { page: Page; url: string };

/**
 * AuthConsig360 é uma classe de factory para autenticação
 */
class AuthConsig360 {
  /**
   * o método "makeUserLogin()" é uma factory da classe "AuthConsig360" para lidar com a autenticação do usuário na automação.
   *
   * @example
   * ```typescript
   * await AuthConsig360().makeUserLogin({
   * 	page: Page, // informar page do Playwright
   * 	userEmail: "seu.email@email.com",
   * 	userPassword: "sua senha",
   * 	url: "url-da-aplicação.com",
   * });
   * ```
   * No exemplo acima, o QA chama uma instância da factory para autenticar o usuário.
   */
  public async makeUserLogin({ page, userEmail, userPassword, url }: UserLoginProps) {
    // Acessar Consig360
    await page.goto(`${url}/`);

    // preencher credenciais de login
    await page.getByTestId("input-email").fill(userEmail);
    await page.getByTestId("input-password").fill(userPassword);

    // clicar no notão de login "Acessar"
    await page.getByRole("button", { name: "Acessar" }).click();
    await page.waitForURL(`${url}/dashboard`, { timeout: ONE_SECOND * 3 });

    // Asserção - usuário deve conseguir acessar a plataforma
    expect(page.url()).toEqual(`${url}/dashboard`);
  }
  /**
   * o método "makeUserLogout()" é uma factory da classe "AuthConsig360" para lidar com
   * o encerramento da sessão do usuário na automação.
   *
   * @example
   * ```typescript
   * await AuthConsig360().makeUserLogout({
   * 	page: Page // informar page do Playwright
   * 	url: "url-da-aplicação.com",
   * });
   * ```
   * No exemplo acima, o QA chama uma instância da factory para encerrar a sessão do usuário.
   */
  public async makeUserLogout({ page, url }: UserLogoutProps) {
    await page.goto(`${url}/dashboard`);

    await page.getByText("Bem-vindo").waitFor();

    const iconeDeConfig = ""; // ícone de engrenagem / configurações
    await page.getByRole("button", { name: iconeDeConfig }).nth(1).click();
    await page.getByRole("button", { name: " Sair" }).click();

    await page.waitForURL(`${url}/`, { timeout: ONE_SECOND * 3 });

    expect(page.url()).toEqual(`${url}/`);
  }
}

export { AuthConsig360 };
