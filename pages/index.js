import React from "react";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "3rem",
      }}
    >
      <h1 data-testid="text">
        Constructing a page of news using NextJS, to study a bunch of concepts
        of developing like BD, backend, deploy and test
      </h1>
    </div>
  );
};

export default Home;
