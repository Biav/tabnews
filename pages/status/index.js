import { useEffect } from "react";
import styles from "./style.module.scss";

// const getStatus = async () => {
//   const res = await fetch(`${process.env.BASE_URL}/api/status/v1`);
//   console.log("Fetch Response:", res.json());
//   return res;
// };

const StatusPage = () => {
  useEffect(() => {
    fetch(`/api/status/v1`)
      .then((res) => res.json())
      .then((statusResponse) => {
        console.log("Status Response:", statusResponse);
      }, []);
  }, []);

  return <div className={styles.statusPageContainer}>Status Page</div>;
};

export default StatusPage;
