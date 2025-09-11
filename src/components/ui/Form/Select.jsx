"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Check } from "lucide-react";

const Select = React.forwardRef(
  (
    {
      className,
      options = [],
      value,
      onChange,
      placeholder = "Select an option",
      searchable = false,
      disabled = false,
      error,
      success,
      label,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const selectRef = useRef(null);
    const searchRef = useRef(null);
    const optionRefs = useRef([]);

    const selectId = React.useId();

    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : options;

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        searchRef.current.focus();
      }
    }, [isOpen, searchable]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    const handleSelect = (option) => {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    };

    const scrollToHighlighted = () => {
      if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
        optionRefs.current[highlightedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    };

    useEffect(() => {
      scrollToHighlighted();
    }, [highlightedIndex]);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "block text-sm font-medium",
              error
                ? "text-red-400"
                : success
                  ? "text-green-400"
                  : "text-zinc-400",
            )}
          >
            {label}
          </label>
        )}

        <div className="relative" ref={selectRef}>
          <button
            id={selectId}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              "glass-input flex w-full items-center justify-between px-4 py-4 text-left",
              error && "border-red-400/40 bg-red-400/5",
              success && "border-green-400/40 bg-green-400/5",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
            ref={ref}
            {...props}
          >
            <span
              className={cn("truncate", !selectedOption && "text-zinc-500")}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-zinc-400 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </button>

          {isOpen && (
            <div className="glass-card absolute z-50 mt-2 max-h-60 w-full overflow-hidden rounded-2xl p-2">
              {searchable && (
                <div className="relative mb-2">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search options..."
                    className="w-full bg-transparent py-2 pr-4 pl-10 text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <button
                      key={option.value}
                      ref={(el) => (optionRefs.current[index] = el)}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors",
                        highlightedIndex === index
                          ? "bg-zinc-900/30 text-zinc-100"
                          : "text-zinc-300 hover:bg-zinc-900/30 hover:text-zinc-100",
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {value === option.value && (
                        <Check className="h-4 w-4 text-violet-400" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-zinc-400">
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
