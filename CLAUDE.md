# Zynx.co Website

Modern React website for Zynx targeting SMB clients.

## Tech Stack

- **Framework**: Vite + React 18
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Deployment**: Netlify

## Development Commands

```bash
npm run dev      # Start dev server on port 3006
npm run build    # Build for production
npm run preview  # Preview production build
```

## Port Authority

- **Port**: 3006
- **Host**: Mac.lan
- **Project**: zynx-corp
- **Description**: Zynx.co website - Vite dev server

## Project Structure

```
src/
├── components/
│   ├── layout/      # Header, Footer, Layout wrapper
│   ├── ui/          # Button, Card, Container
│   └── sections/    # Hero, ServiceCards, BookingWidget
├── pages/           # Home, Services, About, Contact
├── App.jsx          # Router setup
├── main.jsx         # Entry point
└── index.css        # Tailwind config + custom styles
```

## Design System

- **Background**: #2f2f2f (dark gray)
- **Text**: #d5d5d5 (light gray)
- **Text Muted**: #838383
- **Accent**: #6417a3 (purple)
- **Font**: Montserrat (300, 400 weights)

## Deployment

Configured for Netlify via `netlify.toml`. Connect repo to Netlify and deploy from main branch.
