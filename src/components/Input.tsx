import type { InputHTMLAttributes, PropsWithChildren } from "react";

export function Input<Type extends string>({
  children,
  className,
  onChange,
  value,
  ...rest
}: PropsWithChildren<
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    className?: string;
    onChange: (value: Type) => void;
    value: Type;
  }
>) {
  return (
    <input
      className={`rounded-sm text-sm bg-neutral-900 border border-neutral-700 py-1 px-2 outline-none focus:border-blue-300 ${className}`}
      onChange={(event) => {
        onChange(event.currentTarget.value as Type);
      }}
      value={value}
      {...rest}
    >
      {children}
    </input>
  );
}
