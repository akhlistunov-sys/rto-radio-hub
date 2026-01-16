import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import MediaPlanner from "@/components/sections/MediaPlanner";
import Calculator from "@/components/sections/Calculator";
import Statistics from "@/components/sections/Statistics";
import About from "@/components/sections/About";

const Index = () => {
  const [activeTab, setActiveTab] = useState("mediaplanner");

  const renderContent = () => {
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
        return <MediaPlanner />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
