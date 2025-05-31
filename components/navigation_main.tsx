// components/Navigation_Main.tsx
"use client";
import React from "react";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { useRouter } from "next/navigation";

export default function Navigation_Main() {
  const router = useRouter();
  const items: MenuItem[] = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => router.push("/"),
    },
    {
      label: "FindMe",
      icon: "pi pi-users",
      command: () => router.push("/findme"),
    },
    {
      label: "Sessions",
      icon: "pi pi-calendar",
      command: () => router.push("/sessions"),
    },
  ];

  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  );
}

// <nav className="bg-white border-b shadow p-4 flex gap-6">
//   <Link href="/" className="font-bold text-blue-600">
//     Home
//   </Link>

//   <Link href="/findme" className="hover:text-blue-500">
//     FindMe
//   </Link>
//   <Link href="/practice" className="hover:text-blue-500">
//     Practice
//   </Link>
// </nav>
//   );
// }
