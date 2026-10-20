# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Vite + plain HTML/CSS/JS + three.js (specified in BRIEF.md). Content lives in one data file (`src/content.js`). Deployed to GitHub Pages via GitHub Actions; relative base path so it works at a user or project Pages URL.

## Users
Mechanical engineering internship recruiters and engineering team leads hiring for the summer 2027 cycle. They skim many candidates, often on a phone; they decide in about 30 seconds whether to dig deeper, then open individual projects.

## Product Purpose
The personal portfolio of Bhrugu Mehta, a Texas A&M mechanical engineering student (Class of 2030). Success: a recruiter knows who he is and what he has built within 30 seconds, can inspect any project in depth (3D models, build photos, specs), and downloads the resume or makes contact.

## Positioning
A freshman whose work is already physical and rule-driven: a team he founded placed 9th nationally in STEM Racing; an FSAE brake pedal designed to rule T.3.2.2 with a 2.13 FOS at 2 kN; a go-kart built from scratch. The site shows the engineering itself (real CAD, real FEA/CFD, real shop photos), not adjectives.

## Operating Context
Recruiters open it from LinkedIn or a resume link, frequently on mobile. Content they look for: education/GPA, experience on FSAE Electric and Design Build Fly, projects with role, specs, decisions and results, skills, resume PDF, email.

## Capabilities and Constraints
- Interactive 3D viewer (orbit/zoom/pan, auto-rotate, reset, lazy load, click a part to label it) for GLBs in /models.
- Projects without a model must look complete with photos alone; adding a model is one config line.
- Lighthouse performance > 90; responsive; respects prefers-reduced-motion.
- Privacy: no phone number or street address anywhere, including the hosted resume.

## Brand Commitments
Name: Bhrugu Mehta. Hook: "Designing, simulating, and building vehicles that go fast, from CAD and CFD to the shop floor." Feel: an engineer's site, precise, technical, confident; not a template. The 3D models and build photos are the stars; the design frames them.

## Evidence on Hand
- Resume, portfolio PDF and brake pedal design report in `source/`.
- Photos: `images/gokart/` (originals), `images/aventus/` and `images/pedal/` (extracted from PDFs, low resolution for Aventus).
- Model: `models/brake-pedal.glb`.
- No headshot yet. No testimonials, press, or challenge outcome for the brake pedal; do not invent them.

## Product Principles
1. Evidence over adjectives: every claim shows a number, a render, or a photo.
2. The work leads; the interface recedes.
3. Thirty-second scan first, depth on demand.
4. Mobile is a first-class reader.

## Accessibility & Inclusion
WCAG AA contrast, keyboard access to the 3D viewer controls, reduced-motion support, alt text on all images.
