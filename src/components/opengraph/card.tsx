export type OpenGraphCardProps = {
  title: string;
  subtitle?: string;
};

function getTitleFontSize(length: number): number {
  if (length < 25) {
    return 150;
  } else if (length < 50) {
    return 142;
  } else if (length < 75) {
    return 112;
  } else if (length < 100) {
    return 82;
  } else {
    return 72;
  }
}

export default function OpenGraphCard({ title, subtitle }: OpenGraphCardProps) {
  return (
    <main
      style={{
        background: "white",
        color: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          lineHeight: 1,
          flexGrow: 1,
          width: "100%",
          fontSize: getTitleFontSize(title.length),
          padding: "2rem",
          boxSizing: "border-box",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <footer
          style={{
            background: "#eeeeee",
            color: "#444444",
            width: "100%",
            flexShrink: 0,
            fontSize: 60,
            padding: "2rem",
            boxSizing: "border-box",
            margin: 0,
          }}
        >
          {subtitle}
        </footer>
      )}
    </main>
  );
}
