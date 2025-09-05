import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UseUrlParamsReturn {
  color: string;
  grayScale: string;
  updateColor: (color: string) => void;
  updateGrayScale: (grayScale: string) => void;
  getShareableUrl: () => string;
}

const DEFAULT_COLOR = "#4f39f6";
const DEFAULT_GRAY_SCALE = "gray";

export function useUrlParams(): UseUrlParamsReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current URL parameters (memoized to prevent unnecessary re-renders)
  const color = useMemo(() => {
    const colorParam = searchParams.get("color");
    if (!colorParam) return DEFAULT_COLOR;
    return colorParam.startsWith("#") ? colorParam : `#${colorParam}`;
  }, [searchParams]);

  const grayScale = useMemo(() => {
    return searchParams.get("gray") || DEFAULT_GRAY_SCALE;
  }, [searchParams]);

  // Update color parameter
  const updateColor = useCallback(
    (newColor: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const colorValue = newColor.replace("#", ""); // Remove # for cleaner URLs

      if (colorValue === DEFAULT_COLOR.replace("#", "")) {
        current.delete("color"); // Remove default values from URL
      } else {
        current.set("color", colorValue);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";

      // Use replace to avoid cluttering browser history
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Update gray scale parameter
  const updateGrayScale = useCallback(
    (newGrayScale: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (newGrayScale === DEFAULT_GRAY_SCALE) {
        current.delete("gray"); // Remove default values from URL
      } else {
        current.set("gray", newGrayScale);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";

      // Use replace to avoid cluttering browser history
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Get shareable URL with current parameters
  const getShareableUrl = useCallback((): string => {
    if (typeof window === "undefined") return "";

    const current = new URLSearchParams();
    const colorValue = color.replace("#", "");

    // Only add params if they're different from defaults
    if (color !== DEFAULT_COLOR) {
      current.set("color", colorValue);
    }
    if (grayScale !== DEFAULT_GRAY_SCALE) {
      current.set("gray", grayScale);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    return `${window.location.origin}${pathname}${query}`;
  }, [color, grayScale, pathname]);

  return {
    color,
    grayScale,
    updateColor,
    updateGrayScale,
    getShareableUrl,
  };
}
