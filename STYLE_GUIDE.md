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

### Edit Buttons
- **Circular Edit Button:**
  - Size variants: sm (w-8 h-8), md (w-10 h-10), lg (w-12 h-12)
  - Icon sizes: sm (16px), md (18px), lg (22px)
  - Border: 1px `#81E4F2` (accent)
  - Background: transparent
  - Hover: Dark blue-gray background (rgba(20,30,50,0.85))
  - Icon color: Remains `#81E4F2` (accent) on hover
  - Standard size for profile: md

### Containers
- **Card/Section Container:**
  - Background: transparent (inherits bg-background)
  - Border: 1px `#151C2A` (border)
  - Border Radius: rounded-lg
  - Shadow: shadow-lg
  - Padding: p-6

### Media/Content Cards
- **Base Card Styling:**
  - Width: w-80 (320px)
  - Border: 2px `#1E293B` (border-gray-700)
  - Border on hover: 3px `#81E4F2` (accent)
  - Border Radius: rounded-lg
  - Transition: transition-all for smooth border changes
  - Overflow: hidden
  
- **Media Card Specific:**
  - YouTube/Default dimensions: aspect-video (16:9 ratio)
  - Expandable media height: 400px when expanded
  - Expand button: Small subtle circular button in bottom-right corner

- **Spotlight/Shop Cards:**
  - Dimensions: aspect-square (1:1 ratio)
  - Title overlay: Dark gradient (from-slate-900/95 to-slate-900/0)
  - Text enhancement: drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] for readability
  - Left border accent: 2px teal line
  - Padding: p-3 for adequate spacing

### Profile Image
- **Container:**
  - Size: w-[400px] h-[400px] (400px square)
  - Border: 4px `#81E4F2` (accent) - thicker for emphasis
  - Border Radius: rounded-lg

### Wallet Address Display
- **Container:**
  - Background: `#151C2A`
  - Border: 1px `#1E293B`
  - Border Radius: rounded-md
  - Padding: py-2 px-3
  - Width: Full width (responsive to parent container)
  - Gap between addresses: gap-2

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
  - Profile image column: Self-aligned start
  - Profile info column: Self-aligned center (vertically)
  - Gap between columns: 64px (gap-16)
  - Width symmetry: Profile image and information both 400px wide
  - Vertical spacing hierarchy:
    - Between name and title: mb-3
    - Between title and bio: mb-4
    - Between bio and social links: mb-6
    - Between social links and wallet addresses: mb-6
    - Between wallet addresses and edit controls: mb-8

### Profile Edit Controls
- Grouped in a single row at the bottom of profile info
- Horizontally centered
- Consistent spacing between controls (gap-6)
- Each control has icon + text label

## Responsive Breakpoints

- **Mobile:** Default (< 768px)
- **Tablet/Desktop:** md (≥ 768px)

---

*This style guide is a living document that will be updated as the design evolves* 