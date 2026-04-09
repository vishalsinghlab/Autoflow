// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' for system preference
  theme: {
    extend: {
      // Color System
      colors: {
        primary: {
          50: "#f3e8ff",
          100: "#e9d5ff",
          200: "#d8b4fe",
          300: "#c084fc",
          400: "#a855f7",
          500: "#9333ea",
          600: "#7e22ce",
          700: "#6b21a5",
          800: "#581c87",
          900: "#3b0764",
          DEFAULT: "#a855f7",
        },
        accent: {
          50: "#fdf2ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
          DEFAULT: "#d946ef",
        },
        background: {
          DEFAULT: "#0d0d0d",
          light: "#1a1a1a",
          card: "#1f1a24",
          elevated: "#2d1f35",
        },
        muted: {
          DEFAULT: "#2d1f35",
          foreground: "#a78baf",
        },
        border: {
          DEFAULT: "#3b2b45",
          light: "#4a3658",
        },
      },

      // Typography
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["Fira Code", "JetBrains Mono", "monospace"],
        display: ["Cal Sans", "Inter", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "3xl": [
          "1.875rem",
          { lineHeight: "2.25rem", letterSpacing: "-0.02em" },
        ],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.16", letterSpacing: "-0.02em" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // Spacing & Layout
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },

      // Border Radius
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // Box Shadows
      boxShadow: {
        glow: "0 0 20px rgba(168, 85, 247, 0.3)",
        "glow-lg": "0 0 30px rgba(168, 85, 247, 0.4)",
        "inner-glow": "inset 0 0 10px rgba(168, 85, 247, 0.2)",
        neon: "0 0 5px theme(colors.primary.400), 0 0 20px theme(colors.primary.500)",
        card: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },

      // Backdrop Blur
      backdropBlur: {
        xs: "2px",
      },

      // Animation System
      animation: {
        // Existing animations from tailwindcss-animate
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-out": "slideOut 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "scale-out": "scaleOut 0.2s ease-out",

        // Custom animations
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        gradient: "gradient 3s ease infinite",
        "border-pulse": "borderPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
            borderColor: "rgba(168, 85, 247, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)",
            borderColor: "rgba(168, 85, 247, 0.8)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        borderPulse: {
          "0%, 100%": { borderColor: "rgba(168, 85, 247, 0.2)" },
          "50%": { borderColor: "rgba(168, 85, 247, 0.8)" },
        },
      },

      // Transition Timing Functions
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        2000: "2000ms",
        3000: "3000ms",
      },

      // Background Gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, var(--tw-gradient-stops))",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.2), transparent)",
      },
    },
  },

  plugins: [
    require("tailwindcss-animate"), // smooth collapsible and animations
    //require("@tailwindcss/typography"), // prose classes for markdown/content
    //require("@tailwindcss/forms"), // better form styling
    // require("@tailwindcss/aspect-ratio"), // aspect ratio utilities
    //require("@tailwindcss/container-queries"), // container queries
  ],
};
