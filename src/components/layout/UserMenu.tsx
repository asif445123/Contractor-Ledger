"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
        <div className="absolute bottom-full left-4 right-4 md:left-5 md:right-5 mb-2 rounded-lg bg-[var(--color-bg-soft)] border border-white/10 shadow-xl overflow-hidden z-20">
          {!isDemo && user?.email && (
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">{t.settings.email}</p>
              <p className="text-white/85 text-sm truncate">{user.email}</p>
            </div>
          )}

          {!isDemo && (
            <button
              onClick={() => {
                setSettingsOpen(true);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition flex items-center gap-2"
            >
              ⚙️ {t.settings.sidebarButton}
            </button>
          )}

          <button
            onClick={() => setLocale(locale === "ur" ? "en" : "ur")}
            className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition flex items-center gap-2"
          >
            🌐 {locale === "ur" ? "English" : "اردو"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-rust)] hover:bg-white/5 transition flex items-center gap-2 border-t border-white/10"
          >
            🚪 {t.sidebar.logout}
          </button>
        </div>
      )}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
