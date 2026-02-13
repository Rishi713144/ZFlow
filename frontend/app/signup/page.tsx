"use client";
import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BACKEND_URL } from "../config";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [signedUp, setSignedUp] = useState(false);

    if (signedUp) {
        return (
            <div>
                <Appbar />
                <div className="flex justify-center pt-20">
                    <div className="max-w-md text-center">
                        <h1 className="text-3xl font-bold mb-4">Check your email!</h1>
                        <p className="text-slate-600 mb-8">We've sent a verification link to <span className="font-semibold text-slate-900">{email}</span>. Please verify your account to continue.</p>
                        <PrimaryButton onClick={() => router.push("/login")} size="big">Back to Login</PrimaryButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="flex pt-8 max-w-4xl w-full">
                    <div className="flex-1 pt-20 px-8">
                        <div className="font-bold text-4xl text-slate-900 pb-4 leading-tight">
                            Join millions worldwide who automate their work using ZFlow.
                        </div>
                        <div className="space-y-6 pt-6">
                            <CheckFeature label={"Easy setup, no coding required"} />
                            <CheckFeature label={"Free forever for core features"} />
                            <CheckFeature label={"14-day trial of premium features & apps"} />
                        </div>
                    </div>
                    <div className="flex-1 pt-8 pb-8 mt-12 px-8 border border-slate-200 rounded-2xl shadow-xl bg-white">
                        <div className="space-y-4">
                            <Input label={"Full Name"} onChange={e => setName(e.target.value)} type="text" placeholder="John Doe" />
                            <Input label={"Work Email"} onChange={e => setEmail(e.target.value)} type="text" placeholder="john@company.com" />
                            <Input label={"Password"} onChange={e => setPassword(e.target.value)} type="password" placeholder="Min 6 characters" />

                            <div className="pt-6">
                                <PrimaryButton
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
                                                username: email,
                                                password,
                                                name
                                            });
                                            setSignedUp(true);
                                        } catch (e) {
                                            alert("Signup failed. Please try again.");
                                        }
                                        setLoading(false);
                                    }}
                                    size="big"
                                >
                                    {loading ? "Creating account..." : "Get started free"}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}