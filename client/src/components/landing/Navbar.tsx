
import { useState } from "react";
import { BrainCircuit, ChevronDown, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { authClient } from "../../lib/auth-client";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const handleLogout = async () => {
    await authClient.signOut();
    setShowProfile(false);
  };

  return (
    <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
          <BrainCircuit size={22} />
        </div>

        <h1 className="text-xl font-bold">
          Revise<span className="text-indigo-400">DSA</span>
        </h1>
      </Link>

      {/* Right Side */}
      {!isPending && (
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* dashboard */}
              <Link
                to="/dashboard"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium transition hover:bg-zinc-800"
              >
                Dashboard
              </Link>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 transition hover:bg-zinc-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase() || (
                      <User size={16} />
                    )}
                  </div>

                  <span className="hidden text-sm font-medium sm:block">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showProfile ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
                    {/* User Info */}
                    <div className="border-b border-zinc-800 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold">
                          {user.name?.charAt(0).toUpperCase() || (
                            <User size={18} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-zinc-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Sign In */}
              <Link
                to="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                Sign In
              </Link>

              {/* Create Account */}
              <Link
                to="/signup"
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
