import Hero from "../components/landing/Hero";
import DashboardPreview from "../components/landing/DashboardPreview";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import Navbar from "../components/landing/Navbar";

const LandingPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <Navbar />

      <Hero />

      <DashboardPreview />

      <Features />

      <CTA />

      <Footer />
    </main>
  );
};

export default LandingPage;
