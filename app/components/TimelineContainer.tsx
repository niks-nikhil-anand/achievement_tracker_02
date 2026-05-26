"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  },
};

// Floating media collage shown around each year's card (Unsplash + a few sample videos)
type MediaSlot = "tl" | "tr" | "bl" | "br" | "ml" | "mr";
type Media =
  | { type: "image"; url: string; alt: string; pos: MediaSlot }
  | { type: "video"; url: string; poster?: string; alt: string; pos: MediaSlot };

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
    { type: "image", url: RB.redsShift12, alt: "REDS Shift — distance", pos: "br" },
  ],
  2021: [
    { type: "image", url: RB.redsShift21, alt: "Lexus public-utility design", pos: "tl" },
    { type: "image", url: RB.redsShift12, alt: "Kyoorius product design", pos: "tr" },
    { type: "image", url: RB.untitled3, alt: "Eldrock residential public", pos: "bl" },
    { type: "image", url: RB.scaler, alt: "Design thinking", pos: "br" },
  ],
  2022: [
    { type: "image", url: RB.schneiderCase, alt: "Schneider Experience Centre", pos: "tl" },
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
    { type: "image", url: RB.schneider23, alt: "Spaceiux shopping space", pos: "bl" },
    { type: "image", url: RB.schneiderCard, alt: "Innovative experience centre", pos: "br" },
  ],
  2025: [
    { type: "image", url: RB.scaler, alt: "On going project — Scaler", pos: "tl" },
    { type: "image", url: RB.kewaunee, alt: "Current work — Kewaunee", pos: "tr" },
    { type: "image", url: RB.untitled3, alt: "Twenty-year anniversary", pos: "bl" },
    { type: "image", url: RB.redsShift12, alt: "REDS — still shaping memory", pos: "br" },
  ],
};

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
  assets: Array<{ id: number; url: string; caption: string | null; month: number }>;
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsContainerRef = useRef<HTMLDivElement | null>(null);
  const railFillRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

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

    let wheelLock = false;
    const handleWheel = (e: WheelEvent) => {
      // Convert vertical wheel into one-slide-at-a-time horizontal snap
      const dominant = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(dominant) < 8) return;

      const slideWidth = container.clientWidth;
      const currentIdx = Math.round(container.scrollLeft / slideWidth);
      const direction = dominant > 0 ? 1 : -1;
      const targetIdx = currentIdx + direction;

      // Let the page take over at the boundaries
      if (targetIdx < 0 || targetIdx >= processedItems.length) return;

      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      container.scrollTo({ left: targetIdx * slideWidth, behavior: "smooth" });
      setTimeout(() => {
        wheelLock = false;
      }, 600);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", layoutGhosts);

    handleScroll();
    setTimeout(layoutGhosts, 300);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", layoutGhosts);
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
              {/* Floating media collage around the card */}
              <div className="media-floats" aria-hidden="true">
                {(RUBENIUS_MEDIA[item.year] || []).map((m, mi) => (
                  <figure
                    key={`media-${item.year}-${mi}`}
                    className={`media-piece pos-${m.pos} ${m.type === "video" ? "is-video" : "is-image"}`}
                    style={{ animationDelay: `${mi * 90}ms` }}
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.url}
                        alt={m.alt}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <video
                        src={m.url}
                        poster={m.poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={m.alt}
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                        }}
                      />
                    )}
                    {m.type === "video" && (
                      <span className="media-badge" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        LIVE
                      </span>
                    )}
                  </figure>
                ))}
              </div>

              <div className="card">
                <div className="tag">
                  <span className="pulse"></span>
                  {item.tag}
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>

                {/* Optional Media Gallery inside cards */}
                {item.assets && item.assets.length > 0 && (
                  <div className="card-media">
                    {item.assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="media-thumb animate-in fade-in"
                        onClick={() => setActiveMedia({ url: asset.url, caption: asset.caption })}
                        title={asset.caption || "View image"}
                      >
                        <img src={asset.url} alt={asset.caption || "Timeline moment"} />
                      </div>
                    ))}
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
    </section>
  );
}
