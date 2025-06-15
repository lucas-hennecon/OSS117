
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: { '2xl': '1400px' }
		},
		extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
			colors: {
        // Brand Neutrals
        background: "#FAFBFC",
        "card-bg": "#fff",
        "border": "#E2E8F0",
        "primary-text": "#1A202C",
        "secondary-text": "#4A5568",
        muted: { DEFAULT: "#F7FAFC", foreground: "#718096" },
        // Accents
        "institutional-blue": "#2B6CB0",
        "institutional-blue-light": "#EBF8FF",
        // Status tones
        "status-red": "#E53E3E",
        "status-red-bg": "#FED7D7",
        "status-orange": "#DD6B20",
        "status-orange-bg": "#FEEBC8",
        "status-green": "#38A169",
        "status-green-bg": "#C6F6D5",
        "status-gray": "#718096",
        "status-gray-bg": "#F7FAFC",
        // Card
        card: { DEFAULT: "#fff", foreground: "#1A202C" },
        // For existing classes compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: "#2B6CB0", foreground: "#fff" },
				secondary: { DEFAULT: "#EBF8FF", foreground: "#2B6CB0" },
				destructive: { DEFAULT: "#E53E3E", foreground: "#fff" },
				accent: { DEFAULT: "#FEEBC8", foreground: "#DD6B20" },
				popover: { DEFAULT: "#fff", foreground: "#1A202C" },
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px'
			},
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07),0 1.5px 5px 0 rgba(0,0,0,0.03)",
        "card-hover": "0 4px 20px 0 rgba(0,0,0,0.11)",
      },
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

