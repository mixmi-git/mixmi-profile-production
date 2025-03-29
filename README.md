# MixMi Profile - Production

This repository contains the production-ready implementation of the MixMi Profile application, refactored for performance, maintainability, and scalability.

## Project Overview

MixMi Profile provides a user profile system with support for personal information, social links, and cryptocurrency wallet addresses. It's designed to integrate with other MixMi applications while maintaining a clean, responsive user interface.

## Features

- **Profile Management**
  - View and edit personal information
  - Customize profile visibility settings
  - Upload and manage profile content
  
- **Wallet Integration**
  - Connect STX and BTC wallet addresses
  - Control wallet address visibility
  - Secure display of cryptocurrency information
  
- **Social Integration**
  - Link to various social platforms
  - Customize social links display

## Key Components

### Profile Viewing System
- **Public View**: Displays only information marked as publicly visible
- **Private View**: Shows full profile to authorized users
- **Sticker Display**: Renders the user's selected profile sticker
- **Section Visibility**: Respects user preferences for section display
- **Responsive Layout**: Adapts to various screen sizes

### Profile Editing System
- **Modal Interface**: Clean, focused editing experience
- **Form Sections**:
  - Personal Information: Edit name, title, bio with character limits
  - Wallet Addresses: Manage STX/BTC addresses with privacy controls
  - Social Links: Add/remove platform links with custom URLs
- **UX Features**:
  - Input validation with error messaging
  - Character counters for text fields
  - Scrollable container for lengthy forms
  - Sticky save/cancel buttons for accessibility
  - Visual hierarchy through consistent styling

## Authentication Flow

1. User clicks "Connect Wallet" button
2. Leather wallet popup appears for authorization
3. On successful authentication, the user's wallet address is stored
4. Edit mode becomes available, allowing profile customization
5. Profile data is associated with the wallet address

## Technology Stack

- **Frontend Framework**: 
  - Next.js 14.2.16
  - React 18.x
  - TypeScript 5.8.2
- **UI/UX**: Tailwind CSS 3.4.1 with custom theming
- **Components**: Custom component library based on shadcn/ui and Radix UI
- **Authentication**: Leather wallet integration (Stacks blockchain)
- **State Management**: React Context API
- **Data Persistence**: Local storage (Supabase integration planned)

## Architecture

The application follows a modular architecture:
- `/app`: Next.js app router components and pages
- `/components`: Reusable UI components
- `/lib`: Utility functions and helpers
- `/public`: Static assets and images

## Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env.local`)
4. Run the development server: `npm run dev`
5. Access the application at `http://localhost:3000`

## Deployment

1. Build the application: `npm run build`
2. Preview the production build: `npm run start`
3. Deploy to your hosting platform of choice

## Roadmap

- Integration with Supabase for data persistence
- Custom sticker uploads
- Internationalization support
- Enhanced wallet verification
