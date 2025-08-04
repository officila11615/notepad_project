import React from "react";

// If you want to use the cn utility, import it from your utils (uncomment if needed)
// import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div
      // className={cn("flex items-center justify-center min-h-screen")}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#101038",
        color: "white",
        flexDirection: "column"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404</h1>
      <p>This page could not be found.</p>
    </div>
  );
}
