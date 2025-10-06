"use client"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const [animateBg, setAnimateBg] = useState(false);
  let router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setAnimateBg(true), 200);
    return () => clearTimeout(timer);
  }, []);

  function handleClick(){
    router.push("/login")
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        initial={{ 
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)"
        }}
        animate={{ 
          background: animateBg 
            ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)"
            : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)"
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute inset-0"
      />

      {/* Floating animated shapes in background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 bg-green-200 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 md:w-64 md:h-64 bg-emerald-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-10 w-24 h-24 md:w-40 md:h-40 bg-green-300 rounded-full opacity-15 blur-2xl"
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative flex flex-col flex-1 items-center justify-center min-h-screen px-4"
      >
        {/* Fries - Hidden on small screens */}
        <motion.img
            src="/animation/fries.gif"
            alt="fries animation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="hidden md:block w-24 h-24 md:w-40 md:h-40 absolute top-20 right-10 md:right-60"
        />

        {/* Apple - Hidden on small screens */}
        <motion.img
            src="/animation/apple.gif"
            alt="apple animation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="hidden md:block w-24 h-24 md:w-40 md:h-40 absolute top-20 left-10 md:left-60 rotate-12"
        />

        <div className="flex flex-col items-center z-10">
          <motion.h1
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              duration: 1.5,
            }}
            className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-center"
          >
            Meal Mind
          </motion.h1>
    
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xl md:text-3xl pt-3 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-center"
          >
            Track Today, Thrive Tomorrow.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-gray-600 text-xs md:text-sm pt-8 md:pt-12 font-semibold text-center"
          >
            Your Meals, Verified by USDA Data.
          </motion.p>

          <motion.button
            onClick={() => handleClick()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 2.0, duration: 0.8, ease: "easeOut" }}
            className="mt-6 md:mt-10 px-6 md:px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
