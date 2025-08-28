import {
  type FunctionComponent,
  type HTMLAttributes,
  type PropsWithChildren,
  type SVGProps
} from "react";
import CheckedIcon from "../../public/svgs/checkbox-checked.svg?react";
import IndeterminateIcon from "../../public/svgs/checkbox-indeterminate.svg?react";
import UncheckedIcon from "../../public/svgs/checkbox-unchecked.svg?react";

export function Checkbox({
  checked,
  children,
  className,
  indeterminate,
  onChange,
  ...rest
}: PropsWithChildren<
  Omit<HTMLAttributes<HTMLElement>, "defaultChecked" | "onChange"> & {
    checked: boolean;
    className?: string;
    indeterminate?: boolean;
    onChange: (value: boolean) => void;
  }
>) {
  let IconElement: FunctionComponent<SVGProps<SVGSVGElement>>;
  let iconClassName: string;
  if (indeterminate) {
    IconElement = IndeterminateIcon;
    iconClassName = "fill-white";
  } else if (checked) {
    IconElement = CheckedIcon;
    iconClassName = "fill-blue-600";
  } else {
    IconElement = UncheckedIcon;
    iconClassName = "fill-slate-600";
  }

  return (
    <label
      className={`cursor-pointer rounded-lg flex flex-row items-center outline-none group ${className}`}
      data-focus-within
      {...rest}
    >
      <input
        checked={checked}
        className="w-0 h-0"
        onChange={(event) => {
          onChange(event.currentTarget.checked);
        }}
        type="checkbox"
      />
      <IconElement className={iconClassName} />
      {children && <>&nbsp;{children}</>}
    </label>
  );
}
