import React from "react";
import { motion } from "framer-motion";

const FeatureSection: React.FC = () => {
    return (
        <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border border-gray-200 rounded-full bg-white text-xs font-semibold tracking-wide uppercase text-gray-800">
                        <svg
                            className="w-3 h-3 mr-2 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        FEATURES
                    </div>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                        style={{ fontFamily: "Inter, sans-serif" }}
                    >
                        Latest advanced technologies to
                        <br />
                        ensure everything you needs
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Maximize your team's productivity and security with our affordable,
                        user-friendly contract management system.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Top Big Card - NLP (Spans full width on desktop if we used a different grid, but here I'll make it span 2 cols) */}
                    <motion.div
                        className="col-span-1 md:col-span-2 bg-[#F3F5F1] dark:bg-gray-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex-1 z-10">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Natural Language Processing
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                Our core technology understands human-like conversation, allowing
                                you to add expenses and access complex analytics by simply asking
                                questions.
                            </p>
                            <button className="bg-emerald-900 hover:bg-emerald-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                                Explore all
                            </button>
                        </div>
                        <div className="flex-1 w-full flex justify-center md:justify-end">
                            <div className="relative w-full max-w-lg">
                                <img
                                    src="/feature_pic/nlp.png"
                                    alt="Natural Language Processing Interface"
                                    className="rounded-xl shadow-xl w-full h-auto object-cover transform transition-transform hover:scale-[1.02] duration-500 block"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Left Small Card - Dashboard */}
                    <motion.div
                        className="bg-[#F3F5F1] dark:bg-gray-800 rounded-3xl p-8 md:p-10 flex flex-col h-full"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Visual Interactive Dashboards
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Get a holistic view of your financial health with clean,
                                interactive dashboards that provide a deep dive into your
                                spending habits over time.
                            </p>
                        </div>
                        <div className="mt-auto flex justify-center">
                            <img
                                src="/feature_pic/visual interactive dashboard.png"
                                alt="Dashboard"
                                className="rounded-xl shadow-lg w-full max-w-sm h-auto object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Bottom Right Small Card - OCR */}
                    <motion.div
                        className="bg-[#F3F5F1] dark:bg-gray-800 rounded-3xl p-8 md:p-10 flex flex-col h-full"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Receipt Scanning (OCR)
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Simply upload a photo of your receipt. Our AI uses Optical
                                Character Recognition (OCR) to automatically extract and populate
                                key details like the vendor, date, and total.
                            </p>
                        </div>
                        <div className="mt-auto flex justify-center">
                            <img
                                src="/feature_pic/Receipt Scanning.png"
                                alt="OCR Scanning"
                                className="rounded-xl shadow-lg w-full max-w-sm h-auto object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
