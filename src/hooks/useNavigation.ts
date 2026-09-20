import { useState, useEffect, useCallback } from "react";
import { RoutePath } from "../types";
import { isKnownRoute } from "../app/routes";

function getRouteFromLocation(): RoutePath {
  if (typeof window === "undefined") return "/";

  // Check hash first (e.g. "#/explore" or "#/story")
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) {
    const cleanHash = hash.startsWith("/") ? hash : `/${hash}`;
    if (isKnownRoute(cleanHash)) {
      return cleanHash;
    }
  }

  // Check pathname
  const pathname = window.location.pathname;
  if (isKnownRoute(pathname)) {
    return pathname;
  }

  return "/";
}

export function useNavigation() {
  const [currentPath, setCurrentPath] = useState<RoutePath>(getRouteFromLocation);

  const navigate = useCallback((targetPath: RoutePath | string) => {
    const resolvedPath: RoutePath = isKnownRoute(targetPath) ? targetPath : "/";

    if (window.location.hash !== `#${resolvedPath}`) {
      window.location.hash = resolvedPath;
    }
    window.history.pushState({ path: resolvedPath }, "", `#${resolvedPath}`);
    setCurrentPath(resolvedPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const next = getRouteFromLocation();
      setCurrentPath(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleHashChange = () => {
      const next = getRouteFromLocation();
      setCurrentPath(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleHashChange);

    // Initial sync
    const initial = getRouteFromLocation();
    if (window.location.hash === "" && initial !== "/") {
      window.location.hash = initial;
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return {
    currentPath,
    navigate,
  };
}
