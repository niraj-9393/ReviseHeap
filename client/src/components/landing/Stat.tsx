interface StatProps {
  label: string;
  value: string | number;
}

const Stat = ({ label, value }: StatProps) => {
  return (
    <div className="flex items-end justify-between">
      <span className="text-sm text-zinc-500">
        {label}
      </span>

      <span className="text-2xl font-bold">
        {value}
      </span>
    </div>
  );
};

export default Stat;