import { prisma } from "./lib/prisma";
import TimelineCanvas from "./components/TimelineCanvas";
import TimelineContainer from "./components/TimelineContainer";
import AddAchievement from "./components/AddAchievement";

export const revalidate = 0; // Disable static rendering caching to allow dynamic updates

export default async function Home() {
  let dbYears: Array<{
    id: number;
    year: number;
    about: string | null;
    achievements: Array<{
      id: number;
      title: string;
      category: string;
      date: Date | string;
    }>;
    assets: Array<{
      id: number;
      url: string;
      caption: string | null;
      month: number;
    }>;
  }> = [];

  try {
    dbYears = await prisma.year.findMany({
      include: {
        achievements: {
          orderBy: { date: "asc" },
        },
        assets: {
          orderBy: { month: "asc" },
        },
      },
      orderBy: { year: "asc" },
    });
  } catch (error) {
    console.warn(
      "Database connection could not be established or has not been initialized. Falling back to static Rubenius timeline data.",
      error
    );
  }

  return (
    <main className="h-screen relative overflow-hidden bg-(--ink-2) text-(--text-1) select-none">
      <div className="timeline-backdrop" />
      <TimelineCanvas />

      {/* Rubenius brand + REDS — top-right corner overlay */}
      <a
        href="https://www.rubenius.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="rb-brand"
        aria-label="Rubenius Interiors — Rubenius Experiential Design System"
      >
        <span className="rb-mark" aria-hidden="true">
          <img
            src="https://cdn.prod.website-files.com/61bcac7a8c69b70a365c2b95/61bcd261bf0f713861a292f1_rubenius-logo.svg"
            alt=""
          />
        </span>
        <span className="rb-meta">
          <span className="rb-reds">
            <span className="rb-reds-dot" />
            REDS<sup>™</sup>
          </span>
          <span className="rb-tag">Rubenius Experiential Design System</span>
        </span>
      </a>

      <AddAchievement />

      <TimelineContainer initialYears={dbYears} />
    </main>
  );
}
