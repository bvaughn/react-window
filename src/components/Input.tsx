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
      className={`rounded-md bg-black/30 border border-2 border-transparent py-1 px-2 outline-none focus:border-emerald-300 ${className}`}
      data-focus
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
