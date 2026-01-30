import database from "infra/database";
import { InternalServerError } from "infra/errors/InternalServerErros";

async function status(req, res) {
  try {
    const updateAt = new Date();
    const version = await database.query("SHOW server_version;");
    const maxConnections = await database.query("SHOW max_connections;");
    const databaseName = process.env.POSTGRES_DB;
    const databaseConnections = await database.query({
      text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname=$1;",
      values: [databaseName],
    });

    return res.status(200).json({
      update_at: updateAt,
      version: version?.rows[0]?.server_version,
      maxConnections: parseInt(maxConnections?.rows[0]?.max_connections),
      openedConnections: databaseConnections?.rows[0]?.count,
    });
  } catch (error) {
    const errorResponse = new InternalServerError({ cause: error });
    return res.status(500).json(errorResponse);
  }
}

export default status;
