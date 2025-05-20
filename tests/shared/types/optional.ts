/**
 * Faz com que uma ou mais propriedades sejam opcionais
 *
 * @example
 * ```typescript
 * type User {
 * 	id: string;
 * 	name: string;
 * 	email: string;
 * }
 * Optional<User , "id" | "email">
 * ```
 * No exemplo acima, apenas a propriedade "name" é obrigatória agora
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
