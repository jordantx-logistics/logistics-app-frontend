const config = {
  theme: {
    colors: {
      // === BACKGROUND ===
      bg: '#f8f9fb', // light / oklch(99% 0.002 240)
      surface: '#ffffff', // oklch(100% 0 0)
      'surface-raised': '#ffffff', // light / oklch(100% 0 0)
      'surface-raised-dark': '#3d3f47', // dark / oklch(24% 0.012 250)

      // === FOREGROUND ===
      fg: '#2d3245', // light / oklch(18% 0.012 250)
      'fg-secondary': '#586078', // light / oklch(38% 0.012 250)
      muted: '#8890a8', // light / oklch(54% 0.012 250)
      'muted-dark': '#7a8199', // dark / oklch(48% 0.012 250)

      // === BORDER ===
      border: '#d4d8df', // light / oklch(92% 0.005 250)
      'border-strong': '#c0c6d2', // light / oklch(85% 0.008 250)
      'border-strong-dark': '#52565f', // dark / oklch(36% 0.012 250)

      // === ACCENT ===
      accent: '#6366f1', // oklch(58% 0.18 255)
      'accent-hover': '#4f46e5', // oklch(52% 0.16 255)
      'accent-subtle': 'rgba(99, 102, 241, 0.08)', // oklch(58% 0.18 255 / 0.08)
      'accent-subtle-dark': 'rgba(99, 102, 241, 0.12)', // dark

      // === SUCCESS ===
      success: '#22c47e', // oklch(62% 0.18 145)
      'success-bg': 'rgba(34, 196, 126, 0.08)', // oklch(62% 0.18 145 / 0.08)
      'success-bg-dark': 'rgba(34, 196, 126, 0.12)', // dark

      // === WARNING ===
      warning: '#d4a830', // oklch(72% 0.16 80)
      'warning-bg': 'rgba(212, 168, 48, 0.08)', // oklch(72% 0.16 80 / 0.08)
      'warning-bg-dark': 'rgba(212, 168, 48, 0.12)', // dark

      // === DANGER ===
      danger: '#e04545', // oklch(60% 0.20 25)
      'danger-bg': 'rgba(224, 69, 69, 0.08)', // oklch(60% 0.20 25 / 0.08)
      'danger-bg-dark': 'rgba(224, 69, 69, 0.12)', // dark

      // === INFO ===
      info: '#6366f1', // oklch(58% 0.18 255)
      'info-bg': 'rgba(99, 102, 241, 0.08)', // oklch(58% 0.18 255 / 0.08)
      'info-bg-dark': 'rgba(99, 102, 241, 0.12)', // dark

      // === DARK MODE OVERRIDES ===
      bgDark: '#181a1f', // dark / oklch(16% 0.012 250)
      surfaceDark: '#282a30', // dark / oklch(20% 0.012 250)
      fgDark: '#d4d8df', // dark / oklch(92% 0.005 250)
      'fg-secondary-dark': '#b4bac8', // dark / oklch(72% 0.008 250)
    },
    extend: {
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
        md: '0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)',
        lg: '0 10px 15px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04)',
        xl: '0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['12px', { lineHeight: '1.5' }],
        base: ['13px', { lineHeight: '1.5' }],
        md: ['14px', { lineHeight: '1.5' }],
        lg: ['15px', { lineHeight: '1.5' }],
        xl: ['20px', { fontWeight: '700', letterSpacing: '-0.02em' }],
        '2xl': ['28px', { fontWeight: '700', letterSpacing: '-0.03em' }],
      },
    },
  },
}

export default config
