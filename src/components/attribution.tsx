import Link from "next/link";
import React from "react";

export function Attribution() {
  const year = new Date().getFullYear();
  const copyright = `© ${year}`;
  const nextLink = <Link href="https://nextjs.org/">Next.js</Link>;
  const fontLinks = (
    <>
      <Link href="https://rsms.me/inter/">Andersson</Link> and{" "}
      <Link href="https://www.ibm.com/plex/">Abbink</Link>
    </>
  );
  return (
    <span>
      {copyright} &bull; built with {nextLink} &bull; fonts by {fontLinks}
    </span>
  );
}
