# Mixmi Profile

Mixmi Profile is a customizable web-based profile platform built with Next.js. It allows users to create and share their digital presence with customizable sections for showcasing projects, media, shop items, and gallery content.

## Features

- **Customizable Sections**: Spotlight, Media, Shop, and Gallery sections with editable titles
- **Section Management**: Show/hide sections based on user preference
- **Dynamic Content**: Add, edit, delete, and reorder items within each section
- **Rich Media Support**: YouTube, Spotify, SoundCloud, Mixcloud, and more
- **Drag and Drop**: Reorder items easily with drag-and-drop functionality
- **Responsive Design**: Mobile and desktop friendly interface
- **Blockchain Integration**: Wallet integration for STX and BTC addresses
- **Profile Customization**: Edit profile image, bio, title, and social links

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [React Context](https://react.dev/reference/react/createContext)
- **Drag and Drop**: [React DnD](https://react-dnd.github.io/react-dnd/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/)
- **Blockchain**: [Stacks.js](https://github.com/stacks-network/stacks.js), [Micro-stacks](https://github.com/fungible-systems/micro-stacks)

## Getting Started

### Prerequisites

- Node.js 18.20.4 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mixmi-git/mixmi-profile-production.git
   cd mixmi-profile-production
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3010](http://localhost:3010) in your browser

## Project Structure

```
mixmi-profile/
├── app/                   # Next.js app router pages
├── components/            # React components
│   ├── cards/             # Card components for different sections
│   ├── layout/            # Layout components
│   ├── modals/            # Modal components for editing
│   ├── profile/           # Profile-related components
│   ├── sections/          # Section components (Spotlight, Media, etc.)
│   ├── shared/            # Shared UI components
│   └── ui/                # Basic UI components
├── contexts/              # React contexts for state management
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and services
├── public/                # Static assets
│   ├── logos/             # Logo images
│   ├── placeholders/      # Placeholder images for sections
│   └── stickers/          # Sticker images
└── types/                 # TypeScript type definitions
```

## Sections

### Spotlight

Showcase your projects, collaborations, or featured content. Supports up to 3 items with images, titles, descriptions, and links.

### Media

Share your media content from platforms like YouTube, Spotify, SoundCloud, and Mixcloud. Supports up to 6 items.

### Shop

Promote your products, services, or token-gated content. Supports up to 3 items with images, titles, descriptions, and links.

### Gallery

Display your visual arts, photos, or any image-based content. Supports up to 3 items.

## Customization

### Section Titles

All section titles are customizable. Edit them by:
1. Clicking the "Edit Section" button
2. Changing the title in the "Section Title" field
3. Clicking "Save Changes"

### Section Visibility

Control which sections are visible by using the "Show/Hide Sections" button at the top of the profile.

### Profile Details

Edit your profile details including:
- Profile image
- Name
- Title
- Bio
- Social links
- Wallet addresses (STX and BTC)

## Demo Content

This repository includes demo content that can be loaded to showcase the platform's features:

- Sample profile data
- Placeholder images for all sections
- Pre-configured media, shop items, spotlight features, and gallery items

### Loading Demo Data

To load the demo data:

1. Open the browser console
2. Run the command `loadPlaceholderData()`
3. Refresh the page

## Deployment

### Building for Production

```bash
npm run build
```

The build output will be in the `.next` directory. This can be deployed to any hosting platform that supports Next.js applications.

### Recommended Hosting

- [Vercel](https://vercel.com) - Zero configuration deployments
- [Netlify](https://netlify.com) - Easy deployment with continuous integration
- [AWS Amplify](https://aws.amazon.com/amplify/) - Full stack serverless solution

## Support and Issue Reporting

If you encounter any issues or have questions, please:

1. Check the [GitHub Issues](https://github.com/mixmi-git/mixmi-profile-production/issues) for existing reports
2. Create a new issue with detailed information if your problem hasn't been reported

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React DnD](https://react-dnd.github.io/react-dnd/) - Drag and Drop for React
- [Stacks Blockchain](https://www.stacks.co/) - Blockchain integration 