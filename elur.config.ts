import { defineConfig } from "@elurjs/kit";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  router: {
    enabled: true,
    prefetch: true,
    loadingIndicator: true,
    speculation: "prefetch",
  },
});
