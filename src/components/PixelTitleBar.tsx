"use client";

import React, { useState } from "react";
import { LogOut, Settings } from "lucide-react";

interface PixelTitleBarProps {
  onLogout: () => void;
  username?: string;
  avatarUrl?: string;
}

export const PixelTitleBar: React.FC<PixelTitleBarProps> = ({
  onLogout,
  username,
  avatarUrl,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="relative z-50 flex h-14 items-center justify-end border-b border-white/10 bg-black/75 px-4 backdrop-blur-sm">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu((current) => !current)}
          className="flex items-center gap-2 border border-white/20 bg-black/60 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-[#00ff66] hover:text-[#00ff66]"
          aria-expanded={showMenu}
          aria-label="Open settings"
        >
          {avatarUrl ? <img src={avatarUrl} alt="" className="h-5 w-5 border border-[#00ff66] object-cover" /> : <Settings className="h-4 w-4" />}
          <span>SETTINGS</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-56 border border-white/20 bg-black/95 p-2 shadow-[4px_4px_0_#00ff66]">
            <button
              type="button"
              onClick={() => username && window.location.assign(`https://github.com/${encodeURIComponent(username)}`)}
              className="mb-1 flex w-full items-center gap-3 border-b border-white/10 px-3 py-3 text-left transition-colors hover:bg-white/10"
              disabled={!username}
            >
              {avatarUrl && <img src={avatarUrl} alt="" className="h-9 w-9 border border-[#00ff66] object-cover" />}
              <span className="truncate text-sm text-white">@{username || "github-user"}</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-[#00ff66] hover:text-black"
            >
              <LogOut className="h-4 w-4" />
              <span>LOG OUT</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
