import {
  type FunctionComponent,
  type HTMLAttributes,
  type PropsWithChildren,
  type SVGProps
} from "react";
import CheckedIcon from "../../public/svgs/radio-checked.svg?react";
import UncheckedIcon from "../../public/svgs/radio-unchecked.svg?react";

export function Radio<Value extends string>({
  checked,
  children,
  className,
  name,
  onChange,
  value,
  ...rest
}: PropsWithChildren<
  Omit<HTMLAttributes<HTMLElement>, "defaultChecked" | "onChange"> & {
    checked: boolean;
    name: string;
    onChange: (value: Value) => void;
    value: Value;
  }
>) {
  let IconElement: FunctionComponent<SVGProps<SVGSVGElement>>;
  let iconClassName: string;
  if (checked) {
    IconElement = CheckedIcon;
    iconClassName = "fill-blue-600";
  } else {
    IconElement = UncheckedIcon;
    iconClassName = "fill-slate-600";
  }

  return (
    <label
      className={`cursor-pointer flex flex-row gap-2 outline-none group ${className}`}
      data-focus
      {...rest}
    >
      <input
        checked={checked}
        className="w-0 h-0"
        name={name}
        onChange={() => {
          onChange(value);
        }}
        type="radio"
        value={value}
      />
      <IconElement
        className={`${iconClassName} rounded-full outline-2 outline-transparent group-focus-within:outline-blue-600`}
      />
      {children}
    </label>
  );
}
