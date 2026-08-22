import ProblemCard from "./ProblemCard";
import Stat from "./Stat";

const DashboardPreview = () => {
  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-28">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3 shadow-2xl shadow-indigo-500/10 backdrop-blur">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          {/* Browser Header */}
          <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-4">
            <div className="h-3 w-3 rounded-full bg-red-500/50" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
            <div className="h-3 w-3 rounded-full bg-green-500/50" />

            <span className="ml-4 text-sm text-zinc-500">
              app.revisedsa.com
            </span>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-[1fr_280px]">
            <div>
              <p className="text-sm text-zinc-500">
                Your revision queue
              </p>

              <h3 className="mt-1 text-2xl font-semibold">
                What should I revise?
              </h3>

              <div className="mt-6 space-y-3">
                <ProblemCard
                  title="Binary Tree Level Order Traversal"
                  difficulty="Medium"
                  revision="Revision #1"
                  priority="High Priority"
                />

                <ProblemCard
                  title="Merge Intervals"
                  difficulty="Medium"
                  revision="Revision #3"
                  priority="Revise Soon"
                />

                <ProblemCard
                  title="Two Sum"
                  difficulty="Easy"
                  revision="Revision #5"
                  priority="Completed"
                />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="font-semibold">
                Your Progress
              </h3>

              <div className="mt-6 space-y-5">
                <Stat label="Problems Saved" value={42} />
                <Stat label="Total Revisions" value={87} />
                <Stat label="Need Revision" value={8} />
                <Stat label="Mastered" value={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;