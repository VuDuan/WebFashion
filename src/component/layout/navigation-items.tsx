"use client";
import clsx from "clsx";
import Svg from "../icons/svg";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { open } from "fs";

export type NavigationItemProps = {
  title: string;
  icon?: string;
  href?: string;
  iconActive?: string;
  isCollapsed?: boolean;
  match?: boolean;
  check?: boolean;
  onClick?(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
  menuItem?: { title: string; icon: string; href: string }[];
};

const NavigationItem = function ({
  isCollapsed,
  href,
  title,
  icon,
  match,
  iconActive,
  check,
  onClick,
  menuItem,
}: NavigationItemProps) {
  const pathname = usePathname();

  const isActive =
    href === "/"
      ? pathname === href
      : pathname === href || pathname.includes(href!);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className={clsx(isCollapsed ? "relative" : "")}>
      <button
        onClick={() => {
          router.push(href!);
        }}
        className={clsx(
          "rounded-lg whitespace-nowrap overflow-hidden outline-none py-[3px] w-full text-base",
          isActive && !check && !isCollapsed ? " bg-[#D7D7EF]" : "",
          !isCollapsed ? "hover:bg-[#E7E7E7]" : ""
        )}
      >
        <div
          className={clsx(
            "flex",
            isCollapsed
              ? "group flex-col justify-center items-center relative"
              : "items-center gap-x-4 mx-4 space-x-4"
          )}
        >
          <span
            className={clsx(
              "p-2 rounded-lg",
              isCollapsed ? "hover:bg-[#E7E7E7]" : ""
            )}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {icon && <Svg src={icon} width={16} height={16} />}
          </span>

          {!isCollapsed && <span className="text-xs leading-6">{title}</span>}
        </div>
      </button>
      {isCollapsed && open && (
        <span
          className={clsx(
            "absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded  text-white text-xs whitespace-nowrap",
            " transition-opacity duration-200 z-50"
          )}
        >
          {title}
        </span>
      )}
    </div>
  );
};

export default NavigationItem;
