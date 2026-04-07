/** Shared design tokens */

export const C = {
  // New clean white + teal theme
  bg: '#FFFFFF',
  bgSurface: '#F9FAFB',
  accent: '#0A66C2',
  accentHover: '#0855a8',
  accentMuted: 'rgba(10,102,194,0.08)',
  text: '#111827',
  textBody: '#4B5563',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  // Legacy tokens kept for landing page compatibility
  dark: '#0F1C2E',
  darkMid: '#0d2540',
  green: '#006B3F',
  greenLight: '#4ADE80',
  cream: '#F5F2E9',
  gold: '#B78A3B',
} as const

/** Subtle shamrock tiled background for light (cream) sections */
export const SHAMROCK_LIGHT: React.CSSProperties = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2760%27 height=%2760%27 viewBox=%270 0 64 64%27%3E%3Cpath fill=%27rgba(0,107,63,0.05)%27 d=%27M32 14c-3.3 0-6 2.7-6 6 0 1.2.4 2.3 1.1 3.2-1.1 1.1-2.1 2.3-2.9 3.6-2.2-1.4-5-1.3-7.1.3-2.2 1.7-2.5 4.9-.8 7.1 1.4 2.2 4.2 2.4 6.2.5 1.5 1.4 3.2 2.5 5.1 3.2-.3 2.7 1.7 5.2 4.3 5.5 3.1.4 5.8-2 5.8-5.1 0-1.5-.7-2.8-1.8-3.7 1.2-1.5 2.1-3.3 2.5-5.3 2.4-.5 4.1-2.8 3.6-5.2-.4-2.1-2.3-3.6-4.4-3.6-1.7 0-3.2 1-3.9 2.5-.8-.4-1.6-.6-2.5-.6z%27/%3E%3C/svg%3E")',
  backgroundRepeat: 'repeat',
  backgroundSize: '160px',
}

/** Same pattern for dark backgrounds (slightly brighter opacity) */
export const SHAMROCK_DARK: React.CSSProperties = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2760%27 height=%2760%27 viewBox=%270 0 64 64%27%3E%3Cpath fill=%27rgba(74,222,128,0.04)%27 d=%27M32 14c-3.3 0-6 2.7-6 6 0 1.2.4 2.3 1.1 3.2-1.1 1.1-2.1 2.3-2.9 3.6-2.2-1.4-5-1.3-7.1.3-2.2 1.7-2.5 4.9-.8 7.1 1.4 2.2 4.2 2.4 6.2.5 1.5 1.4 3.2 2.5 5.1 3.2-.3 2.7 1.7 5.2 4.3 5.5 3.1.4 5.8-2 5.8-5.1 0-1.5-.7-2.8-1.8-3.7 1.2-1.5 2.1-3.3 2.5-5.3 2.4-.5 4.1-2.8 3.6-5.2-.4-2.1-2.3-3.6-4.4-3.6-1.7 0-3.2 1-3.9 2.5-.8-.4-1.6-.6-2.5-.6z%27/%3E%3C/svg%3E")',
  backgroundRepeat: 'repeat',
  backgroundSize: '160px',
}

/** Subtle dot grid for dark backgrounds */
export const DOT_GRID: React.CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}
