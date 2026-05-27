"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AwardIconName =
  | "trophy"
  | "medal"
  | "star"
  | "ribbon"
  | "building"
  | "lightbulb"
  | "globe"
  | "shield"
  | "sparkles";

interface AwardItem {
  icon: AwardIconName;
  name: string;
  category: string;
}

// Fallback timeline data for Rubenius Interiors — sourced from rubenius.in awards & milestones
const RUBENIUS_FALLBACKS: Record<
  number,
  {
    era: string;
    delta: string;
    tag: string;
    title: string;
    description: string;
    stats: Array<{ label: string; value: string }>;
    awards?: AwardItem[];
  }
> = {
  2005: {
    era: "Origin",
    delta: "— Rubenius founded",
    tag: "Founded",
    title: "Rubenius Interiors is established in Bangalore.",
    description:
      "The studio begins with a single conviction: space is a business instrument, not decoration. The Interior Wellbeing™ philosophy takes root here and quietly sets the foundation for what becomes the REDS methodology.",
    stats: [
      { label: "Founded", value: "2005" },
      { label: "HQ", value: "Bangalore" },
      { label: "Discipline", value: "Experience design" },
    ],
  },
  2016: {
    era: "First major recognition",
    delta: "+ IQA Karnataka",
    tag: "IQA",
    title: "IQA Award — Excellence in Interior Designing Services, Karnataka.",
    description:
      "Eleven years of work earns the studio its first major regional honour. A Nispana Innovative Award for sustainable smart-cities work lands in the same year.",
    stats: [
      { label: "Award", value: "IQA" },
      { label: "Region", value: "Karnataka" },
      { label: "Also", value: "Nispana" },
    ],
    awards: [
      { icon: "trophy",    name: "IQA Award",           category: "Excellence in Interior Designing Services — Karnataka" },
      { icon: "lightbulb", name: "Nispana Innovative",  category: "Sustainable Smart Cities Innovations" },
    ],
  },
  2017: {
    era: "Residential at scale",
    delta: "+ FOAID Best Villa",
    tag: "FOAID",
    title: "FOAID — Best Interior, Residential Villa Large.",
    description:
      "The studio's first national FOAID win lands for a large villa interior. The Economic Times also recognises Rubenius among India's Top 5 Smart Green Workplaces.",
    stats: [
      { label: "FOAID", value: "Best Villa" },
      { label: "Recognition", value: "ET Top 5" },
      { label: "Theme", value: "Smart Green" },
    ],
    awards: [
      { icon: "trophy", name: "FOAID Awards",                    category: "Best Residential Villa Large" },
      { icon: "ribbon", name: "ET Smart Green Summit",           category: "Top 5 Smart Green Workplaces" },
    ],
  },
  2018: {
    era: "Retail experience",
    delta: "+ FOAID Best Retail",
    tag: "Retail",
    title: "FOAID — Best Interior Retail, India.",
    description:
      "The studio's first national retail design award. Retail emerges as a strategic discipline within the practice — each store treated as a brand environment, not a fixture programme.",
    stats: [
      { label: "FOAID", value: "Best Retail" },
      { label: "Scope", value: "India" },
      { label: "Discipline", value: "Retail" },
    ],
    awards: [
      { icon: "trophy", name: "FOAID Awards", category: "Best Interior Retail — India" },
    ],
  },
  2019: {
    era: "Multi-award year",
    delta: "+ four 2019 honours",
    tag: "Awards",
    title: "FOAID Retail repeats. SCCI, IA&B Young Designer, Creative Minds.",
    description:
      "Back-to-back FOAID wins for retail are joined by Young Designer and Creative Minds awards for commercial interiors. The studio's commercial practice gains momentum.",
    stats: [
      { label: "Awards", value: "4" },
      { label: "Categories", value: "Retail · Commercial" },
      { label: "Year", value: "2019" },
    ],
    awards: [
      { icon: "trophy",    name: "FOAID Awards",            category: "Best Interior Retail (repeat)" },
      { icon: "lightbulb", name: "SCCI Awards",             category: "Innovation Hub" },
      { icon: "star",      name: "IA&B Young Designer",     category: "Best Commercial Interiors" },
      { icon: "star",      name: "Creative Minds Next",     category: "Best Interiors Commercial" },
    ],
  },
  2020: {
    era: "Pandemic response",
    delta: "× lockdown year",
    tag: "D'Source",
    title: "D'Source IIT Bombay — Winner, Product Solutions for the Pandemic.",
    description:
      "When the built world stops, Rubenius turns to product. IIT Bombay's D'Source recognises two distinct pandemic solutions. Tech Briefs adds two 'Most Popular Innovation' awards.",
    stats: [
      { label: "D'Source", value: "2 wins" },
      { label: "Tech Briefs", value: "2 wins" },
      { label: "Category", value: "Pandemic Product" },
    ],
    awards: [
      { icon: "shield",    name: "D'Source — IIT Bombay",        category: "Winner — Product Solution for Pandemic" },
      { icon: "shield",    name: "D'Source — IIT Bombay",        category: "Winner — Isolation Solution for Pandemic" },
      { icon: "lightbulb", name: "Tech Briefs — Create the Future", category: "Most Popular Innovation — Medical" },
      { icon: "lightbulb", name: "Tech Briefs — Create the Future", category: "Most Popular Innovation — Product Design" },
    ],
  },
  2021: {
    era: "International stage",
    delta: "+ Lexus × 3",
    tag: "Lexus",
    title: "Lexus Design Awards — three categories in one year.",
    description:
      "Lexus recognises the studio across Public Utility Design, Design Thinking and Product Design. Kyoorius Design Yatra adds a product win. Eldrock honours residential public space. BSI, Mango and Nestle round out a record year.",
    stats: [
      { label: "Lexus", value: "3 wins" },
      { label: "Total", value: "8+ awards" },
      { label: "Year", value: "2021" },
    ],
    awards: [
      { icon: "globe",    name: "Lexus Design Awards",  category: "Public Utility Design" },
      { icon: "globe",    name: "Lexus Design Awards",  category: "Design Thinking" },
      { icon: "globe",    name: "Lexus Design Awards",  category: "Product Design" },
      { icon: "medal",    name: "Kyoorius Design Yatra", category: "Product Design" },
      { icon: "building", name: "Eldrock Award",         category: "Best in Class — Residential & Public Space" },
      { icon: "shield",   name: "BSI Awards",            category: "Winner — Prefab Structure" },
      { icon: "ribbon",   name: "Mango Award",           category: "Reinventing Tents" },
      { icon: "ribbon",   name: "Nestle India Award",    category: "Recognition — COVID Innovations" },
    ],
  },
  2022: {
    era: "Workspace innovation",
    delta: "+ Spaciux Platinum",
    tag: "Workspace",
    title: "Schneider Experience Centre. Spaciux Platinum — Large Work Space Design.",
    description:
      "A 3,000-sqft Schneider Electric Experience Centre showcases voice-activated AI, parametric audio and IoT — winning FOAID's Innovative Experience Centre of the Year. Spaciux Platinum, Young Designer of the Year and A.C.E.D. recognitions follow.",
    stats: [
      { label: "Spaciux", value: "Platinum" },
      { label: "Schneider", value: "3,000 sqft" },
      { label: "Format", value: "AI · IoT" },
    ],
    awards: [
      { icon: "trophy",    name: "Spaciux Platinum Awards",       category: "Large Work Space Design" },
      { icon: "star",      name: "Young Designer of the Year",    category: "Commercial Design" },
      { icon: "lightbulb", name: "Innovation at the Workspace",   category: "Commercial Design" },
      { icon: "medal",     name: "A.C.E.D.",                      category: "Best Colour Palette — Commercial" },
      { icon: "globe",     name: "Lexus Design Award",            category: "Finalist — Design Thinking" },
    ],
  },
  2023: {
    era: "Top 40",
    delta: "+ IGEN India Top 40",
    tag: "Industry",
    title: "IGEN — India's Top 40 designers. FOAID India 10 retail.",
    description:
      "Construction Week names Rubenius Interior Contractor of the Year. Architect & Interiors India recognises the studio for Future Design. FOAID's India 10 names it among the country's top retail interior practices.",
    stats: [
      { label: "IGEN", value: "Top 40" },
      { label: "FOAID", value: "India 10" },
      { label: "Industry", value: "Contractor of the Year" },
    ],
    awards: [
      { icon: "ribbon",   name: "IGEN",                          category: "India's Top 40 Best Designer" },
      { icon: "trophy",   name: "FOAID India 10",                category: "Interior Retail" },
      { icon: "building", name: "Construction Week",             category: "Interior Contractor of the Year" },
      { icon: "star",     name: "Architect & Interiors India",   category: "Future Design" },
      { icon: "medal",    name: "Geevees",                       category: "Commercial Design" },
    ],
  },
  2024: {
    era: "Technology integration",
    delta: "+ Design Milestone",
    tag: "Innovation",
    title: "Design Milestone — Innovative Technology Integration.",
    description:
      "The studio's interactive and immersive practice — combining hardware, software and physical space — earns a Design Milestone Award. Spaceiux recognises shopping-space design and FOAID adds a Bronze.",
    stats: [
      { label: "Awards", value: "3" },
      { label: "Milestone", value: "Tech Integration" },
      { label: "Format", value: "Spaceiux · FOAID" },
    ],
    awards: [
      { icon: "sparkles", name: "Design Milestone Award", category: "Innovative Technology Integration" },
      { icon: "building", name: "Spaceiux",               category: "Shopping Space" },
      { icon: "medal",    name: "FOAID",                  category: "Bronze" },
    ],
  },
  2025: {
    era: "Twenty years",
    delta: "→ FOAID On Going",
    tag: "Current",
    title: "FOAID — On Going Project. Two decades of Interior Wellbeing.",
    description:
      "A project still in motion enters the FOAID circuit. Twenty years on, the practice continues to treat every brief as a chance to shape how a brand is remembered.",
    stats: [
      { label: "FOAID", value: "On Going" },
      { label: "Year", value: "2025" },
      { label: "Anniversary", value: "20 years" },
    ],
    awards: [
      { icon: "trophy", name: "FOAID", category: "On Going Project" },
    ],
  },
};

// Floating media collage shown around each year's card
type MediaSlot = "tl" | "tr" | "bl" | "br" | "ml" | "mr";
type Media =
  | { type: "image"; url: string; alt: string; pos: MediaSlot }
  | {
      type: "video";
      poster: string;          // thumbnail (Rubenius CDN image)
      alt: string;
      pos: MediaSlot;
      embedUrl?: string;       // YouTube / Vimeo iframe URL
      videoUrl?: string;       // direct .mp4 URL
      title?: string;          // shown above the player in the modal
    };

// Rubenius YouTube uploads playlist — every upload from their channel, autoplayed in order.
// Swap the list ID for a specific video by changing this URL to: https://www.youtube.com/embed/VIDEO_ID?autoplay=1&rel=0
const RUBENIUS_YT_EMBED =
  "https://www.youtube.com/embed/videoseries?list=UUJa1fnQh9duhYEBD4VKfWKQ&autoplay=1&rel=0&modestbranding=1";

// Rubenius CDN assets — extracted from rubenius.in
const R_CDN = "https://cdn.prod.website-files.com/61bcac7a8c69b70a365c2b95";
const R_CDN2 = "https://cdn.prod.website-files.com/61bcac7b8c69b74b8d5c2b99";

// Direct paths to real Rubenius project & brand imagery
const RB = {
  scroll: `${R_CDN}/61c3f74e753d19e73070ac09_scrolling-header.webp`,
  untitled3: `${R_CDN}/6720d61873312b5a0e2097f9_Untitled%20design%20(3).webp`,
  redsShift12: `${R_CDN2}/6a02bdbca906b5099cfae7db_The%20REDS%20Rubenius%E2%80%99%20Shift%20(12).png`,
  redsShift17: `${R_CDN2}/6a02bf21682a23382ce34896_The%20REDS%20Rubenius%E2%80%99%20Shift%20(17).png`,
  redsShift21: `${R_CDN2}/6a02c071e51c6bd6efe1320f_The%20REDS%20Rubenius%E2%80%99%20Shift%20(21).png`,
  schneiderCase: `${R_CDN2}/61ca86f993dac14aaa618b68_Schneider-case.avif`,
  schneiderCard: `${R_CDN2}/65f02ce6fb636d0b1982c3b6_3.webp`,
  schneider7: `${R_CDN2}/61ebd4ed95b75977736dadbf_Schneider-Electric-7.webp`,
  schneider8: `${R_CDN2}/61ebd4edd0df78bb9d7f649f_Schneider-Electric-8.webp`,
  schneider9: `${R_CDN2}/61ebd4edd0df78b7817f64a0_Schneider-Electric-9.jpg`,
  schneider10: `${R_CDN2}/61ebd4f13eec5941b0232c5d_Schneider-Electric-10.avif`,
  schneider13: `${R_CDN2}/61ebd4f12c005b93d2e8b12f_Schneider-Electric-13.webp`,
  schneider14: `${R_CDN2}/61ebd4f129adecfc59dd2d50_Schneider-Electric-14.avif`,
  schneider23: `${R_CDN2}/6729ac2431f07097dd1b7c4e_23.jpg`,
  scaler: `${R_CDN2}/67e29e31a6a4b0f3852d306a_Untitled%20design%20(1).jpg`,
  kewaunee: `${R_CDN2}/65f57f88932733bcfc487e99_Website%20Project%20images.avif`,
};

// Shared pool used to pad any year that doesn't have 4 media pieces of its own
// — keeps every card's floating collage in the same 4-slot format.
const MEDIA_FALLBACK_POOL: string[] = [
  RB.scroll,
  RB.untitled3,
  RB.redsShift12,
  RB.redsShift17,
  RB.redsShift21,
  RB.scaler,
  RB.kewaunee,
  RB.schneiderCard,
];

const RUBENIUS_MEDIA: Record<number, Media[]> = {
  2005: [
    { type: "image", url: RB.scroll, alt: "Rubenius brand wordmark", pos: "tl" },
    { type: "image", url: RB.untitled3, alt: "Interior Wellbeing strategy", pos: "tr" },
    { type: "image", url: RB.redsShift12, alt: "REDS Shift — origin", pos: "bl" },
    { type: "image", url: RB.redsShift17, alt: "REDS Shift — practice", pos: "br" },
  ],
  2016: [
    { type: "image", url: RB.scaler, alt: "Scaler Innovation Lab", pos: "tl" },
    { type: "image", url: RB.untitled3, alt: "Karnataka practice", pos: "tr" },
    { type: "image", url: RB.kewaunee, alt: "Kewaunee International", pos: "bl" },
    { type: "image", url: RB.redsShift21, alt: "REDS Shift — recognition", pos: "br" },
  ],
  2017: [
    { type: "image", url: RB.scaler, alt: "Residential villa interior", pos: "tl" },
    { type: "image", url: RB.schneider23, alt: "Villa detail", pos: "tr" },
    { type: "image", url: RB.redsShift12, alt: "REDS Shift — residential", pos: "bl" },
    { type: "image", url: RB.untitled3, alt: "Smart green workplace", pos: "br" },
  ],
  2018: [
    { type: "image", url: RB.kewaunee, alt: "Retail experience interior", pos: "tl" },
    { type: "image", url: RB.schneiderCard, alt: "Retail brand environment", pos: "tr" },
    { type: "image", url: RB.redsShift17, alt: "REDS Shift — retail", pos: "bl" },
    { type: "image", url: RB.schneiderCase, alt: "Experience design", pos: "br" },
  ],
  2019: [
    { type: "image", url: RB.schneiderCard, alt: "Commercial interior", pos: "tl" },
    { type: "image", url: RB.kewaunee, alt: "Retail design — repeat win", pos: "tr" },
    { type: "image", url: RB.redsShift17, alt: "REDS Shift — commercial", pos: "bl" },
    { type: "image", url: RB.redsShift21, alt: "REDS Shift — innovation", pos: "br" },
  ],
  2020: [
    { type: "image", url: RB.redsShift17, alt: "REDS Shift — pandemic", pos: "tl" },
    { type: "image", url: RB.redsShift21, alt: "Pandemic product solution", pos: "tr" },
    { type: "image", url: RB.untitled3, alt: "D'Source winning design", pos: "bl" },
    {
      type: "video",
      poster: RB.redsShift12,
      alt: "Watch — Pandemic product walkthrough",
      title: "Pandemic product — Rubenius walkthrough",
      embedUrl: RUBENIUS_YT_EMBED,
      pos: "br",
    },
  ],
  2021: [
    { type: "image", url: RB.redsShift21, alt: "Lexus public-utility design", pos: "tl" },
    { type: "image", url: RB.redsShift12, alt: "Kyoorius product design", pos: "tr" },
    { type: "image", url: RB.untitled3, alt: "Eldrock residential public", pos: "bl" },
    { type: "image", url: RB.scaler, alt: "Design thinking", pos: "br" },
  ],
  2022: [
    {
      type: "video",
      poster: RB.schneiderCase,
      alt: "Watch — Schneider Experience Centre tour",
      title: "Schneider Electric — Experience Centre tour",
      embedUrl: RUBENIUS_YT_EMBED,
      pos: "tl",
    },
    { type: "image", url: RB.schneider9, alt: "Schneider — voice AI", pos: "tr" },
    { type: "image", url: RB.schneider8, alt: "Schneider — parametric audio", pos: "bl" },
    { type: "image", url: RB.schneider14, alt: "Schneider — anamorphic lighting", pos: "br" },
  ],
  2023: [
    { type: "image", url: RB.scaler, alt: "Scaler Innovation Lab — Future Design", pos: "tl" },
    { type: "image", url: RB.kewaunee, alt: "Kewaunee International — retail", pos: "tr" },
    { type: "image", url: RB.schneider7, alt: "Schneider Centre detail", pos: "bl" },
    { type: "image", url: RB.schneider13, alt: "Interior contracting craft", pos: "br" },
  ],
  2024: [
    { type: "image", url: RB.schneider10, alt: "Schneider — IoT integration", pos: "tl" },
    { type: "image", url: RB.schneider14, alt: "Technology integration", pos: "tr" },
    {
      type: "video",
      poster: RB.schneider23,
      alt: "Watch — Interactive technology showcase",
      title: "Technology integration — Design Milestone showcase",
      embedUrl: RUBENIUS_YT_EMBED,
      pos: "bl",
    },
    { type: "image", url: RB.schneiderCard, alt: "Innovative experience centre", pos: "br" },
  ],
  2025: [
    { type: "image", url: RB.scaler, alt: "On going project — Scaler", pos: "tl" },
    { type: "image", url: RB.kewaunee, alt: "Current work — Kewaunee", pos: "tr" },
    { type: "image", url: RB.untitled3, alt: "Twenty-year anniversary", pos: "bl" },
    { type: "image", url: RB.redsShift12, alt: "REDS — still shaping memory", pos: "br" },
  ],
};

// Always returns exactly 4 Media pieces in slots tl/tr/bl/br.
// DB-seeded assets are preferred (per the prioritize-DB-assets policy),
// then curated RUBENIUS_MEDIA for that year, then the shared fallback pool.
function buildYearMedia(
  year: number,
  dbAssets: Array<{ id: number; url: string; caption: string | null; month: number }>
): Media[] {
  const slots: MediaSlot[] = ["tl", "tr", "bl", "br"];
  const curated = RUBENIUS_MEDIA[year];

  // Curated entries already have correct positions — use as-is when complete.
  if ((!dbAssets || dbAssets.length === 0) && curated && curated.length >= 4) {
    return curated.slice(0, 4);
  }

  const out: Media[] = [];
  const used = new Set<string>();

  for (const asset of dbAssets || []) {
    if (out.length >= 4) break;
    if (used.has(asset.url)) continue;
    out.push({
      type: "image",
      url: asset.url,
      alt: asset.caption || "Timeline moment",
      pos: slots[out.length],
    });
    used.add(asset.url);
  }

  for (const m of curated || []) {
    if (out.length >= 4) break;
    const key = m.type === "image" ? m.url : m.poster;
    if (used.has(key)) continue;
    out.push({ ...m, pos: slots[out.length] });
    used.add(key);
  }

  for (const url of MEDIA_FALLBACK_POOL) {
    if (out.length >= 4) break;
    if (used.has(url)) continue;
    out.push({
      type: "image",
      url,
      alt: "Rubenius archival image",
      pos: slots[out.length],
    });
    used.add(url);
  }

  return out;
}

interface DBYear {
  id: number;
  year: number;
  about: string | null;
  achievements?: Array<{
    id: number;
    title: string;
    category: string;
    date: Date | string;
  }>;
  assets?: Array<{
    id: number;
    url: string;
    caption: string | null;
    month: number;
  }>;
}

interface TimelineContainerProps {
  initialYears: DBYear[];
}

interface ProcessedItem {
  id: string | number;
  year: number;
  chapter: string;
  era: string;
  delta: string;
  tag: string;
  title: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  awards: AwardItem[];
  assets: Array<{ id: number; url: string; caption: string | null; month: number }>;
}

// Pick an award icon from a free-form category string — used when DB achievements
// supply the awards list (no hardcoded fallback). Keep matches loose and case-insensitive.
function iconForCategory(category: string): AwardIconName {
  const c = category.toLowerCase();
  if (/(found|origin|anniv)/.test(c)) return "sparkles";
  if (/(retail|jewell|multiplex|shop)/.test(c)) return "trophy";
  if (/(studio|workspace|commercial|office|contract|build)/.test(c)) return "building";
  if (/(designer|young|future|creative)/.test(c)) return "star";
  if (/(international|paris|global|lexus|world)/.test(c)) return "globe";
  if (/(innov|smart|tech|sustain|pandemic|hub)/.test(c)) return "lightbulb";
  if (/(customer|leader|quality|service|industry)/.test(c)) return "shield";
  if (/(recogn|excellence|honour|honor|top)/.test(c)) return "ribbon";
  return "medal";
}

// Inline SVG paths for each award icon — minimal Lucide-style strokes
function AwardIcon({ name }: { name: AwardIconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: 16,
    height: 16,
  };
  switch (name) {
    case "trophy":
      return (
        <svg {...common}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case "medal":
      return (
        <svg {...common}>
          <path d="m7.21 15-1.42-1.42a2.5 2.5 0 0 1 0-3.54L7.21 8.5" />
          <path d="M9 8.5 12 5l3 3.5" />
          <path d="M16.79 15l1.42-1.42a2.5 2.5 0 0 0 0-3.54L16.79 8.5" />
          <path d="M14 12c1.5 0 3 1.5 3 3v6l-5-3-5 3v-6c0-1.5 1.5-3 3-3" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
        </svg>
      );
    case "ribbon":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="6" />
          <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg {...common}>
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
      );
  }
}

// Shared floating-collage component — every year card renders the same 4-slot
// layout (tl/tr/bl/br). Keeps the format identical across curated, DB-seeded,
// and fallback-padded years.
interface MediaCollageProps {
  media: Media[];
  year: number;
  onVideoOpen: (video: { embedUrl?: string; videoUrl?: string; title: string }) => void;
}

function MediaCollage({ media, year, onVideoOpen }: MediaCollageProps) {
  return (
    <div className="media-floats">
      {media.map((m, mi) => {
        if (m.type === "image") {
          return (
            <figure
              key={`media-${year}-${mi}`}
              className={`media-piece pos-${m.pos} is-image`}
              style={{ animationDelay: `${mi * 90}ms` }}
              aria-hidden="true"
            >
              <img
                src={m.url}
                alt={m.alt}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                }}
              />
            </figure>
          );
        }
        return (
          <button
            key={`media-${year}-${mi}`}
            type="button"
            className={`media-piece pos-${m.pos} is-video`}
            style={{ animationDelay: `${mi * 90}ms` }}
            aria-label={m.alt}
            onClick={() =>
              onVideoOpen({
                embedUrl: m.embedUrl,
                videoUrl: m.videoUrl,
                title: m.title ?? m.alt,
              })
            }
          >
            <img
              src={m.poster}
              alt=""
              loading="lazy"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display = "none";
              }}
            />
            <span className="media-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="media-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              WATCH
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function TimelineContainer({ initialYears }: TimelineContainerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hudData, setHudData] = useState({
    year: "2008",
    era: "First chapter · 2008",
    delta: "— founding",
    counter: "01 / 08",
  });
  const [ghostLefts, setGhostLefts] = useState<number[]>([]);
  const [activeMedia, setActiveMedia] = useState<{ url: string; caption: string | null } | null>(null);
  const [activeVideo, setActiveVideo] = useState<{
    embedUrl?: string;
    videoUrl?: string;
    title: string;
  } | null>(null);

  // Close the video modal on Escape
  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeVideo]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsContainerRef = useRef<HTMLDivElement | null>(null);
  const railFillRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const intendedIdxRef = useRef(0);

  // Process data: combine DB rows with the Rubenius fallback narrative
  const processedItems: ProcessedItem[] = useMemo(() => (
    initialYears && initialYears.length > 0
      ? [...initialYears].sort((a, b) => a.year - b.year)
      : Object.keys(RUBENIUS_FALLBACKS).map((yr) => ({
          id: yr,
          year: parseInt(yr),
          about: RUBENIUS_FALLBACKS[parseInt(yr)].description,
          achievements: [
            {
              id: parseInt(yr),
              title: RUBENIUS_FALLBACKS[parseInt(yr)].title,
              category: RUBENIUS_FALLBACKS[parseInt(yr)].tag,
              date: `${yr}-01-01`,
            },
          ],
          assets: parseInt(yr) === 2008 ? [
            { id: 1, url: "/extracted_ui/uploads/Screenshot 2026-05-25 at 12.59.32 PM.png", caption: "Team trailer outside Baytown", month: 5 }
          ] : [],
        }))
  ).map((item, idx) => {
    const fallback = RUBENIUS_FALLBACKS[item.year];
    const chapter = `CH. ${String(idx + 1).padStart(2, "0")}`;

    const era = fallback?.era || (item.achievements?.[0]?.category ?? "Chapter");
    const delta = fallback?.delta || (item.achievements?.[0] ? `+ ${item.achievements[0].title.slice(0, 20)}...` : "— logged");
    const tag = fallback?.tag || (item.achievements?.[0]?.category ?? "Event");
    const title = item.achievements?.[0]?.title || fallback?.title || "Year Reflection";
    const description = item.about || fallback?.description || "A milestone year in our collective history.";

    let stats = fallback?.stats || [];
    if (!fallback && item.achievements) {
      stats = [
        { label: "Achievements", value: String(item.achievements.length) },
        { label: "Media Assets", value: String(item.assets?.length ?? 0) },
        { label: "Category", value: item.achievements[0]?.category ?? "General" },
      ];
    }

    const derivedAwards: AwardItem[] =
      fallback?.awards ??
      (item.achievements?.map((a) => ({
        icon: iconForCategory(a.category),
        name: a.title,
        category: a.category,
      })) ?? []);

    return {
      id: item.id,
      year: item.year,
      chapter,
      era,
      delta,
      tag,
      title,
      description,
      stats,
      awards: derivedAwards,
      assets: item.assets || [],
    };
  }), [initialYears]);

  const totalCount = processedItems.length;

  // Align ghost backgrounds horizontally to item cards
  const layoutGhosts = () => {
    if (!itemsContainerRef.current) return;
    const lefts = processedItems.map((_, i) => {
      const el = itemRefs.current[i];
      if (!el) return 0;
      return el.offsetLeft;
    });
    setGhostLefts(lefts);
  };

  // Horizontal scroll listener for active HUD and rail progress
  useEffect(() => {
    const container = itemsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const slideWidth = container.clientWidth;

      // One slide per viewport: active = nearest slide index
      const active = Math.min(
        processedItems.length - 1,
        Math.max(0, Math.round(container.scrollLeft / slideWidth))
      );

      setActiveIdx(active);

      if (railFillRef.current) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const percent = maxScroll > 0 ? (container.scrollLeft / maxScroll) * 100 : 0;
        railFillRef.current.style.width = `${percent}%`;
      }
    };

    // Strict one-slide-per-gesture navigation.
    //   - intendedIdxRef tracks the slide we're navigating *to* (stable, never reads mid-animation scrollLeft)
    //   - wheelLock blocks during the smooth-scroll animation
    //   - gesture detection blocks trackpad momentum from firing a second slide change
    let wheelLock = false;
    let unlockTimer: ReturnType<typeof setTimeout> | null = null;
    let lastWheelAt = 0;
    let gestureFired = false;
    const GESTURE_GAP_MS = 280; // wheel events closer than this are part of the same gesture (momentum)
    const ANIM_LOCK_MS = 800;

    const moveBy = (direction: 1 | -1): boolean => {
      const next = intendedIdxRef.current + direction;
      if (next < 0 || next >= processedItems.length) return false;

      intendedIdxRef.current = next;
      container.scrollTo({ left: next * container.clientWidth, behavior: "smooth" });

      wheelLock = true;
      if (unlockTimer) clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        wheelLock = false;
      }, ANIM_LOCK_MS);
      return true;
    };

    const handleWheel = (e: WheelEvent) => {
      const dominant = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(dominant) < 4) return;

      const direction: 1 | -1 = dominant > 0 ? 1 : -1;
      const wouldBeNext = intendedIdxRef.current + direction;
      if (wouldBeNext < 0 || wouldBeNext >= processedItems.length) return;

      // Always block native scroll while we own the gesture
      e.preventDefault();

      // Identify gesture boundaries by time gap between events
      const now = performance.now();
      const isNewGesture = now - lastWheelAt > GESTURE_GAP_MS;
      lastWheelAt = now;
      if (isNewGesture) gestureFired = false;

      if (gestureFired) return; // momentum from the same gesture — ignore
      if (wheelLock) return;    // animation still running

      gestureFired = true;
      moveBy(direction);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (wheelLock) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (moveBy(1)) e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (moveBy(-1)) e.preventDefault();
      } else if (e.key === "Home") {
        intendedIdxRef.current = 0;
        container.scrollTo({ left: 0, behavior: "smooth" });
        e.preventDefault();
      } else if (e.key === "End") {
        const last = processedItems.length - 1;
        intendedIdxRef.current = last;
        container.scrollTo({ left: last * container.clientWidth, behavior: "smooth" });
        e.preventDefault();
      }
    };

    // Touch-swipe: enforce one-slide-per-swipe so a fast fling can't skip slides
    let touchStartX = 0;
    let touchStartY = 0;
    let touchActive = false;
    let touchFired = false;
    const TOUCH_THRESHOLD = 40;

    const handleTouchStart = (e: TouchEvent) => {
      touchActive = true;
      touchFired = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchActive || touchFired) {
        e.preventDefault();
        return;
      }
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      // Commit only on a clearly horizontal swipe over the threshold
      if (Math.abs(dx) > TOUCH_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
        if (!wheelLock) {
          touchFired = true;
          moveBy(dx < 0 ? 1 : -1);
        }
      }
    };

    const handleTouchEnd = () => {
      touchActive = false;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", layoutGhosts);

    handleScroll();
    setTimeout(layoutGhosts, 300);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", layoutGhosts);
      if (unlockTimer) clearTimeout(unlockTimer);
    };
  }, [processedItems]);

  // Update HUD text details smoothly when active item changes
  useEffect(() => {
    const cur = processedItems[activeIdx];
    if (!cur) return;

    setHudData({
      year: String(cur.year),
      era: `${cur.chapter} · ${cur.era}`,
      delta: cur.delta,
      counter: `${String(activeIdx + 1).padStart(2, "0")} / ${String(totalCount).padStart(2, "0")}`,
    });
  }, [activeIdx, processedItems, totalCount]);

  // IntersectionObserver for reveal fade-in animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        root: itemsContainerRef.current,
        rootMargin: "0px -15% 0px -10%",
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [processedItems]);

  // Snap to slide idx (one viewport per year)
  const scrollToItem = (idx: number) => {
    const container = itemsContainerRef.current;
    if (container) {
      intendedIdxRef.current = idx;
      container.scrollTo({ left: idx * container.clientWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="timeline-section" id="timeline" ref={containerRef}>
      {/* Sticky HUD (Left/Desktop) */}
      <div className="timeline-hud" aria-hidden="true">
        <div>
          <div className="era" id="hudEra">
            {hudData.era}
          </div>
          <div className="progress">
            <i
              id="hudProgress"
              style={{
                width: `${((activeIdx + 1) / totalCount) * 100}%`,
              }}
            ></i>
          </div>
          <div className="counter" id="hudCounter">
            {hudData.counter}
          </div>
        </div>
        <div className="year-row">
          <div
            className="year"
            id="hudYear"
            style={{
              transition: "opacity 0.2s ease",
            }}
          >
            {hudData.year}
          </div>
          <div className="delta" id="hudDelta">
            {hudData.delta}
          </div>
        </div>
      </div>

      {/* Horizontal timeline items (with ghost years inside the scroll container) */}
      <div className="timeline-items" id="items" ref={itemsContainerRef}>
        <div className="ghost-years-container" id="ghostYears" aria-hidden="true">
          {processedItems.map((item, i) => (
            <span
              key={`ghost-${item.year}`}
              style={{
                fontSize: `${220 + (i % 3) * 30}px`,
                top: `${i % 2 === 0 ? -40 : -10}px`,
                left: `${ghostLefts[i] ?? 0}px`,
              }}
            >
              {item.year}
            </span>
          ))}
        </div>
        {processedItems.map((item, idx) => (
          <article
            key={item.id}
            className="timeline-item"
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
          >
            <div className="stamp">
              {item.chapter}
              <span className="y">{item.year}</span>
            </div>
            <div className="body">
              {/* Floating media collage around the card — always 4 pieces in
                  tl/tr/bl/br via buildYearMedia (DB assets → curated → fallback). */}
              <MediaCollage
                media={buildYearMedia(item.year, item.assets)}
                year={item.year}
                onVideoOpen={setActiveVideo}
              />

              <div className="card">
                <div className="tag">
                  <span className="pulse"></span>
                  {item.tag}
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>

                {/* Per-year award list — each with its own icon */}
                {item.awards && item.awards.length > 0 && (
                  <div className="card-awards">
                    <div className="card-awards-label">
                      Awards & Recognition · {item.awards.length}
                    </div>
                    <ul>
                      {item.awards.map((award, aIdx) => (
                        <li key={`award-${idx}-${aIdx}`} style={{ transitionDelay: `${0.75 + aIdx * 0.05}s` }}>
                          <span className="award-icon">
                            <AwardIcon name={award.icon} />
                          </span>
                          <div className="award-text">
                            <span className="award-name">{award.name}</span>
                            <span className="award-cat">{award.category}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="stats">
                  {item.stats.map((stat, sIdx) => (
                    <div className="stat" key={`stat-${idx}-${sIdx}`}>
                      <div className="k">{stat.label}</div>
                      <div className="v">
                        {stat.value.startsWith("$") || stat.value.includes("%") ? (
                          <em>{stat.value}</em>
                        ) : (
                          stat.value
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Scroll tracker highlight bar overlay */}
        <div id="timeline-railFill" ref={railFillRef}></div>
      </div>

      {/* Right floating mini navigator */}
      <aside className="timeline-mini" id="mini" aria-hidden="true">
        {processedItems.map((item, i) => (
          <button
            key={`mini-${item.year}`}
            type="button"
            className={`node ${i === activeIdx ? "is-active" : ""}`}
            onClick={() => scrollToItem(i)}
          >
            <span className="pip"></span>
            <span className="label">{item.year}</span>
          </button>
        ))}
      </aside>

      {/* Full-screen Media Lightbox Popup */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6 transition-all duration-300 animate-in fade-in"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center justify-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-all"
              aria-label="Close image popup"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-950 flex items-center justify-center shadow-2xl">
              <img
                src={activeMedia.url}
                alt={activeMedia.caption || "Full scale asset"}
                className="max-h-[80vh] w-auto max-w-full object-contain"
              />
            </div>
            {activeMedia.caption && (
              <p className="mt-4 text-center text-slate-300 text-sm font-semibold tracking-wide bg-slate-900/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/5">
                {activeMedia.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Video Modal — opens when a video tile is clicked */}
      {activeVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <div className="video-modal-shell" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="video-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
            <div className="video-modal-player">
              {activeVideo.embedUrl ? (
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : activeVideo.videoUrl ? (
                <video src={activeVideo.videoUrl} controls autoPlay playsInline />
              ) : null}
            </div>
            <div className="video-modal-caption">
              <span className="video-modal-eyebrow">Rubenius · REDS</span>
              <h3>{activeVideo.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
