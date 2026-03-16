import type { ReactNode } from "react";

import { internalContour } from "@/app/contours";
import { Shell } from "@/shared/ui/shell";

export default function AdminLayout(props: { children: ReactNode }) {
  return (
    <Shell
      title={internalContour.title}
      subtitle={internalContour.subtitle}
      links={internalContour.links}
    >
      {props.children}
    </Shell>
  );
}
