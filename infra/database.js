import pg from "pg";

async function query(queryObject) {
  const { Client } = pg;

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: String(process.env.POSTGRES_PASSWORD),
  });

  try {
    await client.connect();
    const response = await client.query(queryObject);
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
}

export default query;
