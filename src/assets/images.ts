/**
 * Every raster image on the site, resized and converted to WebP at build time
 * by vite-imagetools.
 *
 * Source art lives at full resolution in ./img; the `w=` list on each import is
 * the set of widths actually shipped, sized to ~1x and ~2x of the CSS box the
 * image renders into. Keep those lists in step with the layout — an image
 * rendered at 56px does not need a 2731px source (Skate.png used to ship 12.2MB
 * into a 60px-wide cell).
 *
 * Each import yields `{ sources: { webp }, img: { src, w, h } }`. Pass the whole
 * object to <GlassWell image={...}> and it wires up srcset, a fallback src and
 * intrinsic dimensions.
 */

// Avatar — 56px, 64px at sm.
import headshot from "./img/headshot.jpg?w=64;128;192&format=webp&quality=80&as=picture";

// Company logos — 36px, 40px at lg.
import ms from "./img/ms.png?w=40;80;120&format=webp&quality=85&as=picture";
import ibm from "./img/ibm.png?w=40;80;120&format=webp&quality=85&as=picture";
import as from "./img/as.png?w=40;80;120&format=webp&quality=85&as=picture";
import sp from "./img/sp.jpg?w=40;80;120&format=webp&quality=85&as=picture";
import st from "./img/st.png?w=40;80;120&format=webp&quality=85&as=picture";

// Project shots — 56px, 64px at sm.
import nucleus from "./img/nucleus.png?w=64;128;192&format=webp&quality=82&as=picture";
import cv from "./img/cv.png?w=64;128;192&format=webp&quality=82&as=picture";
import cg from "./img/cg.png?w=64;128;192&format=webp&quality=82&as=picture";
import nm from "./img/nm.png?w=64;128;192&format=webp&quality=82&as=picture";

// Extracurricular marks — capped at 60px.
import QTMA from "./img/QTMA.png?w=60;120;180&format=webp&quality=85&as=picture";
import QMIND from "./img/QMIND.png?w=60;120;180&format=webp&quality=85&as=picture";
import ICONS from "./img/ICONS.png?w=60;120;180&format=webp&quality=85&as=picture";

// Hobby filmstrip — ~60x110 tiles, object-cover, so they need the most pixels.
import Football from "./img/Football.png?w=120;240;360&format=webp&quality=78&as=picture";
import Hockey from "./img/Hockey.png?w=120;240;360&format=webp&quality=78&as=picture";
import Skate from "./img/Skate.png?w=120;240;360&format=webp&quality=78&as=picture";
import Shoe from "./img/Shoe.png?w=120;240;360&format=webp&quality=78&as=picture";
import Workout from "./img/Workout.png?w=120;240;360&format=webp&quality=78&as=picture";
import hiking from "./img/hiking.jpg?w=120;240;360&format=webp&quality=78&as=picture";

// Book covers — 48x72.
import ah from "./img/ah.jpg?w=72;144;216&format=webp&quality=80&as=picture";
import aia from "./img/aia.jpg?w=72;144;216&format=webp&quality=80&as=picture";

/** What vite-imagetools returns for `as=picture`. */
export type Picture = {
  sources: { webp: string };
  img: { src: string; w: number; h: number };
};

export const IMAGES = {
  headshot,
  ms,
  ibm,
  as,
  sp,
  st,
  nucleus,
  cv,
  cg,
  nm,
  QTMA,
  QMIND,
  ICONS,
  Football,
  Hockey,
  Skate,
  Shoe,
  Workout,
  hiking,
  ah,
  aia,
} satisfies Record<string, Picture>;

export type ImageKey = keyof typeof IMAGES;
