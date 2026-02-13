"use client";

import { Appbar } from "@/components/Appbar";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (e) {
      setMessage("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-20">
        <div className="max-w-md w-full p-8 border rounded-xl shadow-sm bg-white">
          <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
          {message ? (
            <p className="text-gray-600 mb-4">{message}</p>
          ) : (
            <>
              <Input
                label="Email Address"
                type="text"
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pt-6">
                <PrimaryButton onClick={handleSubmit} size="big">
                  {loading ? "Sending..." : "Send Reset Link"}
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
