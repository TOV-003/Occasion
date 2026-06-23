import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from 'react';

interface CityComboboxProps {
  cities: string[];
  onSelect: (city: string) => void;
  placeholder?: string;
}

export default function CityCombobox({
  cities,
  onSelect,
  placeholder = "Search cities...",
}: CityComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.trim().length >= 2
      ? cities.filter((c) =>
        c.toLowerCase().includes(query.trim().toLowerCase())
      )
      : [];

  const showDropdown = open && query.trim().length >= 2;


  useEffect(() => {
    function setindex(index: number) {
      setActiveIndex(index);
    }
    setindex(-1);
  }, [query]);

  function handleSelect(city: string) {
    setQuery(city);
    setOpen(false);
    onSelect(city);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleBlur() {
    // Small delay so mousedown on an option fires before blur closes the dropdown
    setTimeout(() => setOpen(false), 100);
  }

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        autoComplete="off"
      />

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-inputbg border border-inputaccent rounded-lg overflow-hidden"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-2.5 text-sm opacity-50">
              No cities found
            </p>
          ) : (
            <ul className="max-h-56 overflow-y-auto">
              {filtered.map((city, i) => (
                <li
                  key={city}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(city);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer border-b border-inputaccent/40 last:border-none ${i === activeIndex
                    ? "bg-accent/20"
                    : "hover:bg-inputbg/60"
                    }`}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
