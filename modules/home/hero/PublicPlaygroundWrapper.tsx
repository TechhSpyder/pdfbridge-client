"use client";

import dynamic from "next/dynamic";

export const PublicPlaygroundWrapper = dynamic(
  () => import("./PublicPlayground").then((mod) => mod.PublicPlayground),
  { ssr: false }
);
