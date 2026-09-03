import { Link } from "react-router-dom";
import { BrainCircuit, Moon } from "lucide-react";
import { authClient } from "../lib/auth-client";

const Login = () => {

const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/dashboard",
    });
  };

  const handleGithubLogin = async () => {
    console.log("clicked")
    const result = await authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:5173/dashboard",
    });
    console.log("GitHub login result:", result);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link
          to="/"
          className="mb-10 flex items-center justify-center gap-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500">
            <BrainCircuit size={24} />
          </div>

          <h1 className="text-2xl font-bold">
            Revise<span className="text-indigo-400">DSA</span>
          </h1>
        </Link>

        {/* Auth Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              Welcome back
            </h2>

            <p className="mt-3 text-zinc-400">
              Continue your DSA revision journey.
            </p>
          </div>

          {/* Auth Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 font-medium text-black transition hover:bg-zinc-200"
            >
              <GoogleIcon />

              Continue with Google
            </button>

            <button
              onClick={handleGithubLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-3.5 font-medium text-white transition hover:bg-zinc-800"
            >
              <Moon size={20} />

              Continue with GitHub
            </button>
          </div>

          {/* Signup */}
          <p className="mt-8 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-zinc-500">
          By continuing, you agree to start organizing and
          revising your DSA problems smarter.
        </p>
      </div>
    </main>
  );
};

const GoogleIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.79h3.14c1.84-1.7 2.92-4.2 2.92-7.75Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.62 0 4.82-.87 6.43-2.36l-3.14-2.79c-.87.58-1.99.92-3.29.92-2.53 0-4.68-1.71-5.45-4.01H3.31v2.88A9.72 9.72 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.55 13.51A5.85 5.85 0 0 1 6.25 12c0-.52.1-1.02.3-1.51V7.61H3.31A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.06 4.39l3.24-2.88Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.48c1.42 0 2.7.49 3.7 1.45l2.77-2.77C16.81 3.61 14.62 2.25 12 2.25a9.72 9.72 0 0 0-8.69 5.36l3.24 2.88c.77-2.3 2.92-4.01 5.45-4.01Z"
      />
    </svg>
  );
};

export default Login;