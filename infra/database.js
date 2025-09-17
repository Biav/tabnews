import pg from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const response = await client.query(queryObject);
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
}

async function getNewClient() {
  const { Client } = pg;

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: String(process.env.POSTGRES_PASSWORD),
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  await client.connect();

  return client;
}

const dbConfig = {
  query,
  getNewClient,
};

export default dbConfig;
