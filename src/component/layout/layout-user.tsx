"use client";

import { useState } from "react";
import NavigationItem, { NavigationItemProps } from "./navigation-items";

import { useQuery } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import Svg from "../icons/svg";



const navItem: NavigationItemProps[] = [
  {
    title: "Thông tin doanh nghiệp",
    href: "/product",
    icon: "/icons/workspace_user/setting.svg",
  },
];

const bottomNav: NavigationItemProps[] = [
  {
    title: "Tài khoản của tôi",
    href: "/user/my-account",
    icon: "/icons/add-user.svg",
  },
  {
    title: "Trợ lý",
    href: "/user/AI-assistant",
    icon: "/icons/Chat.svg",
  },
  {
    title: "Công việc",
    href: "/user/work",
    icon: "/icons/Plus.svg",
  },
  {
    title: "Tài liệu",
    href: "/user/document",
    icon: "/icons/Paper.svg",
  },
  {
    title: "Thông báo",
    href: "/user/notification",
    icon: "/icons/Notification.svg",
  },
  {
    title: "Tất cả workspace",
    href: "/user/all-workspace",
    icon: "/icons/workspace_user/all-workspace.svg",
  },
  {
    title: "Đăng xuất",
    href: "/",
    icon: "/icons/workspace_user/logout.svg",
  },
];

const LayoutUser = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();

  return (
    <>
      <div className="h-screen flex w-full bg-bg-radial px-4 overflow-hidden py-4">
        <div className="flex flex-col gap-y-5 w-1/5 mr-4 h-full">
          <button
            onClick={() => {
              router.push("/dashboard");
            }}
            className="flex items-center text-black outline-none mt-8 cursor-pointer pl-8  hover:text-[#1922FF] hover:opacity-80"
          >
            <Svg src="/icons/workspace_user/back.svg" width={24} height={24} />
            <p className=" text-lg pl-1.5">Quay lại trang chính</p>
          </button>
          <div className="border-b border-gray-400"></div>
          <div>
            <div className="text-lg font-semibold uppercase pl-8 overflow-ellipsis line-clamp-1">
      
            </div>

            <div>
              {navItem.map((nav, index) => (
                <NavigationItem
                  key={index}
                  isCollapsed={nav.isCollapsed}
                  iconActive={nav.iconActive}
                  icon={nav.icon}
                  title={nav.title}
                  href={nav.href}
                  match={nav.match}
                  onClick={nav.onClick}
                />
              ))}
            </div>
          </div>
          <div className="border-b border-gray-400"></div>
          <div className=" flex flex-col justify-between">
            <div className="uppercase pl-8 text-lg font-semibold">
  
            </div>
            {bottomNav.map((nav, index) => (
              <NavigationItem
                key={index}
                isCollapsed={nav.isCollapsed}
                icon={nav.icon}
                title={nav.title}
                href={nav.href}
                match={nav.match}
                onClick={nav.onClick}
                check={nav.check}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[#F5F5FA]  rounded-3xl px-10 ml-4 h-full py-4 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default LayoutUser;
