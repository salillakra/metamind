# MetaMind

Welcome to the MetaMind project! A modern, feature-rich blogging and content platform built with Next.js.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Automated Features](#automated-features)
- [Contributing](#contributing)
- [License](#license)

## Introduction

MetaMind is a modern blogging and content platform that provides a feature-rich environment for authors to publish and share insightful articles. Built with Next.js and a robust tech stack, it offers a seamless experience for both content creators and readers with features like user authentication, comment sections, post management, and more.

## Features

- **User Authentication**: Secure sign-up and sign-in functionality
- **Author Profiles**: Customizable author pages with bio and profile images
- **Content Management**: Create, edit, and publish blog posts
- **Rich Text Editor**: TipTap-based editor for creating beautifully formatted content
- **Comments & Replies**: Interactive comment system with reply functionality
- **Like & Share**: Engagement features for posts and comments
- **Categories & Tags**: Organize content with categories and trending tags
- **Featured Posts**: Highlight important or popular content with automated daily rotation
- **Dashboard**: Author statistics and post management
- **Responsive Design**: Mobile-friendly interface
- **Image Upload**: Cloudinary integration for image hosting
- **Automated Post Management**: GitHub Actions for daily featured post selection

## Tech Stack

MetaMind is built using a modern tech stack to ensure high performance and scalability:

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: For type safety and improved developer experience
- **Prisma**: ORM for database access with type-safe queries
- **MongoDB**: NoSQL database for flexible data storage
- **TanStack Query**: Data fetching and state management
- **TanStack Store**: State management for application data
- **TipTap**: Extensible rich text editor
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Headless UI components
- **Cloudinary**: Cloud-based image management
- **GitHub Actions**: CI/CD automation for featured post rotation

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm or Bun package manager
- MongoDB instance or connection string
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/metamind.git
   cd metamind
   ```

2. Install dependencies:

   ```sh
   npm install
   # or with Bun
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="your_mongodb_connection_string"

   # Auth
   NEXTAUTH_SECRET="your_auth_secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. Generate Prisma client:

   ```sh
   npx prisma generate
   ```

5. Push schema to database (development only):
   ```sh
   npx prisma db push
   ```

## Usage

### Development

Run the development server:

```sh
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build for production:

```sh
npm run build
```

### Start Production Server

```sh
npm start
```

## Project Structure

The project follows a modern Next.js application structure:

```
metamind/
├── app/               # Next.js application routes and API endpoints
│   ├── api/           # API routes
│   ├── author/        # Author profile pages
│   ├── posts/         # Blog post pages
│   ├── secure/        # Protected routes (dashboard, profile)
│   ├── signin/        # Authentication pages
│   └── signup/        # Registration pages
├── auth/              # Authentication utilities
├── components/        # React components
│   ├── tiptap-editor/ # Rich text editor components
│   └── ui/            # UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and libraries
│   └── generated/     # Generated Prisma client
├── Post/              # Post-related actions and utilities
├── prisma/            # Prisma schema and migrations
├── public/            # Static assets
├── scripts/           # Automation scripts
├── store/             # Application state management
└── styles/            # Global styles and variables
```

## Automated Features

### Daily Featured Post Rotation

MetaMind uses GitHub Actions to automatically rotate featured posts daily, ensuring fresh content is always highlighted on the platform:

- **Automation Schedule**: Runs daily at midnight (UTC)
- **Selection Process**:
  - Selects posts based on engagement metrics (likes, views)
  - Prioritizes recent content
  - Randomly selects from top candidates
- **Implementation**:
  - Located in `.github/workflows/daily-featured-post.yml`
  - Script in `scripts/update-featured-post.js`

#### Setting Up GitHub Secrets for Automation

To enable the featured post automation, you need to add your database credentials as a GitHub repository secret:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click on "New repository secret"
4. Add a secret named `DATABASE_URL` with your database connection string
5. Click "Add secret"

#### Customizing Selection Criteria

To customize the selection criteria, edit the script in `scripts/update-featured-post.js` and adjust the query parameters to match your preferred post selection logic. For example:

```javascript
// Find posts with specific criteria
const candidates = await prisma.post.findMany({
  where: {
    published: true,
    category: "Technology", // Target specific categories
    views: { gte: 100 }, // Only posts with at least 100 views
    // Add other criteria as needed
  },
  orderBy: [
    // Customize ordering logic
    { likes: "desc" },
    { views: "desc" },
    { createdAt: "desc" },
  ],
  // ...
});
```

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create a feature branch:
   ```sh
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```sh
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
