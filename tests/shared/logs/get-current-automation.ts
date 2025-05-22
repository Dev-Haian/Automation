import fs from "node:fs";

/**
 * "getCurrentAutomation" É uma função utilitária para imprimir no terminal a automação que está sendo executada
 * e a versão da mesma!
 *
 * **NOTA**: isso será refletido em qualquer terminal, seja local, em cloud e até mesmo nas actions do GitHub
 */
export function getCurrentAutomation(sut: string) {
  const { version } = JSON.parse(fs.readFileSync("package.json", "utf-8"));

  console.log(`Automação: ${sut} -> Versão: ${version}\n`);
}
