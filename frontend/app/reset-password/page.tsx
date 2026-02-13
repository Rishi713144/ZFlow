"use client";

import { Appbar } from "@/components/Appbar";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BACKEND_URL } from "../config";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/reset-password`, {
        token,
        newPassword: password
      });
      setMessage(res.data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (e) {
      setMessage("Failed to reset password. Link may be expired.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md w-full p-8 border rounded-xl shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      {message ? (
        <p className="text-center font-medium text-green-600">{message}</p>
      ) : (
        <>
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="pt-6">
            <PrimaryButton onClick={handleSubmit} size="big">
              {loading ? "Resetting..." : "Reset Password"}
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-20">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
