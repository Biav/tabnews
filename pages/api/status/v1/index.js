import query from "../../../../infra/database";

async function status(req, res) {
  const result = await query("SELECT 1+1;");
  console.log(result.rows[0]);
  return res.status(200).json({ status: "ok" });
}

export default status;
