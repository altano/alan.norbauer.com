import Bio from "@/components/bio";
import ArticleWrapper from "@/components/articles/articleWrapper.client";
import SiteFooter from "@/components/siteFooter";
import { styled } from "@styled-system/jsx";

const PageFooter = styled("footer", {
  base: {
    gridArea: "footer",
    fontSize: "16px",
    marginBlockStart: "3rem",
    padding: "1rem",
    gap: "5",
    transitionDuration: "var(--durations-color-scheme)",
    transitionProperty: "background, color",
    background: "bg.footer",
    color: "text.footer",
    lg: {
      marginBlockStart: "4rem",
      padding: "4rem",
    },
  },
});

const Layout = styled("main", {
  base: {
    display: "grid",
    "--article-min-gutter": "0.75rem",
    gridTemplateColumns:
      "var(--article-min-gutter) minmax(calc(320px - 2*(var(--article-min-gutter))), 100%) var(--article-min-gutter) ",
    gridTemplateRows: "min-content min-content auto min-content",
    gridTemplateAreas: `
      "...... title   ......"
      "...... header  ......"
      "...... article ......"
      "footer footer  footer"
    `,

    marginInline: 0,
    minHeight: "100vh",

    lg: {
      "--article-width":
        "min(var(--breakpoints-md), calc(100vw - var(--article-column-gap) - var(--article-sidebar-width) - var(--article-column-gap) - var(--article-column-gap)))",
      "--article-sidebar-width": "300px",
      "--article-column-gap": "3rem",
      gridGap: "2rem var(--article-column-gap)",
      gridTemplateColumns:
        "1.8fr var(--article-sidebar-width) var(--article-width) 2fr",
      gridTemplateRows: "min-content auto min-content",
      gridTemplateAreas: `
      "...... ...... title   ......"
      "...... header article ......"
      "footer footer footer  footer"
      `,
    },
    xl: {
      "--article-sidebar-width": "350px",
      "--article-column-gap": "4rem",
    },
  },
});

const PageFooterContent = styled("div", {
  base: {
    margin: "auto",
    maxWidth: "breakpoint-xl",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ArticleWrapper>
      <Layout>
        {children}
        <PageFooter>
          <PageFooterContent>
            <Bio width="wide" />
            <SiteFooter location="embedded" />
          </PageFooterContent>
        </PageFooter>
      </Layout>
    </ArticleWrapper>
  );
}
