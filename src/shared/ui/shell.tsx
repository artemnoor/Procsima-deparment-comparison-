import Link from "next/link";
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

export function Shell(props: ShellProps) {
  return (
    <div className="shell">
      <header className="shellHeader">
        <div className="shellHeaderInner">
          <div>
            <h1 className="shellTitle">{props.title}</h1>
            <p className="shellSubtitle">{props.subtitle}</p>
          </div>
          <nav aria-label="Primary navigation">
            <ul className="navList">
              {props.links.map((link) => (
                <li key={link.href}>
                  <Link className="navLink" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      {props.children}
    </div>
  );
}
