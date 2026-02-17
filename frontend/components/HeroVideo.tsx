"use client";
import { motion } from "framer-motion";
import {
    Calendar,
    Cloud,
    Database,
    FileText,
    Mail,
    MessageSquare,
    ShoppingCart,
    Terminal
} from "lucide-react";

export const HeroVideo = () => {
    // Icons representing connected apps
    const apps = [
        { Icon: Mail, color: "text-red-500", bg: "bg-red-50" },
        { Icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
        { Icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
        { Icon: Database, color: "text-green-600", bg: "bg-green-50" },
        { Icon: ShoppingCart, color: "text-emerald-500", bg: "bg-emerald-50" },
        { Icon: FileText, color: "text-blue-400", bg: "bg-blue-50" },
        { Icon: Terminal, color: "text-gray-800", bg: "bg-gray-100" },
        { Icon: Cloud, color: "text-cyan-500", bg: "bg-cyan-50" },
    ];

    return (
        <div className="flex justify-center px-4 md:px-8 py-12 bg-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative max-w-4xl w-full aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200 flex items-center justify-center"
            >
                {/* Connecting Lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full opacity-20" style={{ maxWidth: '800px', maxHeight: '450px' }}>
                        {apps.map((_, i) => {
                            const angle = (i * 360) / apps.length;
                            const radius = 180; // Distance from center
                            // Calculate position based on center (assuming 50% 50% is 0,0 for calc)
                            // We need real coordinates if we use absolute positioning for icons.
                            return (
                                <line
                                    key={i}
                                    x1="50%"
                                    y1="50%"
                                    x2={`${50 + (Math.cos(angle * Math.PI / 180) * 35)}%`}
                                    y2={`${50 + (Math.sin(angle * Math.PI / 180) * 35)}%`}
                                    stroke="#94a3b8"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Center Hub: ZFlow */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    className="z-20 relative flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-[#ff4f00] rounded-3xl shadow-2xl shadow-orange-500/30"
                >
                    <div className="text-white font-extrabold text-4xl mb-1">Z</div>
                    <div className="text-white font-bold text-lg leading-none">Flow</div>

                    {/* Outer rings pulse */}
                    <div className="absolute -inset-4 border-2 border-[#ff4f00]/20 rounded-3xl -z-10 animate-pulse"></div>
                    <div className="absolute -inset-8 border border-[#ff4f00]/10 rounded-[2rem] -z-20"></div>
                </motion.div>

                {/* App Icons Orbiting */}
                {apps.map((app, i) => {
                    const angle = (i * 360) / apps.length; // 0, 45, 90...
                    const radius = "35%"; // Distance from center percentage

                    return (
                        <motion.div
                            key={i}
                            className={`absolute z-10 w-16 h-16 ${app.bg} rounded-2xl shadow-md flex items-center justify-center border border-slate-100`}
                            style={{
                                left: `50%`,
                                top: `50%`,
                                x: "-50%",
                                y: "-50%",
                            }}
                            animate={{
                                x: [
                                    `calc(-50% + ${Math.cos(angle * Math.PI / 180) * 280}px)`,
                                    `calc(-50% + ${Math.cos(angle * Math.PI / 180) * 290}px)`,
                                    `calc(-50% + ${Math.cos(angle * Math.PI / 180) * 280}px)`
                                ],
                                y: [
                                    `calc(-50% + ${Math.sin(angle * Math.PI / 180) * 160}px)`, // Flattened orbit (ellipse)
                                    `calc(-50% + ${Math.sin(angle * Math.PI / 180) * 170}px)`,
                                    `calc(-50% + ${Math.sin(angle * Math.PI / 180) * 160}px)`
                                ]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.1
                            }}
                        >
                            <app.Icon className={`w-8 h-8 ${app.color}`} />
                        </motion.div>
                    );
                })}

                {/* Floating "Success" badges or particles for liveliness */}
                <motion.div
                    className="absolute top-10 right-20 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    Success
                </motion.div>
                <motion.div
                    className="absolute bottom-10 left-20 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                    Automated
                </motion.div>

            </motion.div>
        </div>
    );
};