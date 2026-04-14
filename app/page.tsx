export default function Home() {
  return (
    <main style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
        🚀 Vercel Deployment Working!
      </h1>

      <p style={{ marginTop: "10px", fontSize: "1.2rem" }}>
        If you see this, your setup is correct ✅
      </p>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer"
        }}
        onClick={() => alert("App is working fine!")}
      >
        Test Button
      </button>
    </main>
  );
}