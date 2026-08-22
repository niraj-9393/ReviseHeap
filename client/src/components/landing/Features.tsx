import {
  BrainCircuit,
  Code2,
  RotateCcw,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      icon: <Code2 />,
      title: "Save Problems",
      description:
        "Save problems from LeetCode and GeeksforGeeks with their difficulty.",
    },
    {
      icon: <RotateCcw />,
      title: "Track Revisions",
      description:
        "Keep track of how many times you have revised every problem.",
    },
    {
      icon: <BrainCircuit />,
      title: "Smart Priority",
      description:
        "Know exactly which problem needs revision based on difficulty and revision history.",
    },
  ];

  return (
    <section className="relative border-t border-zinc-900 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-medium text-indigo-400">
            SIMPLE BUT POWERFUL
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Your DSA revision system.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;