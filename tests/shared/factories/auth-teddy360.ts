import { expect, type Page } from "@playwright/test";

type UserLoginProps = { page: Page; userEmail: string; userPassword: string; url: string };
type UserLogoutProps = { page: Page; url: string };

/**
 * AuthTeddy360 é uma classe de factory para autenticação
 */
class AuthTeddy360 {
  /**
   * o método "makeUserLogin()" é uma factory da classe "AuthTeddy360" para lidar com a autenticação do usuário na automação.
   *
   * @example
   * ```typescript
   * await AuthTeddy360Teddy360().makeUserLogin({
   * 	page: Page, // informar page do Playwright
   * 	userEmail: "seu.email@email.com",
   * 	userPassword: "sua senha",
   * 	url: "url-da-aplicação.com",
   * });
   * ```
   * No exemplo acima, o QA chama uma instância da factory para autenticar o usuário.
   */
  public async makeUserLogin({ page, userEmail, userPassword, url }: UserLoginProps) {
    await page.goto(`${url}/#/login`);

    await page.getByPlaceholder("Digite seu E-mail").fill(userEmail);
    await page.getByPlaceholder("Digite sua Senha").fill(userPassword);

    await page.getByRole("button", { name: "Acessar" }).click();
  }
  /**
   * o método "makeUserLogout()" é uma factory da classe "AuthTeddy360" para lidar com
   * o encerramento da sessão do usuário na automação.
   *
   * @example
   * ```typescript
   * await AuthTeddy360Teddy360().makeUserLogout({
   * 	page: Page // informar page do Playwright
   * 	url: "url-da-aplicação.com",
   * });
   * ```
   * No exemplo acima, o QA chama uma instância da factory para encerrar a sessão do usuário.
   */
  public async makeUserLogout({ page, url }: UserLogoutProps) {
    await page.goto(`${url}/#/dashboard`);

    await page.getByText("Bem-vindo").waitFor();

    const iconeDeConfig = "連 鍊"; // ícone de engrenagem / configurações

    await page.getByRole("button", { name: iconeDeConfig }).click();
    await page.locator("div").filter({ hasText: "Sair" }).nth(2).click();

    await page.goto(`${url}/#/login`);

    expect(page.url()).toEqual(`${url}/#/login`);
  }
}

export { AuthTeddy360 };
