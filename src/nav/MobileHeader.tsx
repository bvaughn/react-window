import { Bars3Icon } from "@heroicons/react/20/solid";
import { NavLink } from "react-router-dom";
import GitHubIcon from "../../public/svgs/github.svg?react";
import NpmHubIcon from "../../public/svgs/npm.svg?react";
import { ExternalLink } from "../components/ExternalLink";
import { useNavStore } from "../hooks/useNavStore";

const defaultStyle = "px-1 h-6 flex flex-row items-center overflow-y-hidden";
const primaryLink = `${defaultStyle}`;
const secondaryLink = `${defaultStyle} text-neutral-600! hover:text-neutral-400!`;

export function MobileHeader() {
  const { toggle } = useNavStore();

  return (
    <div className="md:hidden h-10 absolute w-full z-10 flex items-center px-2 py-1 text-xl flex flex-row flex-wrap items-center gap-2 bg-neutral-900 border-b border-b-neutral-800">
      <NavLink className={primaryLink} to="/">
        react-window
      </NavLink>
      <div className="grow" />
      <ExternalLink
        className={secondaryLink}
        href="https://www.npmjs.com/package/react-window"
      >
        <NpmHubIcon className="w-6 h-6 " />
      </ExternalLink>
      <ExternalLink
        className={secondaryLink}
        href="https://github.com/bvaughn/react-window"
      >
        <GitHubIcon className="w-4 h-4 " />
      </ExternalLink>

      <button className={`${primaryLink} cursor-pointer`} onClick={toggle}>
        <Bars3Icon className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
}
