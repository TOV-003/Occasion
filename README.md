# Occasion - Event Discovery Platform

**So, What's the Occasion?**

Occasion is a modern event discovery platform that helps users find curated events from collectives and independent organisers across major cities. Browse, search, and discover the perfect event for any occasion.

## 📋 Features

- **Event Discovery**: Browse featured and all events in an intuitive interface
- **Smart Search**: Search events by title and keywords
- **Date Filtering**: Filter events by specific dates
- **Location-Based**: Discover events in Lagos, Abuja, and Port Harcourt
- **Category Browsing**: Explore 11 event categories:
  - Nightlife, Festival, Arts, Sports, Food, Business, Education, Social, Family, Wellness, and more
- **Featured Events**: Highlighted curated events with rich media displays
- **User Authentication**: Secure login with Supabase integration
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication & Database)
- **Routing**: React Router
- **Icons**: Lucide React
- **Linting**: ESLint





## 📁 Project Structure

```
src/
├── pages/           # Page components (Home, Login, etc.)
├── components/      # Reusable UI components
├── context/         # React Context for state management (Auth)
├── api/            # Supabase client configuration
├── assets/         # Images and static files
├── Layout.tsx      # Main layout wrapper
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## 🔐 Authentication

The app uses Supabase for secure authentication. Users can log in via the Login page and their session is managed through the AuthContext.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The project uses Tailwind CSS with custom color variables for theming. Key color variables:
- `--color-accent` - Primary accent color
- `--color-inputbg` - Input background
- `--color-inputaccent` - Input text color

## 📦 Deployment

The project is configured for Vercel deployment. See `vercel.json` for deployment configuration.

## 📄 License
