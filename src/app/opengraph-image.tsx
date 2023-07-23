import { host } from "@/components/homeLink";
import OpenGraphImage from "@/components/opengraph/image";
import pkg from "@root/package.json";

export default async function og() {
  return OpenGraphImage({
    title: pkg.description,
    subtitle: host,
  });
}
