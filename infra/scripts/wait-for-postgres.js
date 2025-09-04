const { exec } = require("node:child_process");

function waitForPostgres() {
  exec(
    "docker exec tabnews_dev pg_isready --host localhost",
    (error, stdout) => {
      if (stdout.search("accepting connections") === -1) {
        process.stdout.write(".");
        waitForPostgres();

        return;
      }

      console.log("\n🟢 Postgres is ready!");
    },
  );
}

process.stdout.write("🔵 Waiting for Postgres to be ready");
waitForPostgres();
