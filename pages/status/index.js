"use client";

import styles from "./style.module.scss";
import useSWR from "swr";

const StatusPage = () => {
  const { data: status, isLoading } = useSWR("/api/status/v1");

  return (
    <div>
      <div className={styles.statusPageContainer}>Status Page</div>
      {isLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <div className={styles.label}>Max Connections:</div>
            <div className={styles.value}>{status?.maxConnections}</div>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.label}>Open Connections:</div>
            <div className={styles.value}>{status?.openedConnections}</div>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.label}>Update:</div>
            <div className={styles.value}>
              {new Date(status?.update_at).toDateString()}
            </div>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.label}>Version:</div>
            <div className={styles.value}>{status?.version}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
