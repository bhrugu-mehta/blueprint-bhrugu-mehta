# Bhrugu Mehta: portfolio

A static site built with Vite, plain HTML/CSS/JS and three.js. Every page is generated
from **one file, `src/content.js`**, at build time, so it is fast and works without JavaScript.

## Run it locally

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173). The page reloads when you save
`src/content.js`.

## Change the content

Everything (projects, experience, skills, education, links) is in `src/content.js`.
Edit the text there; you never need to touch the layout code.

- **Photos:** put the file anywhere under `images/` and reference it from `content.js`, e.g.
  `{ image: 'aventus/finished-car.jpg', alt: 'What the photo shows', caption: 'Short caption' }`.
  It is converted to AVIF and WebP at three sizes automatically. To swap in a higher-resolution
  original, give it the same path and file name (or update the path in `content.js`).
- **Headshot:** add `images/headshot.jpg` and set `headshot: 'headshot.jpg'` in `site`.
- **A new project:** copy one of the objects in `allProjects` and change it, then add its slug to
  `projectOrder` (the first project gets the large card). Its page (`projects/<slug>.html`) is created
  automatically.
- **Home page readouts:** the three numbers under the hero buttons are `site.facts`.

## Add a 3D model

1. Export a `.glb` (or `.stl`) from SolidWorks or Fusion 360 and drop it into `models/`.
2. Add one line to the project in `content.js`:

   ```js
   model: 'models/wing-ribs.glb',
   ```

That's it. Files over 3 MB are compressed with Draco automatically and STLs are converted to GLB.
To let visitors click a part and see its name, add a `parts` list (see the brake pedal entry):
`match` is a pattern for the part's name in the CAD file.

## Regenerate the hero drawing

The hero's blueprint linework and the lifted shaded model are rendered from `models/brake-pedal.glb`.
If the model changes, run `npm run dev`, then in a second terminal:

```bash
npm i -D playwright
npx playwright install chromium
node scripts/hero-render.mjs
```

## Update the resume

The hosted resume has the phone number and street addresses removed. When your resume changes,
replace `source/Bhrugu_Mehta_Resume.pdf` and run:

```bash
npm run resume
```

It writes `public/resume.pdf` and refuses to finish if any phone or address text is left.
(Better still: export a version without those lines from the original document and save it
as `public/resume.pdf` directly.) `source/` is git-ignored so the originals never go public.

## Deploy to GitHub Pages

The site deploys automatically with GitHub Actions (`.github/workflows/deploy.yml`) every time
you push to `main`.

1. **Create the repository.** On github.com, click **New repository**. Name it `portfolio`
   (the site will be at `https://<username>.github.io/portfolio/`), or name it
   `<username>.github.io` for the site to be at `https://<username>.github.io/`. Leave it empty.
2. **Push this folder.** In a terminal in this folder:

   ```bash
   git init -b main
   git add .
   git commit -m "Portfolio site"
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

3. **Turn on Pages.** In the repository go to **Settings → Pages**, and under
   **Build and deployment → Source** choose **GitHub Actions**.
4. **Watch it build.** Open the **Actions** tab. The first run takes a few minutes (it converts
   the photos); later runs reuse that work. When it turns green, the site is live at the address
   shown on the run and on the Pages settings screen.
5. **Set the live URL.** Put that address in `site.url` in `src/content.js` (e.g.
   `'https://username.github.io/portfolio/'`), commit and push. This makes LinkedIn link previews
   use the full image URL.

To check a link preview, paste your URL into
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

## Project layout

```
src/content.js        all text and image/model references  ← edit this
src/render.js         turns content into HTML at build time
src/styles.css        the design (blueprint look, animations)
src/viewer.js         three.js model viewer
src/main.js           scroll entrances, lazy-loads the viewer
scripts/              image/model pipeline, resume redaction, OG image template,
                      hero-render.html/.mjs (renders the hero linework from the CAD model)
public/fonts/         Archivo and IBM Plex Mono (SIL Open Font License)
images/  models/      your source photos and CAD exports
public/               files copied as-is (resume.pdf, og.png, favicon, Draco decoder)
```
