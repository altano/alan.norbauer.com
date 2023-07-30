import Bio from "@/components/bio";
import ArticleWrapper from "@/components/articles/articleWrapper.client";
import SiteFooter from "@/components/siteFooter";
import { styled } from "@styled-system/jsx";

const PageFooter = styled("footer", {
  base: {
    gridArea: "footer",
    fontSize: "16px",
    marginBlockStart: "1rem",
    padding: "1rem",
    gap: "5",
    transitionDuration: "var(--durations-color-scheme)",
    transitionProperty: "background, color",
    background: "bg.footer",
    color: "text.footer",
    lg: {
      marginBlockStart: "2rem",
      padding: "4rem",
    },
  },
});

const Layout = styled("main", {
  base: {
    // Variables
    "--gutter": "12px",

    // Misc
    display: "grid",
    width: "100%",
    minHeight: "100svh",

    // Grid
    gridColumnGap: 0,
    gridRowGap: "2rem",
    gridTemplateColumns: `
      var(--gutter)
      minmax(0, 1fr)
      var(--gutter)
    `,
    gridTemplateRows: `
      min-content
      min-content
      auto
      min-content
    `,
    gridTemplateAreas: `
      "...... title   ......"
      "...... header  ......"
      "...... article ......"
      "footer footer  footer"
    `,

    mdDown: {
      overflowWrap: "break-word",
    },
    lg: {
      // Variables
      "--article-width": `
        min(
          var(--breakpoints-md),
          calc(100vw - var(--article-sidebar-width) - (3 * var(--article-column-gap)))
        )`,
      "--article-sidebar-width": "300px",
      "--article-column-gap": "1rem",

      // Misc
      marginInline: "0",

      // Grid
      gridColumnGap: "var(--article-column-gap)",
      gridTemplateColumns: `
        1.8fr
        var(--article-sidebar-width)
        var(--article-width)
        2fr`,
      gridTemplateRows: `
        min-content
        auto
        min-content
      `,
      gridTemplateAreas: `
        "...... ...... title   ......"
        "...... header article ......"
        "footer footer footer  footer"
      `,
    },
    xl: {
      "--article-sidebar-width": "350px",
      "--article-column-gap": "3rem",
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
