"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function HomeClient() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </motion.main>
      )}
    </>
  );
}
