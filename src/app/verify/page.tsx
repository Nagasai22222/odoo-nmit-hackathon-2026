"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your email token...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided in the URL.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed. Token may be invalid or expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    }

    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="auth-header">
          <div className="auth-brand">DAYFLOW HRMS</div>
          <p className="auth-subtitle">Email Account Verification</p>
        </div>

        {status === "verifying" && (
          <div className="alert alert-warning">
            ⏳ {message}
          </div>
        )}

        {status === "success" && (
          <div className="alert alert-success" style={{ flexDirection: "column", gap: "1rem" }}>
            <div>🎉 {message}</div>
            <Link href="/login" className="btn-primary">
              Proceed to Sign In
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="alert alert-danger" style={{ flexDirection: "column", gap: "1rem" }}>
            <div>❌ {message}</div>
            <Link href="/login" className="btn-secondary">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
