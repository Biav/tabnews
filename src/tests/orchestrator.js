import retry from "async-retry";

async function awaitForAllServices() {
  await awaitToDb();

  function awaitToDb() {
    return retry(
      //eslint-disable-next-line
      async (bail) => {
        const res = await fetch(`${process.env.BASE_URL}/api/status/v1`);
        if (!res.ok) {
          throw new Error("Service not ready");
        }
        return res;
      },
      {
        retries: 10,
        maxTimeout: 1000,
      },
    );
  }
}

export { awaitForAllServices };
