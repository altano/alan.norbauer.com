"use client";

import React from "react";
import { TocVisibleSectionObserver } from "@altano/use-toc-visible-sections";

export default function ArticleWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TocVisibleSectionObserver>{children}</TocVisibleSectionObserver>;
}
