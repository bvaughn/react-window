import { ImageResponse } from "@vercel/og";

export default {
  fetch(request: Request) {
    return new ImageResponse(<div>Testing</div>, {});
  }
};
