import { BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
          <BrainCircuit size={22} />
        </div>

        <h1 className="text-xl font-bold">
          Revise<span className="text-indigo-400">DSA</span>
        </h1>
      </div>
    <Link to={"/login"}>
      <button
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium transition hover:bg-zinc-800"
      >
        Get Started
      </button>
    </Link>
    </nav>
  );
};

export default Navbar;