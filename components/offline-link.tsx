"use client";

import type { ReactNode } from "react";

type OfflineLinkProps = {
  href: string;
  offlineHref: string;
  className?: string;
  children: ReactNode;
};

export default function OfflineLink({ href, offlineHref, className, children }: OfflineLinkProps) {
  return (
    <a
      className={className}
      href={href}
      onClick={(event) => {
        if (window.location.protocol === "file:") {
          event.preventDefault();
          window.location.href = offlineHref;
        }
      }}
    >
      {children}
    </a>
  );
}