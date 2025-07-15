import { motion } from "framer-motion";
import {Head, Link} from "@inertiajs/react";
import React from "react";

export default function Welcome() {
    return (
        <div>
        <Head title="Welcome" />
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white relative overflow-hidden">
            <motion.div
                className="absolute w-[600px] h-[600px] bg-white/10 rounded-full -top-40 -left-40 blur-3xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            />

            <motion.div
                className="z-10 text-center p-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <motion.h1
                    className="text-5xl font-bold mb-4"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Welcome to Excel Importer
                </motion.h1>
                <motion.p
                    className="text-lg mb-8 max-w-md mx-auto text-white/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    A modern platform built with Laravel and React.
                </motion.p>
                <div className="flex justify-center gap-6">
                    <Link
                        href="/login"
                        className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-2 border border-white font-semibold rounded-full hover:bg-white hover:text-pink-600 transition duration-300"
                    >
                        Register
                    </Link>
                </div>
            </motion.div>
        </div>
        </div>
    );
}
