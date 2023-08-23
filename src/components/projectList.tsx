import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";
import Image from "next/image";
import Link from "next/link";
import { Cards, Card } from "@/components/cards";
import htmlCdnifyLogo from "assets/images/projects/html_cdnify_logo.png";
import bookcisionLogo from "assets/images/projects/bookcision_logo.png";
import handlebarsLogo from "assets/images/projects/handlebars_logo.png";
import firefoxLogo from "assets/images/browser-logos/firefox.svg";
import alanglowMetadata from "@/app/projects/alanglow/metadata.json";
import { ListHeading } from "@/components/listHeading";
import { Description } from "@/components/description";

const projectLinkStyle = css({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
});

const ProjectIcon = styled("span", {
  base: {
    filter: "grayscale(1)",
    flexBasis: "50px",
    flexShrink: "0",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    marginRight: "5",
    "& img": {
      height: "100%",
    },
  },
});

function Project({
  href,
  title,
  tagline,
  image,
}: {
  href: React.ComponentProps<typeof Link>["href"];
  title: string;
  tagline: string;
  image: React.ReactNode;
}) {
  return (
    <Link href={href} className={projectLinkStyle}>
      <ProjectIcon>{image != null ? image : null}</ProjectIcon>
      <styled.span
        flexGrow="1"
        flexBasis="min-content"
        display="flex"
        flexDir="column"
      >
        <ListHeading>{title}</ListHeading>
        <Description>{tagline}</Description>
      </styled.span>
    </Link>
  );
}

export default async function ProjectList() {
  return (
    <Cards>
      <Card key="bookcision">
        <Project
          image={
            <Image
              width={50}
              height={50}
              src={bookcisionLogo}
              alt="Bookcision logo"
            />
          }
          href="https://norbauer.com/bookcision"
          title="Bookcision"
          tagline="Kindle notes/highlights exporter"
        />
      </Card>
      <Card key="html-cdnify">
        <Project
          image={
            <Image
              height={50}
              src={htmlCdnifyLogo}
              alt="logo for html-cdnify package"
            />
          }
          href="https://www.npmjs.com/package/html-cdnify"
          title="html-cdnify"
          tagline="Transform relative URLs in HTML markup"
        />
      </Card>
      <Card key="handlebars-loader">
        <Project
          image={
            <Image
              width={50}
              height={50}
              src={handlebarsLogo}
              alt="logo for handlebars-loader package"
              className={css({
                padding: "5px",
                background: "#868686",
                borderRadius: "7px",
              })}
            />
          }
          href="https://www.npmjs.com/package/handlebars-loader"
          title="handlebars-loader"
          tagline="A handlebars template loader for webpack"
        />
      </Card>
      <Card key="alanglow-firefox-theme">
        <Project
          image={
            <Image
              src={firefoxLogo}
              width={50}
              height={50}
              alt="firefox logo"
            />
          }
          href="/projects/alanglow"
          title="Alanglow"
          tagline={alanglowMetadata.description}
        />
      </Card>
    </Cards>
  );
}
