"use client";

import React, { useState, useEffect } from "react";
import { UserSession, AppSettings } from "@/lib/types";
import { FallingGitHubRain } from "@/components/FallingGitHubRain";
import { CrtOverlay } from "@/components/CrtOverlay";
import { PixelTitleBar } from "@/components/PixelTitleBar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { SupportScreen } from "@/components/SupportScreen";
import { DashboardView } from "@/components/DashboardView";
import { MsixPackageModal } from "@/components/MsixPackageModal";
import { soundManager } from "@/lib/sound";

type ScreenState = "WELCOME" | "SUPPORT" | "DASHBOARD";

export default function GitCrazyPage() {
  const [screen, setScreen] = useState<ScreenState>("WELCOME");
  const [showMsixModal, setShowMsixModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    crtEnabled: true,
    animationsEnabled: true,
    rainSpeed: 1,
    theme: "cyberpunk-green",
    useLiveApi: false,
  });

  // User Session State
  const [userSession, setUserSession] = useState<UserSession>({
    id: "guest-pixel-coder",
    username: "pixel_coder",
    displayName: "Pixel Coder 8Bit",
    avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    bio: "Exploring the GitHub universe in 8-bit mode 👾",
    isMock: true,
    starredRepo: false,
    followedMaintainer: false,
  });

  // Load Session and Settings from API on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUserSession(data.user);
            if (!data.user.isMock) {
              setScreen("DASHBOARD");
            }
            return data.user;
          }
        }
      } catch (err) {
        console.error("Session load error:", err);
      }
      return null;
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings((prev) => ({ ...prev, ...data.settings }));
            soundManager.setEnabled(data.settings.soundEnabled);
          }
        }
      } catch (err) {
        console.error("Settings load error:", err);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const authSuccess = params.get("auth") === "success";
    const authErrorCode = params.get("error");

    if (authErrorCode) {
      setAuthError("GitHub sign-in failed. Please try again.");
      if (window.history.replaceState) {
        const cleaned = window.location.search.replace(/[?&]error=[^&]+/, "");
        const nextUrl = cleaned ? `${window.location.pathname}${cleaned}` : window.location.pathname;
        window.history.replaceState({}, "", nextUrl);
      }
    }

    if (authSuccess) {
      fetchSession().then((session) => {
        if (session) {
          setScreen("DASHBOARD");
        }
        if (window.history.replaceState) {
          window.history.replaceState({}, "", window.location.pathname);
        }
      });
    }

    fetchSession();
    fetchSettings();
  }, []);

  // Sync settings updates to API
  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userSession.id,
          settings: updated,
        }),
      });
    } catch (err) {
      console.error("Failed to persist settings:", err);
    }
  };

  // Real OAuth Authorization Redirect Action
  const handleSignInRealOAuth = async () => {
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/github/url");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Unable to generate GitHub OAuth URL");
      }

      const data = await res.json();
      if (!data?.url) {
        throw new Error("GitHub OAuth URL missing");
      }

      window.location.assign(data.url);
    } catch (err) {
      console.error("OAuth redirect error:", err);
      setAuthError("GitHub OAuth is not configured. Please check the app environment settings.");
    }
  };

  // Support Star Action
  const handleSupportStar = async () => {
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userSession.id,
          action: "star",
          value: true,
        }),
      });
      if (res.ok) {
        setUserSession((prev) => ({ ...prev, starredRepo: true }));
      }
    } catch (err) {
      console.error("Support star error:", err);
      setUserSession((prev) => ({ ...prev, starredRepo: true }));
    }
  };

  // Support Follow Action
  const handleSupportFollow = async () => {
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userSession.id,
          action: "follow",
          value: true,
        }),
      });
      if (res.ok) {
        setUserSession((prev) => ({ ...prev, followedMaintainer: true }));
      }
    } catch (err) {
      console.error("Support follow error:", err);
      setUserSession((prev) => ({ ...prev, followedMaintainer: true }));
    }
  };

  // Logout Action
  const handleLogout = async () => {
    soundManager.playClick();
    try {
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUserSession({
      id: "guest-pixel-coder",
      username: "pixel_coder",
      displayName: "Pixel Coder 8Bit",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      bio: "Exploring the GitHub universe in 8-bit mode 👾",
      isMock: true,
      starredRepo: false,
      followedMaintainer: false,
    });
    setScreen("WELCOME");
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-[#00ff66] selection:text-black relative overflow-x-hidden font-pixel-mono">
      {screen !== "WELCOME" && (
        <PixelTitleBar
          soundEnabled={settings.soundEnabled}
          setSoundEnabled={(val) => handleUpdateSettings({ soundEnabled: val })}
          crtEnabled={settings.crtEnabled}
          setCrtEnabled={(val) => handleUpdateSettings({ crtEnabled: val })}
          onOpenMsixInfo={() => setShowMsixModal(true)}
          username={userSession?.username}
        />
      )}

      {/* CRT Display Scanline Overlay */}
      <CrtOverlay enabled={settings.crtEnabled} />

      {/* Background Falling GitHub Rain Matrix */}
      <FallingGitHubRain
        enabled={settings.animationsEnabled}
        speedMultiplier={settings.rainSpeed}
      />

      {/* Screen Views Flow */}
      {screen === "WELCOME" && <WelcomeScreen onGetStarted={handleSignInRealOAuth} errorMessage={authError} />}

      {screen === "SUPPORT" && (
        <SupportScreen
          userId={userSession.id}
          hasStarred={!!userSession.starredRepo}
          hasFollowed={!!userSession.followedMaintainer}
          onStar={handleSupportStar}
          onFollow={handleSupportFollow}
          onContinue={() => setScreen("DASHBOARD")}
        />
      )}

      {screen === "DASHBOARD" && (
        <DashboardView
          userSession={userSession}
          appSettings={settings}
          onUpdateSettings={handleUpdateSettings}
          onLogout={handleLogout}
          onOpenMsixInfo={() => setShowMsixModal(true)}
        />
      )}

      {/* Windows MSIX Packaging Inspector Modal */}
      {showMsixModal && <MsixPackageModal onClose={() => setShowMsixModal(false)} />}
    </div>
  );
}
