"use client";

import { motion, useSpring } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect } from "react";

export function ScrollProgressBar() {
  const lenis = useLenis();

  const progress = useSpring(0, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  useEffect(() => {
    if (!lenis) return;

    const update = ({ scroll }: { scroll: number }) => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const value = docHeight > 0 ? scroll / docHeight : 0;
      progress.set(value);
    };

    lenis.on("scroll", update);

    return () => {
      lenis.off("scroll", update);
    };
  }, [lenis, progress]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
      <motion.div
        className="h-full bg-linear-to-r from-blue-400 via-blue-500 to-cyan-400 origin-left"
        style={{ scaleX: progress }}
      />
    </div>
  );
}
