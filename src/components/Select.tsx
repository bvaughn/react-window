import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { cn } from "../utils/cn";

export type Option<Value extends string> = {
  label: string;
  value: Value;
};

export function Select<Value extends string>({
  className,
  defaultValue,
  onChange,
  options,
  placeholder = "",
  value
}: {
  className?: string;
  defaultValue?: Option<Value> | undefined;
  onChange: (value: Option<Value>) => void;
  options: Option<Value>[];
  placeholder?: string;
  value: Option<Value> | undefined;
}) {
  return (
    <Listbox value={value ?? defaultValue} onChange={onChange}>
      <div className={`relative ${className}`}>
        <ListboxButton
          className="w-full h-9 text-left rounded-md bg-black/30 border border-2 border-transparent py-1 px-2 outline-none focus:border-teal-300"
          data-focus
        >
          {value?.label ? (
            <span className="block truncate">{value.label}</span>
          ) : (
            <span className="block truncate text-slate-500">{placeholder}</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions
            className="absolute z-10 mt-1 max-h-50 w-full overflow-auto rounded-md py-1 bg-black/90"
            data-focus
          >
            {options.map((option, index) => (
              <ListboxOption
                key={index}
                className={cn(
                  "relative cursor-pointer select-none h-7 py-1 px-2 text-slate-300 border-none!",
                  "data-focus:text-teal-300 data-focus:bg-black",
                  "data-active:text-teal-300 data-active:bg-black",
                  "data-selected:text-teal-300 data-selected:font-bold"
                )}
                value={option}
              >
                {option.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
