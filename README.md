# Occasion - Event Discovery & Management Platform

**So, What's the Occasion?**

Occasion is a comprehensive event discovery and management platform that connects users with curated events from collectives and independent organizers. Whether you're looking to attend exciting events or organize your own, Occasion provides the tools you need to discover, create, and manage events seamlessly.

## 🌟 Key Features

### For Event Attendees
- **Discover Events**: Browse featured and trending events with rich media displays
- **Smart Search**: Find events by title, keywords, and categories
- **Advanced Filtering**: Filter by date, location, and event type
- **Bookmark Events**: Save interesting events for later
- **QR Ticket System**: Digital tickets with QR codes for easy check-in
- **Collective Following**: Follow your favorite event organizers

### For Event Organizers
- **Create Events**: Build detailed event listings with banners, descriptions, and dates
- **Manage Collectives**: Organize events under collective groups
- **Ticket Management**: Approve or reject ticket requests with manual or automatic approval
- **Staff Management**: Assign service and access staff for event management
- **Check-in System**: Scan QR codes for seamless attendee check-in

### For Collective Owners
- **Collective Creation**: Establish your own event collective
- **Member Management**: Approve or reject member join requests
- **Event Organization**: Host events under your collective banner
- **Auto-Approval Settings**: Configure automatic ticket approval for members



## 🏷️ Event Categories

Explore 11 diverse event categories:
- **Nightlife** - Parties, club events, and nightlife experiences
- **Festival** - Music festivals, cultural celebrations
- **Arts** - Art exhibitions, theater, performances
- **Sports** - Matches, tournaments, fitness events
- **Food** - Food festivals, dining experiences
- **Business** - Conferences, networking, workshops
- **Education** - Classes, seminars, learning events
- **Social** - Gatherings, meetups, social events
- **Family** - Kid-friendly activities and outings
- **Wellness** - Yoga, meditation, health events
- **And more** - Additional specialized categories

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS with custom theme variables
- **Icons**: Lucide React for beautiful, consistent icons
- **Routing**: React Router DOM for navigation
- **Forms**: Native HTML forms with custom styling

### Backend & Data
- **Database & Auth**: Supabase (PostgreSQL database + authentication)
- **Storage**: Supabase Storage for event banners and images
- **Realtime**: Supabase Realtime for live updates

### Development Tools
- **Linting**: ESLint for code quality
- **Type Checking**: TypeScript for type safety
- **Deployment**: Configured for Vercel

## 📁 Project Structure

```
src/
├── pages/                      # Page components
│   ├── Home.tsx               # Landing page with featured events
│   ├── EventPage.tsx          # Single event details
│   ├── Profile.tsx            # User profile with events
│   ├── Dashboard.tsx          # User dashboard
│   ├── Collectives.tsx        # Collective listings
│   ├── CollectivePage.tsx     # Single collective details
│   ├── NewEvent.tsx           # Event creation form
│   ├── NewCollective.tsx      # Collective creation form
│   ├── ManageEvent.tsx        # Event management
│   ├── ManageCollective.tsx   # Collective management
│   ├── Settings.tsx           # User settings
│   ├── Login.tsx              # Authentication
│   └── ...
├── components/                 # Reusable UI components
│   ├── Navbar.tsx            # Navigation bar
│   ├── Footer.tsx            # Site footer
│   ├── QrCodeDisplay.tsx     # QR code component
│   ├── QrCodeScanner.tsx     # QR code scanner
│   ├── ShareButton.tsx       # Social sharing
│   └── ...
├── context/                    # React Context providers
│   └── UseAuth.tsx           # Authentication context
├── api/                       # API clients and configurations
│   └── SupabaseClient.ts     # Supabase client setup
├── interfaces/                # TypeScript interfaces
├── assets/                    # Static assets
├── Layout.tsx                 # Main layout wrapper
├── App.tsx                    # Root component with routes
└── main.tsx                   # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TOV-003/Occasion.git
cd Occasion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🎨 Design System

### Color Theme

The project uses CSS custom properties for theming:

```css
--color-accent: #4F46E5;        /* Primary brand color (Indigo) */
--color-accent-dark: #4338CA;   /* Darker accent variant */
--color-inputbg: #F9FAFB;        /* Input background */
--color-inputaccent: #6B7280;   /* Input text/border color */
```

### Typography

- **Font Family**: Inter (default browser fonts as fallback)
- **Headings**: Bold weight for emphasis
- **Body**: Regular weight for readability

## 🔐 Authentication

Occasion uses Supabase for authentication with the following features:
- Email/password login
- Google OAuth sign-in
- Session management via AuthContext
- Protected routes for authenticated users

## 📦 Deployment

### Vercel Deployment (Recommended)

The project is pre-configured for Vercel deployment:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your Supabase environment variables
4. Deploy!

See `vercel.json` for deployment configuration.

### Environment Variables

Required for production:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.
