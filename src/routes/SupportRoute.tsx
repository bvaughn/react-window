import { Box, ExternalLink, Header } from "react-lib-tools";

export default function SupportRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header title="Support" />
      <div>
        <ExternalLink href="https://github.com/bvaughn/react-window">
          GitHub
        </ExternalLink>{" "}
        is the easiest place to look for help, but it's probably not the
        fastest. This project is maintained by a single developer so there is
        limited bandwidth for answering questions.
      </div>
      <div>
        I recommend asking questions on{" "}
        <ExternalLink href="https://stackoverflow.com/questions/tagged/react-window">
          Stack Overflow
        </ExternalLink>{" "}
        or{" "}
        <ExternalLink href="https://reddit.com/r/reactjs">Reddit</ExternalLink>{" "}
        to start with. Both sites have active communities who often respond
        quickly. If you don't find an answer there you can try opening a GitHub
        issue- but please take a moment first to see if your question has{" "}
        <ExternalLink href="https://github.com/bvaughn/react-window/issues?q=is%3Aissue%20state%3Aclosed">
          has already been answered
        </ExternalLink>{" "}
        before opening a new one.
      </div>
    </Box>
  );
}
