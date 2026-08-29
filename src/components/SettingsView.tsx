"use client";

import React from "react";
import { AppSettings, UserSession } from "@/lib/types";
import { PixelButton } from "./PixelButton";
import { soundManager } from "@/lib/sound";
import { Settings, Volume2, VolumeX, Tv, Monitor, RefreshCw, LogOut, ShieldCheck, Info, Zap } from "lucide-react";
import { GitHubRepositoryService } from "@/lib/github-api";

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  userSession: UserSession | null;
  onLogout: () => void;
  onOpenMsixInfo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  userSession,
  onLogout,
  onOpenMsixInfo,
}) => {
  const handleClearCache = () => {
    soundManager.playClick();
    GitHubRepositoryService.clearCache();
    alert("[CACHE CLEARED]: Local GitHub API cache flushed successfully.");
  };

  return (
    <div className="space-y-6 font-pixel-mono max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#121620] border-2 border-[#00ff66] p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-pixel-heading text-[#00ff66] flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[#00ff66]" />
            <span>APPLICATION SETTINGS</span>
          </h2>
          <p className="text-xs text-gray-400 font-pixel-terminal mt-1">
            CUSTOMIZE YOUR RETRO TERMINAL OPERATING ENVIRONMENT
          </p>
        </div>

        <button
          onClick={onOpenMsixInfo}
          className="bg-blue-950/80 hover:bg-blue-900 border border-blue-500 text-blue-300 px-3 py-1.5 text-xs font-pixel-mono flex items-center space-x-1.5 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>MSIX PACKAGE INFO</span>
        </button>
      </div>

      {/* Account Info Box */}
      <div className="pixel-panel p-5 bg-[#0a0c12]">
        <h3 className="text-xs font-pixel-heading text-gray-400 mb-3 flex items-center space-x-2">
          <span className="text-base">👾</span>
          <span>GITHUB ACCOUNT INFORMATION</span>
        </h3>

        <div className="bg-gray-900 border border-gray-800 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={userSession?.avatarUrl || "https://avatars.githubusercontent.com/u/583231?v=4"}
              alt="Avatar"
              className="w-10 h-10 border-2 border-[#00ff66] bg-black"
            />
            <div>
              <div className="text-sm font-bold text-white font-pixel-mono">
                {userSession?.displayName || userSession?.username || "Pixel Coder"}
              </div>
              <div className="text-xs text-[#00e5ff] font-pixel-mono">
                @{userSession?.username || "pixel_coder"}{" "}
                <span className="text-gray-500">({userSession?.isMock ? "MOCK SESSION" : "OAUTH AUTHENTICATED"})</span>
              </div>
            </div>
          </div>

          <PixelButton variant="red" size="sm" onClick={onLogout}>
            <LogOut className="w-3.5 h-3.5 mr-1" />
            LOG OUT
          </PixelButton>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Audio & Sound FX */}
        <div className="pixel-panel p-5 bg-[#0a0c12]">
          <h3 className="text-xs font-pixel-heading text-gray-400 mb-3 flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-[#00ff66]" />
            <span>AUDIO & SOUND EFFECTS</span>
          </h3>

          <div className="flex items-center justify-between bg-gray-900 p-3 border border-gray-800">
            <div>
              <div className="text-xs font-bold text-white">8-Bit Sound Synthesizer</div>
              <div className="text-[10px] text-gray-400">Tactile retro audio feedback for button interactions</div>
            </div>

            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                soundManager.setEnabled(next);
                onUpdateSettings({ soundEnabled: next });
                if (next) soundManager.playToggle();
              }}
              className={`px-3 py-1.5 text-xs font-pixel-mono border-2 transition-all ${
                settings.soundEnabled
                  ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]"
                  : "bg-gray-800 border-gray-700 text-gray-500"
              }`}
            >
              {settings.soundEnabled ? "ENABLED" : "MUTED"}
            </button>
          </div>
        </div>

        {/* CRT Scanline Overlay */}
        <div className="pixel-panel p-5 bg-[#0a0c12]">
          <h3 className="text-xs font-pixel-heading text-gray-400 mb-3 flex items-center space-x-2">
            <Tv className="w-4 h-4 text-[#00e5ff]" />
            <span>RETRO CRT DISPLAY</span>
          </h3>

          <div className="flex items-center justify-between bg-gray-900 p-3 border border-gray-800">
            <div>
              <div className="text-xs font-bold text-white">Scanlines & Phosphor Glow</div>
              <div className="text-[10px] text-gray-400">Authentic retro cathode-ray tube visual filter</div>
            </div>

            <button
              onClick={() => {
                soundManager.playToggle();
                onUpdateSettings({ crtEnabled: !settings.crtEnabled });
              }}
              className={`px-3 py-1.5 text-xs font-pixel-mono border-2 transition-all ${
                settings.crtEnabled
                  ? "bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff]"
                  : "bg-gray-800 border-gray-700 text-gray-500"
              }`}
            >
              {settings.crtEnabled ? "ACTIVE" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* API Source & Cache Management */}
      <div className="pixel-panel p-5 bg-[#0a0c12] space-y-4">
        <h3 className="text-xs font-pixel-heading text-gray-400 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-[#ffcc00]" />
          <span>DATA SERVICE & CACHE CONTROLS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-3 border border-gray-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Live GitHub API Mode</div>
              <div className="text-[10px] text-gray-400">Toggle real-time GitHub REST API search queries</div>
            </div>

            <button
              onClick={() => {
                soundManager.playToggle();
                onUpdateSettings({ useLiveApi: !settings.useLiveApi });
              }}
              className={`px-3 py-1.5 text-xs font-pixel-mono border-2 transition-all ${
                settings.useLiveApi
                  ? "bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00]"
                  : "bg-gray-800 border-gray-700 text-gray-500"
              }`}
            >
              {settings.useLiveApi ? "LIVE API" : "MOCK SEED"}
            </button>
          </div>

          <div className="bg-gray-900 p-3 border border-gray-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Flush API Cache</div>
              <div className="text-[10px] text-gray-400">Clear cached response payloads</div>
            </div>

            <PixelButton variant="outline" size="sm" onClick={handleClearCache}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              FLUSH
            </PixelButton>
          </div>
        </div>
      </div>

      {/* Windows Application Identity */}
      <div className="pixel-panel p-5 bg-[#0a0c12] text-xs font-pixel-terminal space-y-2 text-gray-300 border-2 border-blue-600/40">
        <h3 className="text-xs font-pixel-heading text-blue-400 mb-2 flex items-center space-x-2">
          <Info className="w-4 h-4" />
          <span>WINDOWS APPLICATION METADATA</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-black/60 p-3 border border-gray-800">
          <div>
            <span className="text-gray-500 block">APP NAME</span>
            <span className="text-white font-bold">GitHubUniverse</span>
          </div>
          <div>
            <span className="text-gray-500 block">PACKAGE ID</span>
            <span className="text-white font-bold">GitHubUniverse.App</span>
          </div>
          <div>
            <span className="text-gray-500 block">VERSION</span>
            <span className="text-white font-bold">1.0.0.0</span>
          </div>
          <div>
            <span className="text-gray-500 block">TARGET OS</span>
            <span className="text-white font-bold">Windows 10/11 x64</span>
          </div>
        </div>
      </div>
    </div>
  );
};
