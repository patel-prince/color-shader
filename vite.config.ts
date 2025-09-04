import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-react-compiler",
            {
              target: "19",
              // Enable for development to see optimization hints
              sources: (filename: string) => {
                return filename.includes("src/components");
              },
            },
          ],
        ],
      },
    }),
  ],
});
