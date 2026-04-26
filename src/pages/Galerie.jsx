import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GallerySection from "../components/GallerySection";

export default function Galerie() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-inter">
      <Navbar />
      <div className="pt-16">
        <GallerySection showAll />
      </div>
      <Footer />
    </div>
  );
}