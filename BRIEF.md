# Portfolio Site Brief: Bhrugu Mehta

## Goal and audience
A personal portfolio for mechanical engineering internship recruiters (summer 2027 cycle).
A recruiter should understand who I am and what I've built within 30 seconds, then be
able to dig into any project. It should feel like an engineer's site: precise,
technical, and confident, not a generic template.

## Design direction
- Vibe: not decided yet. Propose 2–3 distinct directions (for example: dark and
  technical like a CAD workspace, clean like an engineering spec sheet, or editorial
  with large type), each with a Playwright screenshot of a hero mockup, and let me pick.
- Use the emil-design-eng, taste, and impeccable skills for all design and motion decisions
- Motion should feel purposeful and restrained; respect prefers-reduced-motion
- The 3D models and real build photos are the stars; the design should frame them, not compete

## Source material
These files are in the project folder and are the source of truth for all content:
- `source/Bhrugu_Mehta_Resume.pdf`
- `source/Bhrugu_Mehta_Engineering_Portfolio.pdf` (2 pages: F1 car and go-kart, with photos)

Do not try to scrape LinkedIn (it blocks automated access). Everything needed is below
and in those PDFs. If a photo I need isn't in `images/`, extract it from the portfolio
PDF and tell me which ones, so I can replace them with higher-resolution originals later.

## Content

### Intro / hero
- Name: Bhrugu Mehta
- Title: Mechanical Engineering @ Texas A&M University, Class of 2030
- One-line hook: "Designing, simulating, and building vehicles that go fast, from CAD
  and CFD to the shop floor."
- Photo: images/headshot.jpg (I don't have one yet; leave a tasteful slot or design
  the hero to work without it)
- Links:
  - LinkedIn: https://www.linkedin.com/in/bhrugu-mehta
  - Email: bhrugu@tamu.edu (primary), Bhrugu2008@outlook.com (secondary)
  - Resume: resume.pdf (download button)
- Privacy: do NOT put my phone number or home address anywhere on the site. The
  resume.pdf on the site must be a version without the street address.

### Education
- Texas A&M University, College of Engineering, Class of 2030
- GPA: 4.0
- Relevant coursework: ENGR 102

### Experience

**Aerodynamics Engineer (Apprentice): Texas A&M Formula SAE Electric**, Sep 2026–present
- Contributing to the aerodynamic design of a competition electric race car, focusing on
  downforce, drag reduction, and airflow management
- Running CFD simulations in Star-CCM+ to determine optimal radiator placement and its
  effect on the overall aero package
- Modeling and iterating on concepts in SolidWorks, balancing performance with manufacturability
- Performing composite and carbon fiber layups
- Collaborating with structures, suspension, and powertrain subteams to integrate aero and
  cooling components into the full vehicle

**Structures & Manufacturing Engineer: Texas A&M Design Build Fly (AIAA)**, Aug 2026–present
- Collegiate competition to design and build a fixed-wing RC aircraft from the ground up
  to complete mission-specific flight tasks
- Contributing to airfoil selection, structural load testing, and full SolidWorks assembly
  modeling, including internal wing and fuselage structure
- Fabricating the airframe from laser-cut balsa and birch, finished with heat-shrink vinyl
  covering and fiberglass composite layups

**Founder & Team Principal: Aventus Racing (F1 in Schools / STEM Racing)**, Tesla STEM High School, 11th–12th grade
- Founded and led the team; oversaw design, manufacturing, and logistics
- 1st at State, 1st on the West Coast, 9th in the USA at the STEM Racing National Championship
- Nationals are judged on car design, manufacturing quality, pit display, verbal
  presentation, and race performance

### Projects (each gets a card plus a detail view)
For each: title, one-line summary, my role, key specs/decisions, results, photos,
and an interactive 3D model if available. Order them as listed.

**1. Aventus Racing F1 in Schools Car** (images/aventus/, 3D model: coming later)
- Summary: Designed, tested, and manufactured two identical miniature race cars to a strict
  rule set, minimizing race time
- Design: modeled in Fusion 360; CFD in Ansys Fluent and Ansys Discovery to find and fix
  regions of turbulent flow; FEA in Fusion for strength analysis
- Manufacturing: main body CNC-machined on a Tormach XS Tech router from a lightweight
  polyurethane compound; wheels, suspension, and wings 3D printed on a Bambu Lab X1C;
  additional parts in ASA-CF for its high strength-to-weight ratio, allowing less material
- Testing: built a miniature wind tunnel to visualize flow defects, and an at-home track to
  test durability and race time
- Results: 63% drag reduction from first to final design; 2nd fastest overall race time at
  regionals; 1st at State; 1st on the West Coast; 9th in the USA
- Photos: CAD renders, CFD plots, CNC toolpaths, print plate, and finished car (from the
  portfolio PDF, page 1)

**2. FSAE EV Brake Pedal Assembly: AME27 Apprentice Mechanical Design Challenge** (models/brake-pedal.glb)
- Summary: Designed a complete brake pedal assembly for a Formula SAE electric vehicle as
  part of the FSAE apprentice design challenge
- Architecture: dual Tilton 78-series master cylinders on independent hydraulic circuits,
  linked by a Tilton 72-250 balance bar
- Pedal arm: 6061-T6 aluminum bell-crank ("boomerang") layout with pivot, clevis, and pad on
  the same side; clevis 45 mm above the pivot and pad 180 mm from the pivot for a 4:1 pedal
  ratio; 12 mm thick tapered cross-section, deepest at the clevis, for added safety margin
- Hardware: McMaster-Carr shoulder screws, swivel joint, nylon-insert locknuts, and a
  panel-mount push-button switch; base plate with mounting legs carrying the pivot and
  master cylinders
- Process: free-body diagrams and hand calcs first, then full SolidWorks assembly
- Results: [ASK ME: FEA results / safety factor / outcome of the challenge]
- 3D model: source file is `models/AME27_Pedal_Assembly.glb` (17 MB, 24 meshes). Compress
  it to under 3 MB, save as `models/brake-pedal.glb`, and if possible let viewers click a
  part (master cylinder, balance bar, pedal arm) to highlight and label it

**3. Wood Go-Kart: Passion Project** (images/gokart/)
- Summary: Got hooked on motorsports and, instead of buying a go-kart, built one from the
  ground up to understand the mechanics
- Design: sketched concepts, sourced parts, and made a CAD model first; chose a wood frame
  for simplicity; Predator 212cc engine with a torque converter, chain-and-sprocket drive to
  the rear axle; front axle bolted to wooden extensions for a greater steering range
- Construction: built the frame, assembled the rear axle, sprocket, brakes, and bearings,
  bolted the rear assembly to the frame, and mounted steering, seat, and engine on planks
  with wood glue and screws
- Brake and throttle: master cylinder linked to the left pedal with braided steel cable run
  through screw eyes; 5 kg return spring on the throttle cable and 6 kg spring on the pedal
- Safety: backup handbrake in case of brake failure; emergency throttle release in case of
  engine malfunction
- Results: 24 mph top speed, 175 lb, 12 hp
- What I learned: how subsystems like drivetrain and steering work together, and that I
  could take a project from pieces of wood to something that actually drives
- Photos: portfolio PDF, page 2

**4. NACA 4416 Wing Ribs** (3D model: coming later)
- Summary: SolidWorks rib design from a spec sheet
- Root rib: 12 in chord, 3° incidence. Tip rib: 9 in chord, 0.5° incidence
- [ASK ME before including: context and whether to merge this into the DBF experience entry]

### Skills
- CAD: SolidWorks, Fusion 360 (CAD experience 9+ years)
- Simulation: CFD (3+ years) in Ansys Fluent, Ansys Discovery, and Star-CCM+; FEA in Fusion 360
- Manufacturing: CNC routing (Tormach), 3D printing (Bambu Lab X1C, ASA-CF), laser cutting,
  carbon fiber and fiberglass composite layups, wood and metal fabrication
- Visualization: 3D rendering and animation (2+ years)
- Testing: wind tunnel flow visualization, structural load testing

## 3D viewer requirements
- Orbit, zoom, and pan with mouse and touch; gentle auto-rotate until the user interacts
- A "reset view" button and a clear loading state with progress
- Lazy-load models only when scrolled into view so the page stays fast
- Compress all GLBs (Draco or meshopt via gltf-transform) and convert any STLs in /models to GLB
- Good default lighting (environment map plus key light) so CAD models look sharp, not flat gray
- Projects without a model yet should look complete with photos alone, so I can add models later
  by dropping a GLB into /models and adding one line of config

## Technical
- Stack: Vite with plain HTML/CSS/JS and three.js. Use your judgment if something else is
  clearly better, but explain why first
- Content (projects, experience, skills) should live in one data file (e.g. `content.js` or
  JSON) so I can update it without touching layout code
- Fully responsive; looks great on a phone, since recruiters often check on mobile
- Fast: aim for a Lighthouse performance score above 90; optimize all images (WebP/AVIF, sized)
- Proper page title, meta description, and an Open Graph image so links look good on LinkedIn
- Deploy to GitHub Pages via GitHub Actions; include step-by-step deploy instructions for me

## Process
1. Before writing code, read both PDFs in `source/`, then ask me about anything marked
   [ASK ME] or anything that's missing or contradictory.
2. Propose the design direction and page structure; wait for my approval.
3. Build section by section. After each one, use Playwright to screenshot it at
   375px (mobile) and 1440px (desktop), review the screenshots critically, and fix
   issues before moving on.
4. At the end, do a full-page Playwright pass, check every 3D model loads, and give
   me a list of anything still needing my input.
