"use client"

import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Option = { id: string; label: string }

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  noun = "item",
}: {
  options: readonly Option[]
  value: string[]
  onChange: (next: string[]) => void
  placeholder: string
  noun?: string
}) {
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          <span className={value.length ? "" : "text-muted-foreground"}>
            {value.length === 0
              ? placeholder
              : `${value.length} ${noun}${value.length > 1 ? "s" : ""} selected`}
          </span>
          <ChevronsUpDown className="size-4 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        align="start"
      >
        <ul className="flex max-h-64 flex-col overflow-y-auto">
          {options.map((option) => (
            <li key={option.id}>
              <Label
                htmlFor={`opt-${option.id}`}
                className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md p-2 font-normal"
              >
                <Checkbox
                  id={`opt-${option.id}`}
                  checked={value.includes(option.id)}
                  onCheckedChange={() => toggle(option.id)}
                />
                {option.label}
              </Label>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
