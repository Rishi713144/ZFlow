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

    return <div className="flex border-b justify-between p-4">
        <div className="flex flex-col justify-center text-2xl font-extrabold cursor-pointer" onClick={() => {
            router.push("/")
        }}>
            ZFlow
        </div>
        <div className="flex">
            <div className="pr-4">
                <LinkButton onClick={() => { }}>Contact Sales</LinkButton>
            </div>
            {!isUser ? <div className="pr-4">
                <LinkButton onClick={() => {
                    router.push("/login")
                }}>Login</LinkButton>
            </div> : null}
            {!isUser ? <PrimaryButton onClick={() => {
                router.push("/signup")
            }}>
                Signup
            </PrimaryButton> : <PrimaryButton onClick={() => {
                localStorage.removeItem("token");
                setIsUser(false);
                router.push("/");
            }}>
                Logout
            </PrimaryButton>}
        </div>
    </div>
}