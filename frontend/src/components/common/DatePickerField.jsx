"use client";

import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Controller } from "react-hook-form";

function formatDate(date) {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
}

function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}

function DateInputField({ value, onChange, disabled }) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState();
    const [inputValue, setInputValue] = useState(value ? formatDate(value) : "");

    useEffect(() => {
        setInputValue(value ? formatDate(value) : "");
    }, [value]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val); // Cho phép nhập tạm thời

        const trimmed = val.trim();
        if (!trimmed) {
            onChange(undefined);
            return;
        }

        // parse chuỗi -> Date
        let parsed;
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            parsed = new Date(trimmed);
        } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
            const [d, m, y] = trimmed.split("/");
            parsed = new Date(`${y}-${m}-${d}`);
        }

        if (isValidDate(parsed)) {
            onChange(parsed);
            setMonth(parsed);
        }
    };

    return (
        <div className="relative flex gap-2">
            <Input
                id="birthDay"
                value={inputValue}
                placeholder="dd/mm/yyyy hoặc yyyy-mm-dd"
                disabled={disabled}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setOpen(true);
                    }
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={disabled}
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                        <CalendarIcon className="size-4" />
                        <span className="sr-only">Chọn ngày</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    sideOffset={8}
                >
                    <Calendar
                        mode="single"
                        selected={value}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                            onChange(date);
                            setInputValue(formatDate(date));
                            setOpen(false);
                        }}
                        disabled={(date) =>
                            date > new Date() || date.getFullYear() < 1900
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export function DateOfBirthField({ control, disabled }) {
    return (
        <div className="space-y-2">
            <Label htmlFor="birthDay">Ngày sinh</Label>
            <Controller
                control={control}
                name="birthDay"
                render={({ field }) => (
                    <DateInputField
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                    />
                )}
            />
        </div>
    );
}
