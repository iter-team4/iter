import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_URL;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Password reset failed."
        );
        return;
      }

      setSuccess("Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError(
        "Could not connect to server."
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
          Reset Password
        </h1>

        <p className="text-sm text-gray-500">
          Resetting password for:
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Verification code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value)
          }
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
          required
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-500 text-sm">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
        </button>
      </form>
    </div>
  );
}