"use client";

import React, { useState } from "react";
import { LogOut, Settings } from "lucide-react";

interface PixelTitleBarProps {
  onLogout: () => void;
}

export const PixelTitleBar: React.FC<PixelTitleBarProps> = ({
  onLogout,
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
          <Settings className="h-4 w-4" />
          <span>SETTINGS</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-44 border border-white/20 bg-black/95 p-2 shadow-[4px_4px_0_#00ff66]">
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
