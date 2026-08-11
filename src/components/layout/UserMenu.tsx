"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCog, FaSignOutAlt, FaGlobe } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import SettingsModal from "@/components/settings/SettingsModal";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { isDemo, exitDemoMode } = useData();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = isDemo ? t.sidebar.demoUser : user?.name ?? "?";
  const initials = getInitials(displayName);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleLogout() {
    if (isDemo) {
      exitDemoMode();
    } else {
      await logout();
    }
    router.push("/login");
  }

  return (
    <div ref={menuRef} className="relative px-4 py-3 md:px-5 md:py-4 border-t border-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 w-full text-left"
      >
        <span className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] font-bold text-sm flex items-center justify-center">
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block text-white/90 text-sm font-semibold truncate">{displayName}</span>
          <span className="block text-white/50 text-xs">{open ? "▲" : "▼"}</span>
        </span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 md:top-auto md:bottom-full md:mb-2 left-4 right-4 md:left-5 md:right-5 rounded-lg bg-[var(--color-paper)] border border-[var(--color-line)] shadow-xl overflow-hidden z-20">
          {!isDemo && user?.email && (
            <div className="px-4 py-3 border-b border-[var(--color-line)]">
              <p className="text-[var(--color-ink)] text-sm font-semibold truncate">{displayName}</p>
              <p className="text-[var(--color-ink-soft)] text-xs truncate">{user.email}</p>
            </div>
          )}

          {!isDemo && (
            <button
              onClick={() => {
                setSettingsOpen(true);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-alt)] transition flex items-center gap-2.5"
            >
              <FaCog className="text-[var(--color-ink-soft)]" size={15} />
              {t.settings.sidebarButton}
            </button>
          )}

          <button
            onClick={() => setLocale(locale === "ur" ? "en" : "ur")}
            className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-alt)] transition flex items-center gap-2.5 border-t border-[var(--color-line)]"
          >
            <FaGlobe className="text-[var(--color-ink-soft)]" size={15} />
            {locale === "ur" ? "English" : "اردو"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-rust)] hover:bg-[var(--color-paper-alt)] transition flex items-center gap-2.5 border-t border-[var(--color-line)]"
          >
            <FaSignOutAlt size={15} />
            {t.sidebar.logout}
          </button>
        </div>
      )}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
