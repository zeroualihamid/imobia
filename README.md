# IMOBIA - Artificial Intelligence for Real Estate

A comprehensive real estate management platform built with modern web technologies.

## Features

- **Property Management**: Create, edit, and manage real estate properties
- **Voice Property Creation**: Use voice commands to create property listings
- **Task Management**: Track and manage real estate tasks and workflows
- **User Management**: Role-based access control for different user types
- **Interactive Maps**: Property location visualization with Leaflet
- **Real-time Updates**: Live task updates and notifications
- **Multi-language Support**: Internationalization support
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Build Tool**: Vite
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Maps**: Leaflet
- **Voice**: ElevenLabs integration
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd imobia
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── taches/         # Task-related components
│   └── rbac/           # Role-based access control
├── pages/              # Page components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── integrations/       # External service integrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
