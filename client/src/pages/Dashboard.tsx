
import {
  BrainCircuit,
  CheckCircle2,
  Flame,
  Target,
  Clock3,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto max-w-7xl px-6 pb-12">
        {/* Welcome Section */}
        <section className="mb-8 pt-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-indigo-400">
                  <BrainCircuit size={20} />
                  <span className="text-sm font-medium">
                    Your DSA workspace
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                  Welcome back 👋
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                  Keep your problem-solving skills sharp. Review your progress
                  and continue where you left off.
                </p>
              </div>

              <Link
                to="/problems"
                className="flex w-fit items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-600"
              >
                Continue Solving
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <CheckCircle2 size={21} />
            </div>

            <p className="text-sm text-zinc-400">Problems Solved</p>
            <h3 className="mt-1 text-2xl font-bold">0</h3>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Target size={21} />
            </div>

            <p className="text-sm text-zinc-400">Problems to Revise</p>
            <h3 className="mt-1 text-2xl font-bold">0</h3>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Flame size={21} />
            </div>

            <p className="text-sm text-zinc-400">Current Streak</p>
            <h3 className="mt-1 text-2xl font-bold">0 days</h3>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock3 size={21} />
            </div>

            <p className="text-sm text-zinc-400">This Week</p>
            <h3 className="mt-1 text-2xl font-bold">0 hrs</h3>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revision */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Revision Queue</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Problems that are ready for revision.
                </p>
              </div>

              <Target size={21} className="text-indigo-400" />
            </div>

            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
                <BookOpen size={22} className="text-zinc-400" />
              </div>

              <h4 className="font-medium">Your revision queue is empty</h4>

              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Solve some problems and mark them for revision. They will
                appear here when it's time to review them.
              </p>

              <Link
                to="/problems"
                className="mt-5 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Explore Problems →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Quick Actions</h3>

            <p className="mt-1 text-sm text-zinc-400">
              Jump back into your practice.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/problems"
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-indigo-500/40 hover:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <BookOpen size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Browse Problems</p>
                    <p className="text-xs text-zinc-500">
                      Find something to solve
                    </p>
                  </div>
                </div>

                <ArrowRight size={16} className="text-zinc-500" />
              </Link>

              <Link
                to="/problems"
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-indigo-500/40 hover:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <BrainCircuit size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Start Revision</p>
                    <p className="text-xs text-zinc-500">
                      Review previous problems
                    </p>
                  </div>
                </div>

                <ArrowRight size={16} className="text-zinc-500" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
