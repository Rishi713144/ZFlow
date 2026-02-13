"use client";

import { Appbar } from "@/components/Appbar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (token) {
      axios.post(`${BACKEND_URL}/api/v1/user/verify`, { token })
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      {status === "loading" && <div className="text-xl font-medium animate-pulse">Verifying your email...</div>}
      {status === "success" && (
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-4">Email Verified!</div>
          <p className="text-gray-600 mb-8">You can now login to your account.</p>
          <PrimaryButton onClick={() => router.push("/login")} size="big">Go to Login</PrimaryButton>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-4">Verification Failed</div>
          <p className="text-gray-600 mb-8">The link might be invalid or expired.</p>
          <PrimaryButton onClick={() => router.push("/signup")} size="big">Back to Signup</PrimaryButton>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div>
      <Appbar />
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
