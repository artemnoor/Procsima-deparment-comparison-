"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ShellLink = {
  href: string;
  label: string;
};

type ShellProps = {
  title: string;
  subtitle: string;
  links: ShellLink[];
  children: ReactNode;
};

function isActiveLink(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (pathname === href) {
    return true;
  }

  return pathname.startsWith(`${href}/`);
}

export function Shell(props: ShellProps) {
  const pathname = usePathname();
  const primaryLinks = props.links.slice(0, 5);
  const utilityLinks = props.links.slice(5);

  return (
    <div className="shell">
      <header className="shellHeader">
        <div className="shellHeaderInner">
          <Link aria-label="На главную" className="shellBrand" href="/">
            <div className="shellBrandLogo" aria-hidden="true">
              <svg
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="shellBrandText">
              <span className="shellBrandTitle">{props.title}</span>
              <span className="shellBrandSubtitle">{props.subtitle}</span>
            </div>
          </Link>

          <nav aria-label="Primary navigation">
            <ul className="navList">
              {primaryLinks.map((link) => {
                const active = isActiveLink(pathname, link.href);

                return (
                  <li key={link.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className="navLink"
                      data-active={active ? "true" : "false"}
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shellActions">
            {utilityLinks.map((link) => (
              <Link className="shellActionLink" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
      {props.children}
    </div>
  );
}
