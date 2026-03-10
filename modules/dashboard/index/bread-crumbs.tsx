"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../../constants";

type Breadcrumb = {
  href: string;
  label: string;
};

const findLabel = (path: string): string | null => {
  const match = NAV_LINKS.find((link) => link.href === path);
  return match ? match.label : null;
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs: Breadcrumb[] = [];
  let accumulatedPath = "";

  segments.forEach((segment) => {
    accumulatedPath += `/${segment}`;
    const label = findLabel(accumulatedPath) || segment.replace(/-/g, " ");
    breadcrumbs.push({
      href: accumulatedPath,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    });
  });

  return (
    <nav className="text-sm breadcrumbs p-6 items-center border-b border-b-white/15 h-20 fixed top-12 w-full lg:sticky lg:top-0 bg-background md:flex hidden z-50">
      {breadcrumbs.map((crumb, idx) => (
        <span key={crumb.href} className="inline-flex items-center uppercase">
          {idx !== 0 && <span className="mx-1">{">"}</span>}
          {idx < breadcrumbs.length - 1 ? (
            <Link href={crumb.href} className="text-blue-500 hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="font-semibold">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
