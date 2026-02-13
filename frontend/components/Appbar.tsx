"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
    const router = useRouter();
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage.getItem("token")) {
            setIsUser(true);
        }
    }, [])

    return (
        <div className="flex border-b border-slate-200 px-8 py-4 justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent cursor-pointer" onClick={() => router.push("/")}>
                ZFlow
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-4 items-center">
                    <LinkButton onClick={() => { }}>Contact Sales</LinkButton>
                    {!isUser && (
                        <LinkButton onClick={() => router.push("/login")}>Login</LinkButton>
                    )}
                </div>
                {!isUser ? (
                    <PrimaryButton onClick={() => router.push("/signup")}>
                        Get Started Free
                    </PrimaryButton>
                ) : (
                    <PrimaryButton onClick={() => {
                        localStorage.removeItem("token");
                        setIsUser(false);
                        router.push("/");
                    }}>
                        Logout
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
}