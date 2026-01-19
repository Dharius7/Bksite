# Coral Credit Bank LTD - Banking Website

A modern, responsive banking website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🏦 **Modern Banking Interface** - Clean and professional design matching the Coral Credit Bank LTD brand
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🔐 **User Authentication** - Login page with secure form handling
- 💳 **Account Creation** - Multi-step account opening process
- 🎨 **Beautiful UI Components** - Glass morphism effects, gradients, and smooth animations
- ⚡ **Fast Performance** - Built with Next.js 14 for optimal performance

## Project Structure

```
├── app/
│   ├── page.tsx              # Homepage
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── open-account/
│   │   └── page.tsx           # Account creation page
│   ├── account-success/
│   │   └── page.tsx          # Success page after account creation
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Header.tsx            # Navigation header
│   ├── Hero.tsx              # Hero section
│   ├── Rates.tsx             # Interest rates section
│   ├── Services.tsx          # Services grid
│   ├── About.tsx             # About section
│   ├── Promotional.tsx       # Promotional offer section
│   ├── Testimonials.tsx      # Customer testimonials
│   ├── Contact.tsx           # Contact information
│   └── Footer.tsx            # Footer component
└── package.json              # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Pages

### Homepage (`/`)
- Hero section with mission statement
- Interest rates showcase
- Services overview
- About section
- Promotional offers
- Customer testimonials
- Contact information
- Footer with navigation

### Login (`/login`)
- Secure login form
- Email and password authentication
- Remember me option
- Forgot password link
- Link to account creation

### Open Account (`/open-account`)
- Multi-step form (3 steps)
- Personal information
- Address information
- Account setup
- Form validation
- Progress indicator

### Account Success (`/account-success`)
- Confirmation message
- Next steps information
- Navigation options

## Services

The Services dropdown includes:
- Personal Banking
- Business Banking
- Loans & Credit
- Cards

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hooks** - State management

## Responsive Design

The website is fully responsive with breakpoints for:
- Mobile devices (< 768px)
- Tablets (768px - 1024px)
- Desktop (> 1024px)

## Future Enhancements

- Backend API integration
- User authentication system
- Database integration
- Payment processing
- Account dashboard
- Transaction history
- Online banking features

## License

This project is private and proprietary.
