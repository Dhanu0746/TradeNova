import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";

export default function Home() {
  return (
    <div style={{ background: "#000", color: "white" }}>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
    </div>
  );
}