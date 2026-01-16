import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import MediaPlanner from "@/components/sections/MediaPlanner";
import Calculator from "@/components/sections/Calculator";
import Statistics from "@/components/sections/Statistics";
import About from "@/components/sections/About";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

// Lazy load modern version
import IndexModern from "./IndexModern";

const Index = () => {
  const [activeTab, setActiveTab] = useState("mediaplanner");
  const [designVersion, setDesignVersion] = useState<"light" | "dark">("light");

  if (designVersion === "dark") {
    return (
      <div className="relative">
        <IndexModern />
        {/* Design switcher */}
        <Button
          onClick={() => setDesignVersion("light")}
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Palette className="w-4 h-4" />
          Светлая версия
        </Button>
      </div>
    );
  }

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
    <div className="flex min-h-screen bg-background relative">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </main>
      
      {/* Design switcher */}
      <Button
        onClick={() => setDesignVersion("dark")}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 gap-2"
      >
        <Palette className="w-4 h-4" />
        Тёмная 3D версия
      </Button>
    </div>
  );
};

export default Index;
