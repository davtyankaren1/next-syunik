/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enable dark mode via class
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ], // Paths to your content files for purging unused styles
  
  theme: {
    container: {
      center: true, // Centers the container element
      padding: "2rem", // Padding inside the container
      screens: {
        "2xl": "1400px", // Custom screen size for 2xl
      },
    },
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'], // Custom font: Montserrat
        'syunik': ['SyunikArmenian', 'Montserrat', 'sans-serif'], // Custom font: Syunik Armenian
      },
      colors: {
        border: "hsl(var(--border))", // Custom border color using CSS variables
        input: "hsl(var(--input))", // Custom input color
        ring: "hsl(var(--ring))", // Custom ring color (focus rings)
        background: "hsl(var(--background))", // Custom background color
        foreground: "hsl(var(--foreground))", // Custom foreground color
        
        // Brand colors
        brand: {
          primary: "hsl(var(--brand-primary))", // Brand primary color
          secondary: "hsl(var(--brand-secondary))", // Brand secondary color
          accent: "hsl(var(--brand-accent))", // Brand accent color
          text: "hsl(var(--brand-text))", // Brand text color
        },
        
        // General colors
        primary: {
          DEFAULT: "hsl(var(--primary))", // Default primary color
          foreground: "hsl(var(--primary-foreground))", // Foreground color for primary
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Default secondary color
          foreground: "hsl(var(--secondary-foreground))", // Foreground color for secondary
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // Default destructive color
          foreground: "hsl(var(--destructive-foreground))", // Foreground color for destructive
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Default muted color
          foreground: "hsl(var(--muted-foreground))", // Foreground color for muted
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Default accent color
          foreground: "hsl(var(--accent-foreground))", // Foreground color for accent
        },
        popover: {
          DEFAULT: "hsl(var(--popover))", // Default popover color
          foreground: "hsl(var(--popover-foreground))", // Foreground color for popover
        },
        card: {
          DEFAULT: "hsl(var(--card))", // Default card color
          foreground: "hsl(var(--card-foreground))", // Foreground color for card
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))", // Default sidebar background
          foreground: "hsl(var(--sidebar-foreground))", // Foreground color for sidebar
          primary: "hsl(var(--sidebar-primary))", // Sidebar primary color
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))", // Sidebar primary foreground color
          accent: "hsl(var(--sidebar-accent))", // Sidebar accent color
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))", // Sidebar accent foreground color
          border: "hsl(var(--sidebar-border))", // Sidebar border color
          ring: "hsl(var(--sidebar-ring))", // Sidebar ring color
        },
      },

      borderRadius: {
        lg: "var(--radius)", // Custom large border radius
        md: "calc(var(--radius) - 2px)", // Medium border radius with custom value
        sm: "calc(var(--radius) - 4px)", // Small border radius with custom value
      },

      keyframes: {
        "accordion-down": {
          from: {
            height: "0", // Start height for accordion collapse
          },
          to: {
            height: "var(--radix-accordion-content-height)", // End height for accordion expand
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)", // Start height for accordion expand
          },
          to: {
            height: "0", // End height for accordion collapse
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out", // Animation for accordion expand
        "accordion-up": "accordion-up 0.2s ease-out", // Animation for accordion collapse
      },
    },
  },
  
  plugins: [require("tailwindcss-animate")], // Enable the tailwindcss-animate plugin
};
