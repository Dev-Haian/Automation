import { Client } from "pg";
import { test as pw } from "@playwright/test";

class DB {
  private DBConfig = {
    user: "db_user",
    host: "0.0.0.0",
    password: "password",
    database: "local_db",
    port: 5432,
    idleTimeoutMillis: 30000,
    conectionTimeoutMillis: 2000,
  };

  async executeQuery(query: string) {
    const client = new Client(this.DBConfig);
    await client.connect();
    const result = await client.query(query);
    // console.log(result.rows);

    await client.end();
  }
}

type QaAutomationForDB = {
  db: DB;
};

const BancoDeDados = pw.extend<QaAutomationForDB>({
  db: async ({ page }, use) => {
    await use(new DB());
  },
});

export { BancoDeDados };
