# WriteSpace

A modern, role-based writing workspace application built with React and Vite. WriteSpace provides a clean, distraction-free environment for writers, editors, and administrators to collaborate on written content.

## Features

- **Role-Based Access Control** — Three distinct user roles (Writer, Editor, Admin) with tailored permissions and views
- **Distraction-Free Writing** — Clean, minimal interface optimized for focused writing sessions
- **Local Persistence** — All data persisted to localStorage for seamless offline-first usage
- **Responsive Design** — Fully responsive layout built with Tailwind CSS, works on desktop, tablet, and mobile
- **Dark Mode Support** — Toggle between light and dark themes for comfortable writing in any environment
- **Document Management** — Create, edit, delete, and organize documents with ease
- **Real-Time Word Count** — Live word and character count tracking as you write

## Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **Language:** JavaScript (ES6+ with JSX)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** React Context API + useReducer
- **Persistence:** localStorage
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint

## Folder Structure

```
writespace/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                  # Static assets (images, icons)
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared components (Button, Modal, Input)
│   │   ├── editor/              # Editor-specific components
│   │   ├── layout/              # Layout components (Header, Sidebar, Footer)
│   │   └── documents/           # Document list and card components
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.jsx      # Authentication and role management
│   │   └── DocumentContext.jsx  # Document state management
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js           # Auth context consumer hook
│   │   ├── useDocuments.js      # Document CRUD operations hook
│   │   └── useLocalStorage.js   # localStorage read/write hook
│   ├── pages/                   # Route-level page components
│   │   ├── Dashboard.jsx        # Main dashboard view
│   │   ├── Editor.jsx           # Writing/editing page
│   │   ├── Login.jsx            # Login/role selection page
│   │   ├── Documents.jsx        # Document listing page
│   │   └── Settings.jsx         # User settings page
│   ├── services/                # Data access layer
│   │   └── storageService.js    # localStorage abstraction
│   ├── utils/                   # Utility functions
│   │   ├── constants.js         # App-wide constants
│   │   └── helpers.js           # Helper functions
│   ├── App.jsx                  # Root component with router
│   ├── main.jsx                 # Entry point (renders App)
│   └── index.css                # Tailwind directives and global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
# Create a production build
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel
```

### Option 2: Git Integration

1. Push your repository to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"New Project"** and import your repository
4. Vercel will auto-detect the Vite framework and configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**

### Environment Variables (Vercel)

If you use any environment variables, add them in the Vercel dashboard under **Settings → Environment Variables**. All client-side variables must be prefixed with `VITE_`.

## localStorage Schema

All application data is persisted in the browser's localStorage under namespaced keys:

### `writespace_user`

Stores the current authenticated user session.

```json
{
  "id": "usr_abc123",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "writer",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "lastLoginAt": "2024-06-01T08:00:00.000Z"
}
```

### `writespace_documents`

Stores all documents as an array.

```json
[
  {
    "id": "doc_xyz789",
    "title": "My First Draft",
    "content": "Lorem ipsum dolor sit amet...",
    "authorId": "usr_abc123",
    "authorName": "Jane Doe",
    "status": "draft",
    "wordCount": 1250,
    "charCount": 7340,
    "tags": ["fiction", "chapter-1"],
    "createdAt": "2024-05-20T14:00:00.000Z",
    "updatedAt": "2024-06-01T09:15:00.000Z"
  }
]
```

**Document statuses:** `draft` | `in_review` | `approved` | `published` | `archived`

### `writespace_settings`

Stores user preferences.

```json
{
  "theme": "dark",
  "fontSize": 16,
  "fontFamily": "serif",
  "autoSaveInterval": 30000,
  "showWordCount": true,
  "spellCheck": true
}
```

## Role-Based Access

WriteSpace implements three user roles, each with distinct permissions:

### Writer

| Permission | Access |
|---|---|
| Create documents | ✅ |
| Edit own documents | ✅ |
| Delete own documents | ✅ |
| View own documents | ✅ |
| Submit for review | ✅ |
| Edit others' documents | ❌ |
| Approve/reject documents | ❌ |
| Manage users | ❌ |

### Editor

| Permission | Access |
|---|---|
| Create documents | ✅ |
| Edit own documents | ✅ |
| Delete own documents | ✅ |
| View all documents | ✅ |
| Edit others' documents | ✅ |
| Approve/reject documents | ✅ |
| Publish documents | ✅ |
| Manage users | ❌ |

### Admin

| Permission | Access |
|---|---|
| All Editor permissions | ✅ |
| Manage users | ✅ |
| Delete any document | ✅ |
| View system settings | ✅ |
| Manage roles | ✅ |
| Access analytics | ✅ |

### How It Works

1. **Login/Role Selection** — On first visit, users select their role (or log in with credentials if auth is configured). The role is stored in `writespace_user` in localStorage.
2. **Route Guards** — Protected routes check the user's role before rendering. Unauthorized access redirects to the dashboard with a notification.
3. **UI Adaptation** — Navigation items, action buttons, and page sections are conditionally rendered based on the current user's role using the `useAuth` hook.
4. **Context-Driven** — The `AuthContext` provider wraps the entire app and exposes `user`, `role`, `login`, `logout`, and permission-checking utilities (`canEdit`, `canDelete`, `canPublish`, `canManageUsers`).

## Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run test suite with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint source files with ESLint |

## License

**Private** — All rights reserved. This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.