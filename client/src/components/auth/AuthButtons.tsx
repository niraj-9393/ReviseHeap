import { ArrowRight, Moon,  } from "lucide-react";

interface AuthButtonsProps {
  variant?: "default" | "compact";
}

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

const AuthButtons = ({
  variant = "default",
}: AuthButtonsProps) => {
  const handleGoogleLogin = (): void => {
    // window.location.href =
    //   "http://localhost:5000/api/auth/google";
  };

  const handleGithubLogin = (): void => {
    // window.location.href =
    //   "http://localhost:5000/api/auth/github";
  };

  return (
    <div
      className={`flex gap-3 ${
        variant === "compact"
          ? "flex-col"
          : "flex-col sm:flex-row"
      }`}
    >
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 font-medium text-black transition hover:bg-zinc-200"
      >
        <GoogleIcon />

        Continue with Google

        {variant === "default" && (
          <ArrowRight size={18} />
        )}
      </button>

      <button
        onClick={handleGithubLogin}
        className="flex items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3.5 font-medium transition hover:bg-zinc-800"
      >
        <Moon size={20} />

        Continue with GitHub
      </button>
    </div>
  );
};

export default AuthButtons;