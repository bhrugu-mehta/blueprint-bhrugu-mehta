import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import { projects } from './src/content.js';

// One page per project, generated from content.js. These stub files are rebuilt on
// every dev/build start, so adding a project to content.js is all it takes.
const projectDir = path.resolve('projects');
fs.mkdirSync(projectDir, { recursive: true });
for (const f of fs.readdirSync(projectDir)) {
  if (!projects.some((p) => `${p.slug}.html` === f)) fs.unlinkSync(path.join(projectDir, f));
}
for (const p of projects) {
  const stub = `<!doctype html>\n<!-- Generated from src/content.js. Do not edit. -->\n<html lang="en">\n<head><!--render:head:${p.slug}-->
<link rel="stylesheet" href="/src/styles.css">
</head>\n<body><!--render:body:${p.slug}-->\n<script type="module" src="/src/main.js"></script>\n</body>\n</html>\n`;
  const file = path.join(projectDir, `${p.slug}.html`);
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== stub) fs.writeFileSync(file, stub);
}

function renderPages() {
  let server;
  const load = () => (server ? server.ssrLoadModule('/src/render.js') : import('./src/render.js'));
  return {
    name: 'render-pages',
    configureServer(s) { server = s; },
    transformIndexHtml: { order: "post", async handler(html) {
      const r = await load();
      return html.replace(/<!--render:(head|body):([\w-]+)-->/g, (_, part, key) => {
        const page = key === 'home' ? r.renderHome() : r.renderProject(key);
        return page[part];
      });
    } },
    handleHotUpdate({ file, server: s }) {
      if (/src[\\/](content|render)\.js$|images\.json$/.test(file)) s.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig({
  base: './', // relative, so the site works at username.github.io or username.github.io/repo
  plugins: [renderPages()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve('index.html'),
        ...Object.fromEntries(projects.map((p) => [p.slug, path.resolve(`projects/${p.slug}.html`)])),
      },
    },
  },
});
