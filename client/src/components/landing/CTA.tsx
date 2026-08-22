import AuthButtons from "../auth/AuthButtons";

const CTA = () => {
  return (
    <section className="relative border-t border-zinc-900 py-24 text-center">
      <h2 className="text-4xl font-bold">
        Stop wondering what to revise.
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-zinc-400">
        Let ReviseDSA organize your solved problems
        and help you remember what matters.
      </p>

      <div className="mt-8 flex justify-center">
        <AuthButtons />
      </div>
    </section>
  );
};

export default CTA;