import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

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
  value,
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
      <div className={`relative text-sm ${className}`}>
        <ListboxButton className="w-full cursor-default bg-neutral-900 border border-neutral-700 rounded-sm py-1 pl-2 pr-6 text-left outline-none focus:border-blue-300">
          {value ? (
            <span className="block truncate">{value.label}</span>
          ) : (
            <span className="block truncate text-neutral-500">
              {placeholder}
            </span>
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
          <ListboxOptions className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-sm py-1 bg-neutral-900 outline-none border border-neutral-700 focus:border-blue-300">
            {options.map((option, index) => (
              <ListboxOption
                key={index}
                className="relative cursor-default select-none py-1 px-2 text-neutral-300 data-active:text-white data-active:bg-neutral-800 data-selected:text-blue-500"
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
