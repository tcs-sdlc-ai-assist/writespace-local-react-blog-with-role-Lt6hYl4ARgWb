# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Public Landing Page**: Welcoming homepage with featured blog posts and call-to-action sections for new visitors.
- **Authentication System**: Complete login and registration flow with form validation and error handling.
- **Role-Based Routing**: Protected routes with role-based access control supporting admin and regular user roles.
- **Blog CRUD with Ownership**: Full create, read, update, and delete operations for blog posts with ownership enforcement — users can only edit and delete their own posts.
- **Admin Dashboard**: Dedicated admin panel with overview statistics, content moderation tools, and system management capabilities.
- **User Management**: Admin-level user management interface for viewing, editing, and managing user accounts and roles.
- **Avatar System**: User avatar support with selection and display across the application, including profile pages and blog post author sections.
- **Responsive Tailwind UI**: Fully responsive user interface built with Tailwind CSS utility classes, optimized for mobile, tablet, and desktop viewports.
- **localStorage Persistence**: Client-side data persistence using localStorage for authentication state, user preferences, and session management.
- **Vercel Deployment**: Production-ready configuration for seamless deployment on the Vercel platform with proper build settings and routing support.