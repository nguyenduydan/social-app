import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

const AnimatedIcon = ({ icon, label, onClick, badgeCount }) => {
    const sizedIcon = React.cloneElement(icon, {
        className: `size-5 md:size-6 ${icon.props.className || ''}`,
    });

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={onClick}
                    className="relative flex w-10 h-10 justify-center items-center rounded-full transition-transform duration-300 ease-out
                     text-foreground/60 dark:text-foreground/70 hover:text-foreground
                     hover:bg-secondary/40 dark:hover:bg-muted/50 hover:scale-110
                     active:scale-95"
                >
                    {sizedIcon}
                    {badgeCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {badgeCount > 9 ? '9+' : badgeCount}
                        </Badge>
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default AnimatedIcon;
