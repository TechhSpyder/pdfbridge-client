import React from "react";

export default function Title({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        {icon}

        {title}
      </h1>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
