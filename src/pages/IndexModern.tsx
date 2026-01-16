import { useState } from "react";
import SidebarModern from "@/components/SidebarModern";
import Navigation from "@/components/Navigation";
import HeroSection3D from "@/components/HeroSection3D";
import MediaPlanner from "@/components/sections/MediaPlanner";
import Calculator from "@/components/sections/Calculator";
import Statistics from "@/components/sections/Statistics";
import About from "@/components/sections/About";

const IndexModern = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showHero, setShowHero] = useState(true);

  const handleGetStarted = () => {
    setShowHero(false);
    setActiveTab("calculator");
  };

  const renderContent = () => {
    if (showHero && !activeTab) {
      return <HeroSection3D onGetStarted={handleGetStarted} />;
    }

    switch (activeTab) {
      case "mediaplanner":
        return <MediaPlanner />;
      case "calculator":
        return <Calculator />;
      case "statistics":
        return <Statistics />;
      case "about":
        return <About />;
      default:
        return <HeroSection3D onGetStarted={handleGetStarted} />;
    }
  };

  const handleTabChange = (tab: string) => {
    setShowHero(false);
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <SidebarModern />
      <main className="flex-1 flex flex-col overflow-hidden">
        {!showHero && (
          <Navigation activeTab={activeTab || "calculator"} onTabChange={handleTabChange} />
        )}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default IndexModern;
