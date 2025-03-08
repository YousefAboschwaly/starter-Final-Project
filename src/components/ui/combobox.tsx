"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ComboboxProps {
  items?: { id: number; code?: string; name: string }[];
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

export function Combobox({
  items = [],
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  touched,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      if (!item?.name) return false;
      return (
        item.name.toLowerCase().includes(query) ||
        (item.code && item.code.toLowerCase().includes(query))
      );
    });
  }, [items, searchQuery]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const selectedId = Number.parseInt(currentValue, 10);
      // Only update if the value is actually changing
      if (selectedId !== value) {
        onChange(selectedId);
      }
      setSearchQuery("");
      setOpen(false);
    },
    [onChange, value]
  );

  const handleSearchChange = React.useCallback((search: string) => {
    setSearchQuery(search || "");
  }, []);

  const selectedItem = React.useMemo(
    () => items.find((item) => item.id === value),
    [items, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${
            error && touched ? "border-red-500" : ""
          }`}
          disabled={disabled}
        >
          {selectedItem?.name ?? placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            onValueChange={handleSearchChange}
            value={searchQuery}
          />
          <CommandList>
            {filteredItems.length === 0 ? (
              <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id.toString()}
                    onSelect={(value) => handleSelect(value)}
                  >
                    <Check
                      className={`
                        mr-2 h-4 w-4
                        ${value === item.id ? "opacity-100" : "opacity-0"}
                      `}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
