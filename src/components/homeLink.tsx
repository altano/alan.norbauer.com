import pkg from "@root/package.json";
import Link from "next/link";

export const host = new URL(pkg.homepage).host;

export default function HomeLink() {
  return (
    <Link href={process.env.NODE_ENV === "development" ? "/" : pkg.homepage}>
      {host}
    </Link>
  );
}
