import type { Page } from "@playwright/test";
import dayjs from "dayjs";
import fs from "node:fs";
import path from "node:path";

const folderName = "screenshots";

/**
 * Screenshot é uma classe utilitária para trabalhar com print's na automação
 */
class Screenshot {
  /**
   * O método "getPathToAttachment()" é um utilitário da classe "Screenshot" para
   * tirar um print da tela e retornar o caminho para o print.
   *
   * @example
   * ```typescript
   * await new Screenshot().getPathToAttachment(
   * 	page: Page // informar page do Playwright,
   * 	sut: "Nome da Automação Sob Teste. Variável sut"
   * );
   * ```
   * No exemplo acima, o QA chama uma instância do utilitário para tirar o print da tela
   * e obter o caminho para o usuário.
   */
  public async getPathToAttachment(page: Page, sut: string) {
    const date = dayjs().format("YYYY-MMMM-DD HH-mm-ss").toString();

    const attachmentName = `${sut}-(${date}).png`;

    const screenshotFolder = folderName;
    const pathToAttachment = `${screenshotFolder}/${attachmentName}`;

    await page.screenshot({ path: pathToAttachment });

    return pathToAttachment;
  }
  /**
   * o método "deleteAttachmentFromPath()" é um utilitário da classe "Screenshot" para
   * tirar um print da tela e retornar o caminho para o print.
   *
   * @example
   * ```typescript
   * await new Screenshot().deleteAttachmentFromPath(pathToAttachment: "caminho/para/o/arquivo/que/deseja/apagar.png");
   * ```
   * No exemplo acima, o QA chama uma instância do utilitário para
   * deletar o print com base no nome e pasta do arquivo.
   */
  public async deleteAttachmentFromPath(pathToAttachment: string) {
    const [folder, file] = pathToAttachment.split("/");

    // verifica a existência da pasta
    if (folder === folderName && fs.existsSync(folder)) {
      // remove o anexo específico
      const filePath = path.join(folder, file);
      await fs.promises.rm(filePath, { force: true });
      console.log(`Arquivo [${file}] removido com sucesso.`);
    } else {
      console.log(`Não há uma pasta [${folderName}] neste repositório. Logo não há um anexo [${file}] para deletar.`);
    }
  }
}

export { Screenshot };
