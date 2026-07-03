import { useState } from "react";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_URL;

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Unable to send reset code"
        );
        return;
      }

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch {
      setError(
        "Could not connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-80"
      >
        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-500">
          Enter your email and we'll send
          you a reset code.
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-2 rounded"
          required
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading
            ? "Sending..."
            : "Send Reset Code"}
        </button>
      </form>
    </div>
  );
}