# Mixmi Profile Style Guide

## Color Scheme

### Primary Colors
- **Background:** `#101726` - Dark blue background for the entire application
- **Border:** `#151C2A` - Slightly lighter blue for borders and container edges
- **Accent:** `#81E4F2` - Cyan/teal color for highlights, buttons, and interactive elements

### Text Colors
- **Primary Text:** `#FFFFFF` - White for main text content
- **Secondary Text:** `#A1A1AA` (gray-400) - Light gray for secondary information
- **Muted Text:** `#71717A` (gray-500) - Darker gray for less important text

## Typography

- **Main Font:** System font stack (Geist Sans as primary)
- **Monospace Font:** Geist Mono for code or technical information
- **Heading Size Scale:**
  - H1: 2.25rem (36px) - `text-4xl`
  - H2: 1.5rem (24px) - `text-2xl`
  - H3: 1.25rem (20px) - `text-xl`
  - H4: 1rem (16px) - `text-base`

## Component Styling

### Buttons
- **Primary Button:** 
  - Background: transparent
  - Border: 1px `#81E4F2` (accent)
  - Text: `#81E4F2` (accent)
  - Hover: Reduced opacity (80%)
  - Padding: px-4 py-2
  - Border Radius: rounded-md

### Containers
- **Card/Section Container:**
  - Background: transparent (inherits bg-background)
  - Border: 1px `#151C2A` (border)
  - Border Radius: rounded-lg
  - Shadow: shadow-lg
  - Padding: p-6

### Profile Image
- **Container:**
  - Size: w-80 h-80 (320px square)
  - Border: 2px `#81E4F2` (accent)
  - Border Radius: rounded-lg

### Wallet Address Display
- **Container:**
  - Background: transparent
  - Border: 1px `#151C2A` (border)
  - Border Radius: rounded-md
  - Padding: p-2 px-4
  - Width: max-w-sm (384px)

## Layout

### Header
- Fixed position
- Full width
- Border bottom: 1px `#151C2A` (border)
- Padding: py-4 px-6

### Main Content
- Container with auto margins
- Padding top to account for fixed header (pt-24)

### Profile Layout
- Mobile: Stacked (column)
- Desktop: 
  - Profile image: 1/3 width
  - Profile info: 2/3 width
  - Gap: 2rem (gap-8)

## Responsive Breakpoints

- **Mobile:** Default (< 768px)
- **Tablet/Desktop:** md (≥ 768px)

---

*This style guide is a living document that will be updated as the design evolves* 