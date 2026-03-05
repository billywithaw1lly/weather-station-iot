import React, { useState, useEffect } from "react";
import SkyNetLogo from "./SkyNetLogo";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronDown } from "lucide-react";

const Topbar = ({ isConnected }) => {
    const [isDark, setIsDark] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    return (
        <div
            className="relative 
        z-50 flex 
        justify-between 
        items-center 
        px-6 py-4 
        bg-white dark:bg-slate-900 
        border-b border-slate-100 dark:border-slate-800 
        transition-colors 
        duration-300"
        >
            {/* div 1 logo name and indicator */}
            <div
                className="flex 
            flex-col 
            items-center 
            gap-1"
            >
                {/* the logo and the name */}
                <div
                    className="flex 
                items-center 
                gap-2"
                >
                    <SkyNetLogo className="w-8 h-8" />
                    <span
                        className="text-xl 
                    font-bold 
                    tracking-tight 
                    dark:text-white"
                    >
                        SkyNet IoT
                    </span>
                </div>

                {/* the indicator*/}
                <div
                    className="flex 
                items-center
                gap-2 
                px-2 py-1 
                rounded-full 
                bg-slate-50 dark:bg-slate-800 
                border 
                border-slate-100 dark:border-slate-700
                "
                >
                    <div
                        className="relative 
                    flex 
                    h-2.5 w-2.5"
                    >
                        {isConnected && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        <span
                            className={`relative 
                                inline-flex 
                                rounded-full 
                                h-2.5 w-2.5
                                ${isConnected ? "bg-emerald-500" : "bg-red-500"}`}
                        ></span>
                    </div>
                    <span
                        className="text-[10px] 
                    font-bold 
                    text-slate-500 
                    dark:text-slate-400 
                    uppercase 
                    tracking-wider"
                    >
                        {isConnected ? "Live Feed" : "Offline"}
                    </span>
                </div>
            </div>

            {/* div 2 center tabs */}
            <div
                className="hidden 
            md:flex 
            items-center 
            p-1 
            bg-slate-100 
            dark:bg-slate-800/50 
            rounded-xl border 
            border-slate-200 dark:border-slate-700/50"
            >
                <button
                    className="px-5 py-2 
                rounded-lg 
                text-sm 
                font-semibold 
                bg-white dark:bg-slate-700 
                text-slate-800 dark:text-white 
                shadow-sm 
                transition-all"
                >
                    Live Summary
                </button>

                <div className="relative group">
                    <button
                        className="flex 
                    items-center 
                    ap-1 
                    px-5 py-2 
                    rounded-lg 
                    text-sm 
                    font-medium 
                    text-slate-500 dark:text-slate-400 
                    hover:text-slate-800 dark:hover:text-slate-200 
                    transition-all"
                    >
                        Component Analytics
                        <ChevronDown
                            size={16}
                            className="transition-transform 
                            group-hover:rotate-180"
                        />
                    </button>

                    <div
                        className="absolute 
                    top-full 
                    left-0 
                    mt-2 w-56 
                    opacity-0 
                    invisible 
                    group-hover:opacity-100 
                    group-hover:visible 
                    transition-all 
                    duration-200 z-50"
                    >
                        <div
                            className="p-2 
                        bg-white dark:bg-slate-800 
                        rounded-xl shadow-xl 
                        border border-slate-100 dark:border-slate-700 
                        flex flex-col 
                        gap-1"
                        >
                            <button
                                className="text-left 
                            px-4 py-2.5 
                            rounded-lg 
                            text-sm font-medium 
                            text-slate-600 dark:text-slate-300 
                            hover:bg-slate-50 dark:hover:bg-slate-700 
                            hover:text-sky-500 transition-colors"
                            >
                                Atmospheric Dynamics
                            </button>
                            <button
                                className="text-left 
                            px-4 py-2.5 
                            rounded-lg 
                            text-sm font-medium 
                            text-slate-600 dark:text-slate-300 
                            hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-500 
                            transition-colors"
                            >
                                Thermal Comfort
                            </button>
                            <button
                                className="text-left 
                            px-4 py-2.5 
                            rounded-lg 
                            text-sm 
                            font-medium 
                            text-slate-600 dark:text-slate-300 
                            hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-500 
                            transition-colors"
                            >
                                Environmental Quality
                            </button>
                        </div>
                    </div>
                </div>

                <button className="px-5 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all">
                    24h History
                </button>
            </div>

            {/* div 3 modes and menu */}
            <div className="flex items-center gap-3">
                {/* dark Mode Toggle */}
                <motion.button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 
                    rounded-full 
                    bg-slate-50 
                    dark:bg-slate-800 
                    text-slate-600 dark:text-slate-300 
                    hover:bg-slate-100 dark:hover:bg-slate-700 
                    transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        initial={false}
                        animate={{ rotate: isDark ? -180 : 0 }}
                        transition={{
                            duration: 0.4,
                            type: "spring",
                            stiffness: 200,
                        }}
                    >
                        {isDark ? <Moon size={20} /> : <Sun size={20} />}
                    </motion.div>
                </motion.button>

                {/* mobile menu */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden 
                    p-2 
                    flex flex-col 
                    justify-center 
                    items-center 
                    gap-1.5 
                    w-10 h-10 
                    rounded-full 
                    hover:bg-slate-50 dark:hover:bg-slate-800 
                    transition-colors"
                >
                    <span
                        className={`block 
                            w-5 h-0.5 
                            bg-slate-600 
                            dark:bg-slate-300 
                            transition-transform 
                            duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                    ></span>
                    <span
                        className={`block 
                            w-5 h-0.5 
                            bg-slate-600 dark:bg-slate-300 
                            transition-transform 
                            duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-0" : ""}`}
                    ></span>
                </button>
            </div>

            {/* mobile Dropdown Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute 
                        top-full 
                        left-0 w-full 
                        bg-white dark:bg-slate-900 
                        border-b border-slate-100 dark:border-slate-800 
                        shadow-xl md:hidden 
                        flex flex-col 
                        p-4 gap-2"
                    >
                        <button
                            className="text-left
                        px-4 py-3 
                        rounded-lg 
                        text-sm 
                        font-semibold 
                        bg-slate-100 dark:bg-slate-800 
                        text-slate-800 dark:text-white"
                        >
                            Live Summary
                        </button>

                        <div
                            className="px-4 py-2 
                        text-xs 
                        font-bold 
                        text-slate-400 
                        uppercase 
                        tracking-wider 
                        mt-2"
                        >
                            Component Analytics
                        </div>
                        <button
                            className="text-left 
                        px-4 py-2 
                        rounded-lg 
                        text-sm 
                        font-medium 
                        text-slate-600 dark:text-slate-300 
                        hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            Atmospheric Dynamics
                        </button>
                        <button
                            className="text-left 
                        px-4 py-2 
                        rounded-lg
                        text-sm 
                        font-medium 
                        text-slate-600 dark:text-slate-300 
                        hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            Thermal Comfort
                        </button>
                        <button
                            className="text-left 
                        px-4 py-2 
                        rounded-lg 
                        text-sm 
                        font-medium 
                        text-slate-600 dark:text-slate-300 
                        hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            Environmental Quality
                        </button>

                        <div
                            className="h-px 
                        bg-slate-100 dark:bg-slate-800 
                        my-2"
                        ></div>

                        <button
                            className="text-left 
                        px-4 py-3 
                        rounded-lg 
                        text-sm 
                        font-medium 
                        text-slate-600 dark:text-slate-300 
                        hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            24h History
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Topbar;
