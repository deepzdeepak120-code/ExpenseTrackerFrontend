# Expense Tracker Frontend

A React-based frontend for the Expense Tracker API.

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:8080

## Setup

1. Open terminal in the project folder
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Features

- Dashboard with expense summary and charts
- Add, edit, delete expenses
- Manage categories with icons and colors
- Filter expenses by category
- Search expenses
- Responsive design

## API Proxy

The Vite dev server proxies `/api` requests to `http://localhost:8080`, so make sure your Spring Boot backend is running.

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.
