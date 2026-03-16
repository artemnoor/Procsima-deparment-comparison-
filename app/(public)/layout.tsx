import type { ReactNode } from "react";

import { publicContour } from "@/app/contours";
import { Shell } from "@/shared/ui/shell";

export default function PublicLayout(props: { children: ReactNode }) {
  return (
    <Shell
      title={publicContour.title}
      subtitle={publicContour.subtitle}
      links={publicContour.links}
    >
      {props.children}
    </Shell>
  );
}
