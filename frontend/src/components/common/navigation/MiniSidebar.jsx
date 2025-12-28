import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MiniSidebar = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const sections = [
        {
            id: "tuy_chon",
            title: "TÙY CHỌN",
            items: [
                { icon: "⚙️", label: "Cài đặt" },
                { icon: "👁️", label: "Chế độ hiển thị" },
                { icon: "☀️", label: "Sáng" },
                { icon: "🌙", label: "Tối" },
                { icon: "💻", label: "Hệ thống" },
            ]
        }
    ];

    const toggleSection = (id) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    return (
        <div className="px-3 py-4 space-y-3">
            {sections.map((section) => (
                <div key={section.id} className="rounded-lg border border-border/20 bg-card/30">
                    {/* Section Header */}
                    <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary/30 transition-colors rounded-t-lg"
                    >
                        <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                            {section.title}
                        </span>
                        <ChevronDown
                            className={cn(
                                "size-4 text-foreground/40 transition-transform duration-300",
                                expandedSection === section.id && "rotate-180"
                            )}
                        />
                    </button>

                    {/* Section Items */}
                    {expandedSection === section.id && (
                        <div className="border-t border-border/20 px-2 py-2 space-y-1">
                            {section.items.map((item, idx) => (
                                <Button
                                    key={idx}
                                    variant="ghost"
                                    className="w-full justify-start text-sm gap-2 text-foreground/70 hover:text-foreground hover:bg-secondary/40 py-1.5"
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MiniSidebar;
