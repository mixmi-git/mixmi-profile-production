# Mixmi Profile Style Guide

## Color Scheme

### Primary Colors
- **Background:** `#101726` - Dark blue background for the entire application
- **Container Background:** `#0f172a` - Slightly darker blue for form fields and containers
- **Border:** `#1e293b` - Border color for input fields, containers, and cards
- **Accent:** `#81E4F2` - Cyan/teal color for highlights, buttons, and interactive elements
- **URL/Link Color:** `#60a5fa` - Blue color for URLs and hyperlinks
- **Accent Focus:** `#38bdf8` - Used for input focus states and interactive elements

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
  - Background: `#81E4F2` (accent teal)
  - Hover: `#65d5e3` (darker teal)
  - Text: `#101726` (dark background color)
  - Padding: px-4 py-2
  - Border Radius: rounded-md
- **Save Button:**
  - Background: `#0ea5e9` (blue)
  - Hover: `#0284c7` (darker blue)
  - Text: white
  - Padding: px-4 py-2
  - Border Radius: rounded-md
  - Used consistently across all modals for Save/Confirm actions
- **Secondary Button:**
  - Background: `#151C2A`
  - Hover: `#1a2436`
  - Border: 1px `#1E293B`
  - Text: gray-200
  - Used for Cancel actions

### Edit Buttons
- **Circular Edit Button:**
  - Size variants: sm (w-8 h-8), md (w-10 h-10), lg (w-12 h-12)
  - Icon sizes: sm (16px), md (18px), lg (22px)
  - Border: 1px `#81E4F2` (accent)
  - Background: transparent
  - Hover: Dark blue-gray background (rgba(20,30,50,0.85))
  - Icon color: Remains `#81E4F2` (accent) on hover
  - Standard size for profile: md
- **Card Edit Button:**
  - Background: `rgba(15, 23, 42, 0.7)` (bg-slate-800/70)
  - Hover: `rgba(51, 65, 85, 0.8)` (bg-slate-700/80)
  - Initially hidden with `opacity-0`
  - Appears on hover with `group-hover:opacity-100`
  - Transition: `transition-opacity`

### Social Links
- **Icons:**
  - Use `react-icons/fa6` library for brand icons
  - Size: 20px consistent across all platforms
  - Standard platforms: Instagram, YouTube, X (Twitter), Spotify, GitHub, Twitch
  - Music platforms: SoundCloud, Mixcloud
  - Other platforms: TikTok
- **Display:**
  - Icon-only display for better visual consistency
  - Hover tooltip with platform name for better usability
  - URLs truncated with ellipsis when too long
  - Link text color: `#60a5fa` (text-blue-400)

### Form Inputs
- **Text Inputs and Textareas:**
  - Background: `#0f172a` (bg-slate-800)
  - Border: 1px `#1e293b` (border-slate-700)
  - Border Radius: rounded-md
  - Padding: px-3 py-2
  - Text Color: `#ffffff` (text-white)
  - Placeholder Color: `#71717A` (text-gray-500)
  - Focus: `focus:outline-none focus:border-[#38bdf8]`

### Section Management
- **Container:**
  - Max width: max-w-md
  - Background: Inherits page bg-background
  - Border: border border-gray-800
  - Border Radius: rounded-lg
  - Padding: p-4
  - Margin: mb-16 (margin-bottom)
  - Centered: flex justify-center mx-auto
  
- **Toggle Buttons:**
  - Shape: rounded-md
  - Padding: px-3 py-1.5
  - Font Size: text-sm
  - Active state: bg-accent/10 text-accent border border-accent/30
  - Inactive state: bg-gray-800 text-gray-400 border border-gray-700
  - Layout: flex flex-wrap gap-3 justify-center

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
  - Edit buttons: 
    - Hidden by default (`opacity-0`)
    - Visible on hover (`group-hover:opacity-100`)
    - Positioned in top-right corner

### Profile Image
- **Container:**
  - Size: w-[400px] h-[400px] (400px square)
  - Border: 4px `#81E4F2` (accent) - thicker for emphasis
  - Border Radius: rounded-lg

### Wallet Address Display
- **Container:**
  - Background: `#0f172a`
  - Border: 1px `#1e293b`
  - Border Radius: rounded-md
  - Padding: py-2 px-4
  - Max Width: max-w-[350px] to limit the width
  - Gap between addresses: gap-2
- **Address Text:**
  - Color: text-gray-400 (light gray) for better readability
  - Size: text-xs
  - Use truncate for long addresses
- **Copy Button:**
  - Size: 14px icon
  - Padding: p-1
  - Default: text-gray-400
  - Hover: text-[#81E4F2] (teal accent color) with transition
  - Position: Right aligned
  - Tooltip: "Copy address" on hover

## Content Types

### Token-Gated Content
- **Supported in:** Shop section
- **Display:** Same as standard shop items
- **Link handling:** Direct users to token-gated platforms (NFT marketplaces, token gates, etc.)
- **Description:** Mention that token-gating is available in the helper text

## Layout

### Header
- Fixed position
- Full width
- Border bottom: 1px `#151C2A` (border)
- Padding: py-4 px-6

### Main Content
- Container with auto margins
- Padding top to account for fixed header (pt-24)

### Vertical Spacing
- **Major Sections:**
  - Profile component: mb-16
  - Section Manager: mb-16
  - Content sections (Spotlight, Media, Shop): mb-20
  
- **Section Internal Spacing:**
  - Section header container: mb-8
  - Section heading and description: mb-6 (visible when authenticated)
  - Card grid container: mb-4
  - Card grid gap: gap-6

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

### Content Visibility
- **Section descriptions** (guidance text under section titles):
  - Only visible when authenticated
  - Hidden for public/non-authenticated users
  - Provides context only for users editing their own profile
  - Standard text formats:
    - Spotlight: "Showcase your projects or amplify friends you collab with"
    - Media: "Share your videos, music, and mixes"
    - Shop: "Share your products, services, and token-gated content"

## Responsive Breakpoints

- **Mobile:** Default (< 768px)
- **Tablet/Desktop:** md (≥ 768px)

---

*This style guide is a living document that will be updated as the design evolves* 