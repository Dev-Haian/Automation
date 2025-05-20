import { expect, type Page } from "@playwright/test";
import { ONE_SECOND } from "../test-timeout";

type UserLoginProps = { page: Page; userEmail: string; userPassword: string; url: string };
type UserLogoutProps = { page: Page; url: string };

/**
 * AuthBackOffice é uma classe de factory para autenticação
 */
class AuthBackOffice {
  /**
   * o método "makeUserLogin()" é uma factory da classe "AuthBackOffice" para lidar com a autenticação do usuário na automação.
   *
   * @example
   * ```typescript
   * await AuthBackOffice().makeUserLogin({
   * 	page: Page, // informar page do Playwright
   * 	userEmail: "seu.email@email.com",
   * 	userPassword: "sua senha",
   * 	url: "url-da-aplicação.com",
   * });
   * ```
   * No exemplo acima, o QA chama uma instância da factory para autenticar o usuário.
   */
  public async makeUserLogin({ page, userEmail, userPassword, url }: UserLoginProps) {
    // Acessar Back-Office
    await page.goto(`${url}/auth/sign-in`);

    // preencher credenciais de login
    await page.getByPlaceholder("Digite o seu e-mail:").fill(userEmail);
    await page.getByPlaceholder("Digite a sua senha:").fill(userPassword);

    // clicar no notão de login "Acessar"
    await page.getByRole("button", { name: "Acessar" }).click();
    await page.waitForURL(`${url}/user/marketing/white-label`, { timeout: ONE_SECOND * 3 });

    // Asserção - usuário deve conseguir acessar a plataforma
    expect(page.url()).toEqual(`${url}/user/marketing/white-label`);
  }
  /**
   * o método "makeUserLogout()" é uma factory da classe "AuthBackOffice" para lidar com
   * o encerramento da sessão do usuário na automação.
   *
   * @example
   * ```typescript
   * await AuthBackOffice().makeUserLogout({
   * 	page: Page // informar page do Playwright
   * 	url: "url-da-aplicação.com",
   * });
   * ```
   * No exemplo acima, o QA chama uma instância da factory para encerrar a sessão do usuário.
   */
  public async makeUserLogout({ page, url }: UserLogoutProps) {
    await page.goto(`${url}/user/marketing/white-label`);

    const iconeDeConfig = ""; // ícone de engrenagem / configurações
    await page.getByRole("button", { name: iconeDeConfig }).nth(1).click();
    await page.getByRole("button", { name: " Sair" }).click();

    await page.waitForURL(`${url}/`, { timeout: ONE_SECOND * 3 });

    expect(page.url()).toEqual(`${url}/auth/sign-in`);
  }
}

export { AuthBackOffice };
