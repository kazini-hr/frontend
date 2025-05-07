import Image from "next/image";
import Link from "next/link";
import React from "react";
import { role } from "@/app/lib/data";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: `/${role}`,
        visible: ["admin", "executive", "employee", "manager"],
      },
      {
        icon: "/executive.png",
        label: "Executives",
        href: "/list/executives",
        visible: ["admin", "executive"],
      },
      {
        icon: "/employee.png",
        label: "Employees",
        href: "/list/employees",
        visible: ["admin", "executive"],
      },
      {
        icon: "/manager.png",
        label: "Managers",
        href: "/list/managers",
        visible: ["admin", "executive"],
      },
      // {
      //   icon: '/subject.png',
      //   label: 'Subjects',
      //   href: '/list/subjects',
      //   visible: ['admin'],
      // },
      // {
      //   icon: '/class.png',
      //   label: 'Classes',
      //   href: '/list/classes',
      //   visible: ['admin', 'executive'],
      // },
      // {
      //   icon: '/lesson.png',
      //   label: 'Lessons',
      //   href: '/list/lessons',
      //   visible: ['admin', 'executive'],
      // },
      // {
      //   icon: '/exam.png',
      //   label: 'Exams',
      //   href: '/list/exams',
      //   visible: ['admin', 'executive', 'employee', 'manager'],
      // },
      // {
      //   icon: '/assignment.png',
      //   label: 'Assignments',
      //   href: '/list/assignments',
      //   visible: ['admin', 'executive', 'employee', 'manager'],
      // },
      // {
      //   icon: '/result.png',
      //   label: 'Results',
      //   href: '/list/results',
      //   visible: ['admin', 'executive', 'employee', 'manager'],
      // },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "executive", "employee", "manager"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "executive", "employee", "manager"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "executive", "employee", "manager"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "executive", "employee", "manager"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "executive", "employee", "manager"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "executive", "employee", "manager"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "executive", "employee", "manager"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((item) => (
        <div key={item.title} className="flex flex-col gap-2">
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {item.title}
          </span>
          {item.items.map((subItem) => {
            if (subItem.visible.includes(role)) {
              return (
                <Link
                  href={subItem.href}
                  key={subItem.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={subItem.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{subItem.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
