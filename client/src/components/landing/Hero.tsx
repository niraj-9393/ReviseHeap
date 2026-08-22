import { Sparkles } from "lucide-react";
import AuthButtons from "../auth/AuthButtons";

const Hero = () => {
  return (
    <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-20 text-center md:pt-28">
      <div className="mb-6 flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
        <Sparkles size={15} />
        Never forget a solved problem again
      </div>

      <h2 className="max-w-5xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
        Solve problems.
        <br />

        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          Revise the right ones.
        </span>
      </h2>

      <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
        Save your LeetCode and GeeksforGeeks problems,
        track your revisions, and always know exactly
        which problem you should revise next.
      </p>

      <div className="mt-10">
        <AuthButtons />
      </div>
    </section>
  );
};

export default Hero;