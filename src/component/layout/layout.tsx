"use client";
import React, { useState, useRef } from "react";
import NavigationItem, { NavigationItemProps } from "./navigation-items";
import clsx from "clsx";
import Svg from "../icons/svg";
import Avatar from "../common/avatar";

// Danh sách navigation phía trên
const navItems: NavigationItemProps[] = [
  { title: "Dashboard", href: "/dashboard", icon: "/icons/navbar/chart-histogram.svg" },
  { title: "Product", href: "/product", icon: "/icons/navbar/chart-histogram.svg" },
  { title: "Order", href: "/order", icon: "/icons/navbar/chart-histogram.svg" },
  { title: "Statistic", href: "/statisticts", icon: "/icons/navbar/chart-histogram.svg" },
  { title: "Supplier", href: "/supliers", icon: "/icons/navbar/chart-histogram.svg" },
  { title: "Products", href: "/products", icon: "/icons/navbar/chart-histogram.svg" },
  { title: "Voucher", href: "/voucher", icon: "/icons/navbar/chart-histogram.svg" },
  { title: "Evaluate", href: "/evaluate", icon: "/icons/navbar/chart-histogram.svg" }
];

// Danh sách navigation phía dưới
const bottomNavItems: NavigationItemProps[] = [];

const Layout = ({
  children,
  isCollapsed = false,
}: {
  children: React.ReactNode;
  isCollapsed?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen flex w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={clsx(
          "flex flex-col justify-between bg-white shadow-md px-4 py-5 transition-all duration-300 border-r",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Header Workspace */}
        <div className="text-gray-800 py-2 px-2">
          <div
            ref={ref}
            onClick={() => setOpen(!open)}
            className={clsx(
              "flex cursor-pointer items-center space-x-2 p-2 hover:bg-gray-200 rounded transition-colors",
              isCollapsed && "flex-col space-x-0 justify-center p-10"
            )}
          >
            <Avatar
              name="workspaceDetail?.name"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-200 text-center"
            />
            {!isCollapsed && (
              <p className="text-sm font-semibold max-w-[80%] truncate">
                {"Fashion Genz"}
              </p>
            )}
            <Svg
              src={open ? "/icons/chevron-up.svg" : "/icons/chevron-down.svg"}
              width={20}
              height={20}
              className={clsx(isCollapsed && "hidden")}
            />
          </div>

          {/* Navigation Items */}
          <div className="mt-6 space-y-2">
            {navItems.map((nav, index) => (
              <NavigationItem
                key={index}
                {...nav}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-6 space-y-2">
          {bottomNavItems.map((nav, index) => (
            <NavigationItem
              key={index}
              {...nav}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full bg-gray-100 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default React.memo(Layout);