import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";

const ScrollToTop = ({ showScrollTop, onScrollTop }) => {
    return (
        <Button
            onClick={onScrollTop}
            className={`fixed bottom-5 right-120 z-[50] bg-primary text-white p-3 h-10 rounded-full shadow-lg transition-all duration-300
            ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
        >
            <ArrowUp className="h-5 w-5 animate-bounce" />
        </Button>
    );
};

export default ScrollToTop;
