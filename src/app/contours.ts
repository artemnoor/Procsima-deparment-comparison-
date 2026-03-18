export type ContourLink = {
  href: string;
  label: string;
};

export type ContourDefinition = {
  title: string;
  subtitle: string;
  links: ContourLink[];
};

export const publicContour: ContourDefinition = {
  title: "NPS Choice Platform",
  subtitle: "Public contour for applicants",
  links: [
    { href: "/", label: "Home" },
    { href: "/directions", label: "Directions" },
    { href: "/profile-test", label: "Profile test" },
    { href: "/compare", label: "Compare" },
    { href: "/admin", label: "Admin contour" },
    { href: "/api/health", label: "Health" },
    { href: "/api/ready", label: "Readiness" },
  ],
};

export const internalContour: ContourDefinition = {
  title: "NPS Choice Platform Admin",
  subtitle: "Internal contour for admissions staff",
  links: [
    { href: "/admin", label: "Admin home" },
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/promotions", label: "Promotions" },
    { href: "/directions", label: "Public catalog" },
    { href: "/api/health", label: "Health" },
  ],
};
