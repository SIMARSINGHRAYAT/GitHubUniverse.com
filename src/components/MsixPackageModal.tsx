"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Copy, Check, Terminal, Download, FileCode, Package } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface MsixPackageModalProps {
  onClose: () => void;
}

export const MsixPackageModal: React.FC<MsixPackageModalProps> = ({ onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<"manifest" | "ps" | "builder">("manifest");

  const powershellCmd = `Add-AppxPackage -Path ".\\dist\\GitHubUniverse-1.0.0-x64.msix"`;

  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
         xmlns:mp="http://schemas.microsoft.com/appx/2014/phone/manifest"
         xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10">
  <Identity Name="GitHubUniverse.App"
            Publisher="CN=GitHubUniverse"
            Version="1.0.1.0"
            ProcessorArchitecture="x64" />
  <Properties>
    <DisplayName>GitHub Universe</DisplayName>
    <PublisherDisplayName>GitHub Universe</PublisherDisplayName>
    <Logo>Assets/StoreLogo.png</Logo>
  </Properties>
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Universal" MinVersion="10.0.17763.0" MaxVersionTested="10.0.22621.0" />
  </Dependencies>
  <Applications>
    <Application Id="GitHubUniverse" Executable="GitHubUniverse.exe" EntryPoint="GitHubUniverse.App">
      <uap:VisualElements DisplayName="GitHub Universe"
              Description="A pixel-powered GitHub repository discovery platform"
                          BackgroundColor="#050508"
                          Square150x150Logo="Assets/Square150x150Logo.png"
                          Square44x44Logo="Assets/Square44x44Logo.png">
        <uap:SplashScreen Image="Assets/SplashScreen.png" />
      </uap:VisualElements>
    </Application>
  </Applications>
</Package>`;

  const copyPowershell = () => {
    soundManager.playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(powershellCmd);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-pixel-mono">
      <div className="pixel-panel w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0a0c12] border-3 border-blue-500 shadow-[8px_8px_0px_#000000]">
        
        {/* Modal Header */}
        <div className="bg-blue-950/80 p-4 border-b-2 border-blue-600 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-300">
            <Package className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-pixel-heading tracking-wide">
              WINDOWS MSIX & APPX PACKAGE CONFIGURATION
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 text-gray-400 hover:text-white hover:bg-red-600 border border-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-800 bg-gray-950">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("manifest");
            }}
            className={`px-4 py-2 text-xs font-pixel-mono flex items-center space-x-1.5 border-b-2 ${
              activeTab === "manifest"
                ? "border-blue-400 text-blue-400 bg-blue-950/40"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>AppxManifest.xml</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("ps");
            }}
            className={`px-4 py-2 text-xs font-pixel-mono flex items-center space-x-1.5 border-b-2 ${
              activeTab === "ps"
                ? "border-blue-400 text-blue-400 bg-blue-950/40"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>PowerShell Install Command</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs font-pixel-terminal">
          {activeTab === "manifest" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span>VALID WINDOWS 10 / 11 DESKTOP PACKAGE MANIFEST</span>
                <span className="text-blue-400">Architecture: x64</span>
              </div>
              <pre className="bg-black border border-gray-800 p-4 text-[11px] text-blue-300 font-mono overflow-x-auto leading-relaxed">
                {manifestXml}
              </pre>
            </div>
          )}

          {activeTab === "ps" && (
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-800 p-4">
                <label className="text-[11px] font-pixel-heading text-blue-300 block mb-2">
                  POWERSHELL LOCAL INSTALLATION SCRIPT:
                </label>
                <div className="bg-black p-3 border border-gray-700 flex items-center justify-between font-mono text-xs text-green-400">
                  <code>{powershellCmd}</code>
                  <button
                    onClick={copyPowershell}
                    className="p-1 text-gray-400 hover:text-white border border-gray-700 bg-gray-800"
                    title="Copy PowerShell command"
                  >
                    {copiedCmd ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-black/60 p-4 border border-gray-800 space-y-2 text-gray-300 text-[11px]">
                <h4 className="font-pixel-heading text-blue-400 text-xs">BUILDING MSIX FROM CLI:</h4>
                <p>1. Ensure Node.js & Windows SDK environment tools are installed.</p>
                <p>2. Run <code className="text-[#00ff66]">npm run build:msix</code> in terminal.</p>
                <p>3. Output installer saved to <code className="text-[#00e5ff]">./dist/GitHubUniverse-1.0.0-x64.msix</code>.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#121620] p-3 border-t-2 border-gray-800 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs border border-gray-600 font-pixel-mono"
          >
            CLOSE INSPECTOR
          </button>
        </div>
      </div>
    </div>
  );
};
