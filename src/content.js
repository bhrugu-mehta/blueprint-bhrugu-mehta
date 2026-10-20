// ─────────────────────────────────────────────────────────────────────────────
// All site content lives here. Edit this file; layout code never needs to change.
//
// Images: paths are relative to /images. They are converted to AVIF/WebP at
// several widths automatically when you run `npm run dev` or `npm run build`.
//
// 3D models: drop a .glb (or .stl) into /models and add one line to a project:
//     model: 'models/your-file.glb',
// Large files are compressed automatically. Optional `parts` lets visitors click
// a part to label it (match = part name in the CAD file).
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'Bhrugu Mehta',
  short: 'B. Mehta',
  title: 'Mechanical Engineering, Texas A&M University, Class of 2030',
  hook: 'Designing, simulating, and building vehicles that go fast, from CAD and CFD to the shop floor.',
  description:
    'Bhrugu Mehta, mechanical engineering student at Texas A&M (Class of 2030): aerodynamics on Texas A&M Formula SAE Electric, structures and manufacturing on Design Build Fly, an FSAE brake pedal assembly and a scratch-built go-kart.',
  url: 'https://bhrugu-mehta.github.io/blueprint-bhrugu-mehta/', // live URL, used for absolute Open Graph links
  email: 'bhrugu@tamu.edu',
  emailSecondary: 'Bhrugu2008@outlook.com',
  linkedin: 'https://www.linkedin.com/in/bhrugu-mehta',
  resume: 'resume.pdf',
  revised: 'October 2026',
  headshot: null, // e.g. 'headshot.jpg' once you have one
  // Hero drawing, rendered from the CAD model by scripts/hero-render.html.
  heroArt: { lines: 'pedal/hero-lines.png', solid: 'pedal/hero-solid.png' },
  heroFigure: { image: 'pedal/hero-render.png', alt: 'Render of the FSAE EV brake pedal assembly: aluminum pedal arm, twin Tilton master cylinders and balance bar on a milled base plate', caption: 'FSAE EV brake pedal assembly, SolidWorks', project: 'brake-pedal' },
  // The three readouts under the hero buttons: value large, label small.
  facts: [
    { label: 'GPA, Texas A&M', value: '4.0' },
    { label: 'Aero, Formula SAE Electric', value: 'FSAE' },
    { label: 'Structures, Design Build Fly', value: 'DBF' },
  ],
};

const allProjects = [
  {
    slug: 'aventus-racing',
    title: 'Aventus Racing F1 in Schools car',
    short: 'Aventus Racing F1 car',
    summary:
      'Designed, tested, and manufactured two identical miniature race cars to a strict rule set, minimizing race time.',
    role: 'Founder and team principal; led design, manufacturing and logistics',
    dates: 'Nov 2025 – Jan 2026',
    context: 'F1 in Schools / STEM Racing, Tesla STEM High School',
    tools: ['Fusion 360', 'Ansys Fluent', 'Ansys Discovery', 'Fusion FEA', 'Tormach XS Tech', 'Bambu Lab X1C'],
    headline: { value: '−63%', label: 'drag, first design to final' },
    showResultOnHome: false, // keep the home page focused on Texas A&M work
    cover: { image: 'aventus/finished-car.png', alt: 'The finished Aventus Racing car: white CNC-machined body, blue 3D-printed wheels and black wings' },
    model: null, // coming later: model: 'models/aventus-car.glb',
    sections: [
      {
        heading: 'Design',
        body: [
          'Modeled the car in Fusion 360 within the competition regulations.',
          'Ran CFD in Ansys Fluent and Ansys Discovery to find regions of turbulent flow, then reshaped the body and wings to remove them.',
          'Used FEA in Fusion 360 to check the strength of the thin wing and suspension parts.',
        ],
        figures: [
          { image: 'aventus/cad-render.png', alt: 'Fusion 360 render of the car with blue body, orange wings and black wheels', caption: 'CAD model, Fusion 360' },
          { image: 'aventus/cad-drawing.png', alt: 'Dimensioned top-view sketch of the car body in Fusion 360', caption: 'Dimensioned body sketch' },
          { image: 'aventus/cfd-pressure.png', alt: 'CFD result showing the nose region of the car in blue', caption: 'CFD, Ansys Discovery' },
          { image: 'aventus/cfd-flow.png', alt: 'CFD streamlines wrapping around the car body', caption: 'Flow visualization, Ansys' },
        ],
      },
      {
        heading: 'Manufacturing',
        body: [
          'CNC-machined the main body on a Tormach XS Tech router from a lightweight polyurethane compound.',
          'Printed the wheels, suspension and wings on a Bambu Lab X1C, with extra parts in ASA-CF: its high strength-to-weight ratio let the parts use less material.',
        ],
        figures: [
          { image: 'aventus/cam-stock.png', alt: 'CAM setup with the car body positioned inside the stock block', caption: 'CAM setup in the stock block' },
          { image: 'aventus/cnc-toolpath.png', alt: 'CNC toolpaths covering the car body', caption: 'Roughing toolpaths, Tormach XS Tech' },
          { image: 'aventus/print-plate.png', alt: 'Bambu Studio print plate with orange wing and suspension parts', caption: 'Print plate, Bambu Lab X1C' },
        ],
      },
      {
        heading: 'Testing',
        body: [
          'Built a miniature wind tunnel to see flow defects on the physical car.',
          'Built an at-home track to test durability and race time before competition.',
        ],
        figures: [
          { image: 'aventus/wind-tunnel.png', alt: 'The car inside the home-built wind tunnel', caption: 'Home-built wind tunnel' },
          { image: 'aventus/car-on-scale.png', alt: 'The finished car on a digital scale reading 49.8 grams', caption: 'Weigh-in: 49.8 g' },
        ],
      },
    ],
    results: [
      { label: 'Drag, first design to final', value: '−63%' },
      { label: 'Regionals race time', value: '2nd fastest' },
      { label: 'State', value: '1st' },
      { label: 'West Coast', value: '1st' },
      { label: 'National Championship', value: '9th in USA' },
    ],
    note: 'Nationals score car design, manufacturing quality, pit display, verbal presentation and race performance.',
  },
  {
    slug: 'brake-pedal',
    title: 'FSAE EV brake pedal assembly',
    short: 'FSAE brake pedal',
    summary:
      'A complete brake pedal assembly for a Formula SAE electric car, designed for the AME27 Apprentice Mechanical Design Challenge.',
    role: 'Sole designer: research, hand calculations, CAD and FEA',
    dates: 'Fall 2026',
    context: 'AME27 Apprentice Mechanical Design Challenge, Texas A&M Formula SAE Electric',
    tools: ['SolidWorks', 'SolidWorks Simulation', 'Hand calculations'],
    headline: { value: '2.13', label: 'factor of safety at 2 kN' },
    cover: { image: 'pedal/cover-solid.png', alt: 'Render of the brake pedal assembly: aluminum pedal arm, twin Tilton master cylinders and balance bar on a base plate' },
    model: 'models/brake-pedal.glb',
    parts: [
      { match: /^Arm\^/, label: 'Pedal arm', detail: '6061-T6 aluminum bell-crank; 12 mm tapered section, deepest at the clevis' },
      { match: /BALANCE BAR/, label: 'Balance bar', detail: 'Tilton 72-250 (600-Series), 3/8"-24 adjuster; sets front/rear brake bias' },
      { match: /Master Cylinder/, label: 'Master cylinder', detail: 'Tilton 78-700, one per independent hydraulic circuit' },
      { match: /8382K103/, label: 'Over-travel switch', detail: 'McMaster 8382K103 push/pull switch; latches in position, trips at 36° of travel' },
      { match: /^Part2\^/, label: 'Switch holder', detail: 'Adjustable sleeve and stand that positions the over-travel switch' },
      { match: /^Part1\^/, label: 'Base plate', detail: 'Designed to be milled from one aluminum block; arches carry the pivot and both master cylinders' },
      { match: /Shoulder Screw/i, label: 'Shoulder screws', detail: 'McMaster alloy steel; pivot pins for the pedal and master cylinders' },
      { match: /Swivel Joint/, label: 'Swivel joint', detail: 'McMaster 63195K67' },
      { match: /Locknut/, label: 'Locknuts', detail: 'McMaster 90630A121 nylon-insert' },
    ],
    sections: [
      {
        heading: 'Requirements and architecture',
        body: [
          'Rule T.3.2.2: the pedal must withstand 2,000 N at the pedal face without failure of the brake system, pedal box, chassis mounting or pedal adjustment.',
          'The rules require two master cylinders, so I chose Tilton 78-Series (78-700) units on independent front and rear circuits, linked by a Tilton 72-250 balance bar. They come with return springs built in, which kept the design simple and compact.',
          'After reading the rules I split the parts into what to buy (master cylinders, shoulder screws, bearing, locknuts) and what to design (pedal arm, base, switch holder).',
        ],
        figures: [
          { image: 'pedal/free-body-diagram.png', alt: 'Hand-drawn free body diagram of the brake pedal with the 2000 N pedal force, pushrod force and pivot reaction', caption: 'Free body diagram, by hand' },
        ],
      },
      {
        heading: 'Pedal geometry and hand calcs',
        body: [
          'Floor-mounted pivot with the balance-bar clevis and the pad on the same side of it, the common FSAE pedal-box layout.',
          'Clevis 45 mm above the pivot and pad 180 mm from it: a 4:1 pedal ratio, inside the typical FSAE range of 4:1 to 6:1. I kept the arm short to protect stiffness.',
          'The pivot is a pin and cannot react a moment, so the peak moment sits at the balance-bar bore. The 12 mm arm tapers to be deepest there.',
        ],
        figures: [],
        // Key numbers shown large beside the text when a section has no figures.
        callout: [
          { label: 'Pedal ratio', value: '180 / 45 = 4 : 1', note: 'Typical FSAE range is 4:1 to 6:1' },
          { label: 'Peak moment at the balance-bar bore', value: 'M ≈ 270 N·m', note: '2,000 N × (180 − 45) mm = 2,000 N × 0.135 m' },
        ],
      },
      {
        heading: 'CAD and FEA',
        body: [
          'Imported the bought parts into a SolidWorks assembly and placed them with mates before drawing the arm, so its geometry was set by real hardware.',
          'Ran a first FEA at 2 kN on the extruded profile, then added fillets for a lighter, easier-to-machine aluminum part and a tapered rectangular pad that spreads the load. The final study gives a factor of safety of 2.13.',
          'Designed the base to be milled from one aluminum block, with arches and shoulder screws so the pedal and both master cylinders can rotate.',
          'Found where over-travel occurs (36°) and designed an adjustable holder for the brake over-travel switch, a McMaster push/pull switch that stays latched once tripped, as the rules require.',
        ],
        figures: [
          { image: 'pedal/fea-final.png', alt: 'Von Mises stress plot of the pedal arm under a 2 kN load at the pad', caption: 'Final FEA, 2 kN at the pad: FOS 2.13' },
          { image: 'pedal/cad-side.png', alt: 'Side view of the pedal assembly in SolidWorks', caption: 'Assembly, side view' },
          { image: 'pedal/render-studio.png', alt: 'Studio render of the pedal assembly from the rear quarter', caption: 'Render, rear quarter' },
          { image: 'pedal/render-side.png', alt: 'Render of the pedal assembly from the side', caption: 'Render, side' },
        ],
      },
    ],
    results: [
      { label: 'Factor of safety at 2 kN', value: '2.13' },
      { label: 'Peak bending moment', value: '≈ 270 N·m' },
      { label: 'Pedal ratio', value: '4 : 1' },
      { label: 'Over-travel trip angle', value: '36°' },
    ],
    note: null,
  },
  {
    slug: 'wood-go-kart',
    title: 'Wood go-kart',
    short: 'Wood go-kart',
    summary:
      'I got hooked on motorsports and, instead of buying a go-kart, built one from the ground up to understand how it works.',
    role: 'Passion project: design, sourcing and build, solo',
    dates: 'Jan 2025 – Aug 2026',
    context: 'Personal project',
    tools: ['CAD', 'Predator 212cc', 'Wood and metal fabrication'],
    headline: { value: '24 mph', label: 'top speed' },
    cover: { image: 'gokart/IMG_0464.JPG', alt: 'The finished wood go-kart in a garage: timber frame, blue Predator engine, steering wheel and four knobbly tyres' },
    model: null,
    sections: [
      {
        heading: 'Design',
        body: [
          'Sketched concepts, researched and bought parts, then built a CAD model before cutting anything.',
          'Chose a wood frame for simplicity. A Predator 212cc engine drives the rear axle through a torque converter and a chain and sprocket.',
          'Bolted the front axle to wooden extensions to give the steering a greater range of rotation.',
        ],
        figures: [
          { image: 'gokart/IMG_0355.JPG', alt: 'Close-up of a steering spindle with a castle nut and tie-rod end', caption: 'Steering spindle' },
          { image: 'gokart/torque-converter.png', alt: 'Close-up of the torque converter with its drive belt', caption: 'Torque converter' },
        ],
      },
      {
        heading: 'Construction',
        body: [
          'Built the frame first, then assembled the rear axle, sprocket, brakes and bearings and bolted the rear assembly to the frame.',
          'Mounted the steering, seat and engine on planks fixed with wood glue and screws.',
        ],
        figures: [
          { image: 'gokart/IMG_0427.JPG', alt: 'Timber frame with the rear axle and bearings mounted across it', caption: 'Frame with rear axle and bearings' },
          { image: 'gokart/IMG_0429.JPG', alt: 'Top-down view of the frame with the engine, rear wheels and axle fitted', caption: 'Engine and rear wheels fitted' },
          { image: 'gokart/builder.png', alt: 'Kneeling beside the frame, working on the brake assembly', caption: 'Fitting the brake assembly' },
        ],
      },
      {
        heading: 'Brakes, throttle and safety',
        body: [
          'Linked the master cylinder to the left pedal with braided steel cable, run through screw eyes so it cannot tangle.',
          'A 5 kg return spring on the throttle cable and a 6 kg spring on the pedal bring both back reliably.',
          'Added a backup handbrake in case the main brake fails and an emergency throttle release in case the engine misbehaves.',
        ],
        figures: [
          { image: 'gokart/IMG_0430.JPG', alt: 'Hydraulic brake master cylinder and caliper with braided brake line on a workbench', caption: 'Brake master cylinder and braided line' },
          { image: 'gokart/IMG_0519.JPG', alt: 'Side view of the finished go-kart in the garage', caption: 'Finished kart, side view' },
        ],
      },
    ],
    results: [
      { label: 'Top speed', value: '24 mph' },
      { label: 'Weight', value: '175 lb' },
      { label: 'Power', value: '12 hp' },
    ],
    note: 'What I learned: how subsystems like the drivetrain and steering work together, and that I could take a project from pieces of wood to something that actually drives.',
  },
];

// The order projects appear in on the site (first one gets the large card).
const projectOrder = ['brake-pedal', 'wood-go-kart', 'aventus-racing'];
export const projects = projectOrder.map((slug) => allProjects.find((p) => p.slug === slug)).filter(Boolean);

export const experience = [
  {
    role: 'Aerodynamics Engineer (Apprentice)',
    org: 'Texas A&M Formula SAE Electric',
    dates: 'Sep 2026 – present',
    points: [
      'Contributing to the aerodynamic design of a competition electric race car, focused on downforce, drag reduction and airflow management.',
      'Running CFD in Star-CCM+ to find the optimal radiator placement and its effect on the overall aero package.',
      'Modeling and iterating concepts in SolidWorks, balancing performance with manufacturability.',
      'Performing composite and carbon fiber layups.',
      'Working with the structures, suspension and powertrain subteams to integrate aero and cooling parts into the full car.',
    ],
  },
  {
    role: 'Structures & Manufacturing Engineer',
    org: 'Texas A&M Design Build Fly (AIAA)',
    dates: 'Aug 2026 – present',
    points: [
      'Collegiate competition to design and build a fixed-wing RC aircraft that completes mission-specific flight tasks.',
      'Contributing to airfoil selection, structural load testing and the full SolidWorks assembly, including internal wing and fuselage structure.',
      'Modeled NACA 4416 wing ribs in SolidWorks from a spec sheet: 12 in root chord at 3° incidence, 9 in tip chord at 0.5°.',
      'Fabricating the airframe from laser-cut balsa and birch, finished with heat-shrink covering and fiberglass layups.',
    ],
  },
  {
    role: 'Founder & Team Principal',
    org: 'Aventus Racing, F1 in Schools / STEM Racing',
    dates: '11th – 12th grade',
    points: [
      'Founded and led the team; oversaw design, manufacturing and logistics.',
      '1st at State, 1st on the West Coast, 9th in the USA at the STEM Racing National Championship.',
    ],
    project: 'aventus-racing',
  },
];

export const education = {
  school: 'Texas A&M University',
  college: 'College of Engineering',
  degree: 'B.S. Mechanical Engineering',
  year: 'Class of 2030',
  gpa: '4.0',
  coursework: ['ENGR 102'],
};

// Shown like a parts list: name on the left, experience on the right.
export const skills = [
  {
    group: 'CAD',
    items: [
      { name: 'Computer-aided design', note: 'SolidWorks, Fusion 360', value: '9+ yrs' },
      { name: 'Fusion 360', note: 'Modeling, CAM, FEA', value: '4+ yrs' },
      { name: 'SolidWorks', note: 'Assemblies, mates, Simulation', value: 'FSAE, DBF' },
    ],
  },
  {
    group: 'Simulation',
    items: [
      { name: 'Computational fluid dynamics', note: 'Ansys Fluent, Ansys Discovery, Star-CCM+', value: '3+ yrs' },
      { name: 'Finite element analysis', note: 'Fusion 360, SolidWorks Simulation', value: 'Projects' },
    ],
  },
  {
    group: 'Manufacturing',
    items: [
      { name: 'CNC routing', note: 'Tormach XS Tech', value: 'Aventus' },
      { name: '3D printing', note: 'Bambu Lab X1C, ASA-CF', value: 'Aventus' },
      { name: 'Composite layups', note: 'Carbon fiber, fiberglass', value: 'FSAE, DBF' },
      { name: 'Laser cutting', note: 'Balsa and birch airframe parts', value: 'DBF' },
      { name: 'Wood and metal fabrication', note: 'Frame, axle and drivetrain', value: 'Go-kart' },
    ],
  },
  {
    group: 'Testing and visualization',
    items: [
      { name: 'Wind tunnel flow visualization', note: 'Home-built tunnel', value: 'Aventus' },
      { name: 'Structural load testing', note: 'Wing and fuselage structure', value: 'DBF' },
      { name: '3D rendering and animation', note: '', value: '2+ yrs' },
    ],
  },
];
