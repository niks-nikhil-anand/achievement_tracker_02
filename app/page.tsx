import { prisma } from "./lib/prisma";
import Header from "./components/Header";
import WorkflowCircle from "./components/WorkflowCircle";
import YearDetail from "./components/YearDetail";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) => {
  const years = await prisma.year.findMany({
    orderBy: { year: "asc" },
    select: { id: true, year: true },
  });

  const resolvedSearchParams = await searchParams;
  const selectedYear = resolvedSearchParams.year
    ? parseInt(resolvedSearchParams.year)
    : years[0]?.year || 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Header />
      <div className="space-y-8">
        <WorkflowCircle years={years} selectedYear={selectedYear} />
        <YearDetail selectedYear={selectedYear} />
      </div>
    </main>
  );
};

export default page;