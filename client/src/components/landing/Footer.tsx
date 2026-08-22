const Footer = () => {
  return (
    <footer className="relative border-t border-zinc-900 py-8 text-center text-sm text-zinc-500">
      © {new Date().getFullYear()} ReviseDSA.
      Built for DSA learners.
    </footer>
  );
};

export default Footer;