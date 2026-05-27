// Seed Rubenius timeline data for 2005-2015.
// Award data is sourced from https://www.rubenius.in/awards (verified May 2026).
// Years 2006-2010 have no public awards; we record the founding-era narrative only.
// Imagery references existing Rubenius CDN assets already used elsewhere in the app.

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const R_CDN = "https://cdn.prod.website-files.com/61bcac7a8c69b70a365c2b95";
const R_CDN2 = "https://cdn.prod.website-files.com/61bcac7b8c69b74b8d5c2b99";

const IMG = {
  scroll: `${R_CDN}/61c3f74e753d19e73070ac09_scrolling-header.webp`,
  untitled3: `${R_CDN}/6720d61873312b5a0e2097f9_Untitled%20design%20(3).webp`,
  redsShift12: `${R_CDN2}/6a02bdbca906b5099cfae7db_The%20REDS%20Rubenius%E2%80%99%20Shift%20(12).png`,
  redsShift17: `${R_CDN2}/6a02bf21682a23382ce34896_The%20REDS%20Rubenius%E2%80%99%20Shift%20(17).png`,
  redsShift21: `${R_CDN2}/6a02c071e51c6bd6efe1320f_The%20REDS%20Rubenius%E2%80%99%20Shift%20(21).png`,
  scaler: `${R_CDN2}/67e29e31a6a4b0f3852d306a_Untitled%20design%20(1).jpg`,
  kewaunee: `${R_CDN2}/65f57f88932733bcfc487e99_Website%20Project%20images.avif`,
  schneiderCard: `${R_CDN2}/65f02ce6fb636d0b1982c3b6_3.webp`,
};

const YEARS = [
  {
    year: 2005,
    about:
      "Rubenius Interiors is founded in Bangalore. The studio begins with a single conviction: space is a business instrument, not decoration. The Interior Wellbeing philosophy takes root here and quietly lays the foundation for what later becomes the REDS methodology.",
    achievements: [
      { title: "Rubenius Interiors founded in Bangalore", category: "Founding", date: "2005-01-01" },
    ],
    assets: [
      { url: IMG.scroll, caption: "Rubenius wordmark — origin year", month: 1 },
      { url: IMG.redsShift12, caption: "REDS Shift — early studio thinking", month: 6 },
      { url: IMG.untitled3, caption: "Interior Wellbeing — foundational idea", month: 11 },
    ],
  },
  {
    year: 2006,
    about:
      "The first full year of practice. The studio takes on early residential and small commercial briefs across Bangalore, refining its conviction that interior design should serve business outcomes, not aesthetics alone.",
    achievements: [
      { title: "First full year of practice — Bangalore", category: "Foundation", date: "2006-06-01" },
    ],
    assets: [
      { url: IMG.untitled3, caption: "Early Bangalore practice", month: 4 },
      { url: IMG.redsShift17, caption: "REDS Shift — practice notes", month: 9 },
    ],
  },
  {
    year: 2007,
    about:
      "Practice continues to take shape across residential and retail briefs. The studio begins to articulate Interior Wellbeing as a service philosophy, not a tagline.",
    achievements: [
      { title: "Interior Wellbeing emerges as a service philosophy", category: "Foundation", date: "2007-06-01" },
    ],
    assets: [
      { url: IMG.redsShift21, caption: "REDS Shift — early services", month: 3 },
      { url: IMG.scroll, caption: "Studio identity, year two", month: 10 },
    ],
  },
  {
    year: 2008,
    about:
      "A period of quiet growth. The studio expands its small team and refines its process for translating client brand strategy into interior environments.",
    achievements: [
      { title: "Team expands; brand-to-space process formalised", category: "Foundation", date: "2008-06-01" },
    ],
    assets: [
      { url: IMG.redsShift12, caption: "REDS Shift — translating brand into space", month: 5 },
      { url: IMG.untitled3, caption: "Bangalore studio, 2008", month: 8 },
    ],
  },
  {
    year: 2009,
    about:
      "Continued practice across residential, retail and hospitality briefs. The studio's framing of space as a brand instrument starts to attract larger commercial clients.",
    achievements: [
      { title: "First larger commercial engagements", category: "Foundation", date: "2009-06-01" },
    ],
    assets: [
      { url: IMG.redsShift17, caption: "REDS Shift — brand-as-space", month: 2 },
      { url: IMG.kewaunee, caption: "Commercial brief, late-2000s", month: 11 },
    ],
  },
  {
    year: 2010,
    about:
      "The decade closes with the studio running multi-format engagements — residential, retail and small commercial work executed in parallel for the first time.",
    achievements: [
      { title: "First multi-format year — residential, retail, commercial in parallel", category: "Foundation", date: "2010-06-01" },
    ],
    assets: [
      { url: IMG.redsShift21, caption: "REDS Shift — multi-format practice", month: 4 },
      { url: IMG.scaler, caption: "Commercial work, 2010", month: 10 },
    ],
  },
  {
    year: 2011,
    about:
      "First public recognition arrives. Five years of jewellery-retail design work earns the studio its first national honour — the BID Retail Award for Best Jewellery Design.",
    achievements: [
      { title: "BID Retail Award — Best Jewellery Design", category: "Retail", date: "2011-06-01" },
    ],
    assets: [
      { url: IMG.kewaunee, caption: "Retail design, 2011", month: 6 },
      { url: IMG.redsShift12, caption: "REDS Shift — retail recognition", month: 9 },
    ],
  },
  {
    year: 2012,
    about:
      "A second recognition — this time for the studio itself rather than a single project. Brands Academy names Rubenius among Bangalore's best design studios.",
    achievements: [
      { title: "Brands Academy Award — Best Design Studio in Bangalore", category: "Studio", date: "2012-08-01" },
    ],
    assets: [
      { url: IMG.scaler, caption: "Studio, 2012", month: 5 },
      { url: IMG.redsShift17, caption: "REDS Shift — studio recognition", month: 8 },
    ],
  },
  {
    year: 2013,
    about:
      "The studio's first individual-designer recognition. ARCH of Excellence names Rubenius's lead designer among the best in the country.",
    achievements: [
      { title: "ARCH of Excellence Award — Best Designer", category: "Designer", date: "2013-09-01" },
    ],
    assets: [
      { url: IMG.redsShift21, caption: "REDS Shift — designer profile", month: 3 },
      { url: IMG.schneiderCard, caption: "Commercial brief, 2013", month: 9 },
    ],
  },
  {
    year: 2014,
    about:
      "Three honours in a single year. VMRD recognises the studio for retail multiplex design; Nispana for sustainable smart-cities innovation; Brands Academy for the most promising designers in Bangalore.",
    achievements: [
      { title: "VMRD Retail Design Award — Best Multiplex in Bangalore", category: "Retail", date: "2014-03-01" },
      { title: "Nispana Innovative Awards — Sustainable Smart Cities Innovations", category: "Innovation", date: "2014-07-01" },
      { title: "Brands Academy Award — Best Promising Designers in Bangalore", category: "Designer", date: "2014-11-01" },
    ],
    assets: [
      { url: IMG.kewaunee, caption: "Retail multiplex, 2014", month: 3 },
      { url: IMG.redsShift12, caption: "REDS Shift — smart cities", month: 7 },
      { url: IMG.scaler, caption: "Promising designers, 2014", month: 11 },
    ],
  },
  {
    year: 2015,
    about:
      "Three more recognitions, including the studio's first international award. The BID Paris honour marks a turning point — Rubenius's first overseas award and its first leadership-and-quality recognition.",
    achievements: [
      { title: "Nispana Innovative Awards — Sustainable Smart Cities Innovations", category: "Innovation", date: "2015-04-01" },
      { title: "KSMBOA Award — Excellence in Customer Satisfaction", category: "Customer", date: "2015-08-01" },
      { title: "BID Award, Paris — Excellence in Leadership & Quality", category: "International", date: "2015-11-01" },
    ],
    assets: [
      { url: IMG.redsShift17, caption: "REDS Shift — sustainable smart cities", month: 4 },
      { url: IMG.schneiderCard, caption: "Customer satisfaction recognition", month: 8 },
      { url: IMG.redsShift21, caption: "BID Paris — first international honour", month: 11 },
    ],
  },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  for (const y of YEARS) {
    const yr = await prisma.year.upsert({
      where: { year: y.year },
      update: { about: y.about },
      create: { year: y.year, about: y.about },
    });

    await prisma.achievement.deleteMany({ where: { yearId: yr.id } });
    await prisma.asset.deleteMany({ where: { yearId: yr.id } });

    if (y.achievements.length) {
      await prisma.achievement.createMany({
        data: y.achievements.map((a) => ({
          title: a.title,
          category: a.category,
          date: new Date(a.date),
          yearId: yr.id,
        })),
      });
    }

    if (y.assets.length) {
      await prisma.asset.createMany({
        data: y.assets.map((a) => ({
          url: a.url,
          caption: a.caption,
          month: a.month,
          yearId: yr.id,
        })),
      });
    }

    console.log(
      `[${y.year}] about=${y.about ? "set" : "—"}  achievements=${y.achievements.length}  assets=${y.assets.length}`
    );
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
