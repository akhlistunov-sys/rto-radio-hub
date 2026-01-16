import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "mediaplanner", label: "МЕДИАПЛАНЕР" },
  { id: "calculator", label: "КАЛЬКУЛЯТОР" },
  { id: "statistics", label: "СТАТИСТИКА" },
  { id: "about", label: "О НАС" },
];

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="flex items-center justify-center p-4">
      <div className="inline-flex items-center bg-card rounded-full p-1.5 shadow-card border border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
