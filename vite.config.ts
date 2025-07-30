import fs from 'fs';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const faviconBase64 = fs.readFileSync('./src/assets/favicon.png').toString('base64');

export default defineConfig({
  plugins: [tailwindcss(), solidPlugin(), viteSingleFile(), {
    name: "inline-favicon",
    apply: "build",
    transformIndexHtml(html) {
      const faviconTag = `<link rel="icon" href="data:image/png;base64,${faviconBase64}" />`;
      return html.replace(/(<\/head>)/, `${faviconTag}\n$1`);
    },
  },
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
