import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWaitingTime(time: string | number | undefined): string {
    if (!time) return "N/A";
    const seconds = typeof time === "string" ? parseInt(time) : time;
    if (isNaN(seconds)) return time.toString();
    
    if (seconds < 60) return `${seconds}s`;
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    return [
        h > 0 ? `${h}h` : null,
        m > 0 ? `${m}m` : null,
        s > 0 ? `${s}s` : null
    ].filter(Boolean).join(" ");
}
