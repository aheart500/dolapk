import Head from "next/head";

export default function Home() {
  return (
    <div className="app-container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
        }}
      >
        <h1 style={{ margin: "0" }}>Dolapk</h1>
        <p>Coming soon....</p>
      </div>
    </div>
  );
}
