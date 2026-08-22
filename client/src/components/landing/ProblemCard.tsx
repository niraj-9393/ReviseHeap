import { ArrowRight } from "lucide-react";

interface ProblemCardProps {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  revision: string;
  priority?: "High Priority" | "Revise Soon" | "Completed";
}

const ProblemCard = ({
  title,
  difficulty,
  revision,
  priority,
}: ProblemCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{title}</h4>

          {priority === "High Priority" && (
            <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-400">
              High
            </span>
          )}
        </div>

        <div className="mt-2 flex gap-3 text-xs text-zinc-500">
          <span>{difficulty}</span>
          <span>•</span>
          <span>{revision}</span>
        </div>
      </div>

      <ArrowRight
        className="text-zinc-500"
        size={20}
      />
    </div>
  );
};

export default ProblemCard;