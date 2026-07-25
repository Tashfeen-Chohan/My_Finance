# Personal Finance Manager

Version: 1.0

---

# Vision

Build a modern, production-ready Personal Finance Progressive Web App (PWA).

The application is:

- Mobile-first
- Desktop-friendly
- Offline-first
- Installable
- Fast
- Secure
- Easily extensible

Initially, the application focuses on vehicle fuel and maintenance expenses before expanding into a complete personal finance ecosystem.

---

# Core Principles

- Mobile First
- Desktop Enhanced
- Offline First
- Local First
- Production Ready
- Modular Architecture
- Feature-Based Structure
- Type Safe
- Accessibility First
- Responsive Design

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-themes
- React Hook Form
- Zod
- TanStack Query
- Zustand
- idb
- PWA

## Backend

- Node.js
- Express.js
- REST API

## Authentication

Google OAuth 2.0

Flow

Google Sign-In

↓

Backend verifies Google ID Token

↓

Create user if needed

↓

Generate JWT Access Token

↓

Generate Refresh Token

↓

Store Refresh Token

↓

HttpOnly Cookies

↓

Authenticated Session

## Database

MongoDB Atlas

## Storage

Cloudinary

---

# Modules

Phase 1

- Authentication
- Dashboard
- Vehicle
- Fuel Expenses
- Maintenance
- Settings

Phase 2

- Grocery
- Budget
- Reports
- Categories
- CSV Export

Phase 3

- Bills
- Savings
- Investments
- Goals
- AI Assistant
- OCR Receipts

---

# UI Guidelines

Use shadcn/ui as the design system.

Material-inspired input fields.

Rounded cards.

Large touch targets.

Bottom navigation on mobile.

Sidebar on desktop.

Floating Action Button.

Responsive layouts.

Light Theme

Dark Theme

System Theme

Never hardcode colors.

Always use semantic theme tokens.

---

# Offline Strategy

Read:

IndexedDB

Write:

IndexedDB First

Sync:

Background synchronization when online

Conflict Resolution:

Latest update wins initially

Future support for merge strategies

---

# Folder Structure

src/

app/

components/

features/

hooks/

services/

stores/

db/

lib/

types/

constants/

styles/

public/

---

# Quality Standards

Strict TypeScript

Reusable components

Reusable hooks

No duplicated business logic

ESLint

Prettier

Husky

Feature-based architecture

Lazy loading

Error boundaries

Loading skeletons

Accessibility

Responsive testing

---

# Future

Recurring expenses

Notifications

Shared households

OCR

Voice entry

AI insights

Desktop enhancements

Native mobile app
