import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function CustomSelect({
    className,
    options = [],
    value,
    onChange,
    placeholder = "Chọn...",
    disabled = false,
    defaultValue = "public", // ✅ thêm giá trị mặc định
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue);
    const selectRef = useRef(null);

    useEffect(() => {
        // ✅ Nếu không có value, set mặc định là "public"
        setSelectedValue(value || defaultValue);
    }, [value, defaultValue]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (option) => {
        setSelectedValue(option.value);
        onChange?.(option.value);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === selectedValue)
        || options.find(opt => opt.value === defaultValue);

    return (
        <div
            ref={selectRef}
            className={cn(
                "group/custom-select relative w-fit",
                disabled && "opacity-50 pointer-events-none"
            )}
            data-slot="custom-select-wrapper"
            {...props}
        >
            {/* Select Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                data-slot="custom-select-trigger"
                className={cn(
                    "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-[200px] flex items-center justify-between rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "hover:bg-accent/50",
                    isOpen && "border-ring ring-ring/50 ring-[3px]",
                    className
                )}
            >
                <span className={cn(!selectedOption && "text-muted-foreground")}>
                    {selectedOption?.label || placeholder}
                </span>
            </button>

            <ChevronDownIcon
                className={cn(
                    "text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none transition-transform",
                    isOpen && "rotate-180"
                )}
                aria-hidden="true"
                data-slot="custom-select-icon"
            />

            {/* Dropdown Options */}
            {isOpen && (
                <div
                    data-slot="custom-select-dropdown"
                    className={cn(
                        "absolute z-50 mt-1 w-full min-w-[200px] overflow-hidden rounded-md border border-input bg-popover shadow-lg animate-in fade-in-0 zoom-in-95"
                    )}
                >
                    <div className="max-h-[300px] overflow-y-auto p-1 space-y-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option)}
                                data-slot="custom-select-option"
                                className={cn(
                                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    "focus:bg-accent focus:text-accent-foreground",
                                    selectedValue === option.value && "bg-accent/50 font-medium"
                                )}
                            >
                                <span className="flex-1 text-left">{option.label}</span>
                                {selectedValue === option.value && (
                                    <CheckIcon className="size-4 ml-2 text-primary" />
                                )}
                            </button>
                        ))}
                        {options.length === 0 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Không có dữ liệu
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function CustomSelectOptGroup({ label, options = [], ...props }) {
    return (
        <div data-slot="custom-select-optgroup" {...props}>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {label}
            </div>
            {options.map((option) => (
                <div key={option.value} className="pl-2">
                    {option.label}
                </div>
            ))}
        </div>
    );
}


export { CustomSelect, CustomSelectOptGroup };

