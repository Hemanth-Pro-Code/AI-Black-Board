"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAContextType {
  isInstallable: boolean;
  isStandalone: boolean;
  isOffline: boolean;
  promptInstall: () => Promise<boolean>;
  dismissInstall: () => void;
  showInstallBanner: boolean;
}

const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  isStandalone: false,
  isOffline: false,
  promptInstall: async () => false,
  dismissInstall: () => {},
  showInstallBanner: false,
});

export const usePWA = () => useContext(PWAContext);

export default function PWAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [networkToast, setNetworkToast] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check initial offline status asynchronously to avoid cascading renders
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const offlineTimer = setTimeout(() => setIsOffline(true), 0);
      return () => clearTimeout(offlineTimer);
    }
  }, []);

  useEffect(() => {
    // 2. Check if running in standalone mode (installed PWA)
    const checkStandalone = () => {
      const nav = window.navigator as unknown as { standalone?: boolean };
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        nav.standalone === true ||
        document.referrer.includes("android-app://");
      if (isStandaloneMode) {
        setTimeout(() => setIsStandalone(true), 0);
      }
    };

    checkStandalone();

    // Check if previously dismissed in session
    if (
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("pwa_install_dismissed") === "true"
    ) {
      setTimeout(() => setDismissed(true), 0);
    }

    // 3. Listen for BeforeInstallPrompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log("[PWA] beforeinstallprompt event captured");
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. App Installed listener
    const handleAppInstalled = () => {
      console.log("[PWA] App successfully installed");
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. Network status listeners
    const handleOnline = () => {
      setIsOffline(false);
      setNetworkToast("Back online — connected to BlackBoard AI cloud");
      setTimeout(() => setNetworkToast(null), 3500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setNetworkToast("Offline mode — local blackboard ready, AI requires connection");
      setTimeout(() => setNetworkToast(null), 4500);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 6. Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);

          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setUpdateAvailable(true);
          }

          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("[PWA] New version installed and waiting activation");
                  setWaitingWorker(newWorker);
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("[PWA] Service worker registration failed:", err);
        });

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log("[PWA] User response to install prompt:", choiceResult.outcome);
      if (choiceResult.outcome === "accepted") {
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.error("[PWA] Install prompt error:", err);
    }
    return false;
  };

  const dismissInstall = () => {
    setDismissed(true);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("pwa_install_dismissed", "true");
    }
  };

  const handleApplyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const isInstallable = Boolean(deferredPrompt) && !isStandalone;
  const showInstallBanner = isInstallable && !dismissed;

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isStandalone,
        isOffline,
        promptInstall,
        dismissInstall,
        showInstallBanner,
      }}
    >
      {children}

      {/* Subtle Network Status Toast */}
      {networkToast && (
        <div
          role="status"
          className="fade-in"
          style={{
            position: "fixed",
            bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            background: isOffline ? "rgba(15, 23, 42, 0.95)" : "rgba(11, 61, 46, 0.95)",
            border: isOffline
              ? "1px solid rgba(253, 230, 138, 0.3)"
              : "1px solid rgba(34, 197, 94, 0.3)",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "999px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.9rem",
            fontWeight: 600,
            maxWidth: "90vw",
            textAlign: "center",
          }}
        >
          {isOffline ? (
            <WifiOff size={18} color="#fde68a" />
          ) : (
            <Wifi size={18} color="#86efac" />
          )}
          <span>{networkToast}</span>
        </div>
      )}

      {/* Subtle Service Worker Update Notification */}
      {updateAvailable && (
        <div
          role="alert"
          className="fade-in"
          style={{
            position: "fixed",
            top: "calc(16px + env(safe-area-inset-top, 0px))",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10001,
            background: "rgba(11, 61, 46, 0.95)",
            border: "1px solid rgba(134, 239, 172, 0.35)",
            boxShadow: "0 10px 35px rgba(0,0,0,0.5)",
            backdropFilter: "blur(14px)",
            padding: "10px 18px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#ffffff",
            fontSize: "0.9rem",
            maxWidth: "92vw",
          }}
        >
          <span>✨ New version available!</span>
          <button
            onClick={handleApplyUpdate}
            style={{
              background: "#22c55e",
              color: "#07251c",
              border: "none",
              borderRadius: "999px",
              padding: "6px 14px",
              fontWeight: 700,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      )}
    </PWAContext.Provider>
  );
}
