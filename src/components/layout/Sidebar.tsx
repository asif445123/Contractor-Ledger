"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import ThemeModal from "@/components/theme/ThemeModal";
import ContactLinks from "@/components/ui/ContactLinks";
import UserMenu from "@/components/layout/UserMenu";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isDemo } = useData();
  const { t } = useLanguage();
  const [themeOpen, setThemeOpen] = useState(false);

  const NAV = [
    { href: "/", label: t.sidebar.dashboard, icon: "📊" },
    { href: "/malik", label: t.sidebar.owners, icon: "🤝" },
    { href: "/mazdoor", label: t.sidebar.labor, icon: "👷" },
    { href: "/kharcha", label: t.sidebar.kharcha, icon: "🧾" },
    { href: "/site", label: t.sidebar.sites, icon: "🏗️" },
  ];

  const adminItem = user?.role === "admin" ? { href: "/admin", label: t.sidebar.admin, icon: "🛡️" } : null;

  return (
    <aside className="md:w-60 shrink-0 bg-[var(--color-bg)] blueprint-grid text-white flex flex-col md:min-h-screen">
      <div className="px-5 py-5 hidden md:block border-b border-white/10">
        <p className="font-ledger text-[10px] tracking-widest text-[var(--color-accent)]">
          {t.sidebar.siteLedgerLabel}
        </p>
        <h1 className="font-display text-2xl">{t.common.siteTitle}</h1>
      </div>

      {isDemo && (
        <div className="px-5 py-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs text-center">
          {t.sidebar.demoModeBanner}
        </div>
      )}

      <nav className="flex md:flex-col flex-1 overflow-x-auto md:overflow-visible">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap border-b border-white/5 md:border-b-0 md:border-r-4 transition ${
                active
                  ? "md:border-[var(--color-accent)] bg-white/10 text-[var(--color-accent)] font-semibold"
                  : "md:border-transparent text-white/75 hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <ContactLinks
          whatsappMessage={t.contact.whatsappDefaultMessage}
          variant="navItem"
          initialName={user?.name}
          initialEmail={user?.email}
        />

        <button
          onClick={() => setThemeOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap border-b border-white/5 md:border-b-0 md:border-r-4 md:border-transparent text-white/75 hover:bg-white/5 transition"
        >
          <span>🎨</span>
          <span>{t.theme.sidebarButton}</span>
        </button>

        {adminItem && (
          <Link
            href={adminItem.href}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap border-b border-white/5 md:border-b-0 md:border-r-4 transition ${
              pathname === adminItem.href
                ? "md:border-[var(--color-accent)] bg-white/10 text-[var(--color-accent)] font-semibold"
                : "md:border-transparent text-white/75 hover:bg-white/5"
            }`}
          >
            <span>{adminItem.icon}</span>
            <span>{adminItem.label}</span>
          </Link>
        )}
      </nav>

      <UserMenu />

      <ThemeModal open={themeOpen} onClose={() => setThemeOpen(false)} />
    </aside>
  );
}
