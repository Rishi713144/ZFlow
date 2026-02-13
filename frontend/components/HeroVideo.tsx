"use client";
import { motion } from "framer-motion";

export const HeroVideo = () => {
    return (
        <div className="flex justify-center px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200"
            >
                <video
                    src="https://res.cloudinary.com/zapier-media/video/upload/f_auto,q_auto/v1706042175/Homepage%20ZAP%20Jan%2024/012324_Homepage_Hero1_1920x1080_pwkvu4.mp4"
                    className="w-full h-full object-cover"
                    controls={false}
                    muted
                    autoPlay
                    loop
                />
            </motion.div>
        </div>
    );
};