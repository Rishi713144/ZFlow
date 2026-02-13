"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { Feature } from "./Feature";

export const Hero = () => {
    const router = useRouter();
    return (
        <div className="relative overflow-hidden pt-20 pb-16 px-8 flex flex-col items-center text-center">
            {/* Background Blob */}
            <div className="absolute top-0 -z-10 h-full w-full bg-white">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(245,158,11,0.1)] opacity-70 blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-4xl"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    New: AI-Powered Workflows
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
                    Automate as fast as you <span className="text-amber-600 italic font-medium">think.</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                    ZFlow empowers everyone to build complex automated workflows in minutes. Connect your apps, sync your data, and scale your business.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                    <PrimaryButton onClick={() => router.push("/signup")} size="big">
                        Start for free
                    </PrimaryButton>
                    <SecondaryButton onClick={() => { }} size="big">
                        Contact Sales
                    </SecondaryButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
                    <Feature title="Free forever" subtitle="for core features" />
                    <Feature title="More apps" subtitle="than any other platform" />
                    <Feature title="Enterprise grade" subtitle="security & reliability" />
                </div>
            </motion.div>
        </div>
    );
};