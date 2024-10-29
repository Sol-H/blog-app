# SolBlog - A Modern Markdown Blogging Platform

This is a [Next.js](https://nextjs.org) blogging platform that allows users to create, edit, and share their blogs using Markdown. Built with modern web technologies and cloud infrastructure.

## Features

- **Markdown Support**: Write blogs using Markdown syntax with real-time preview
- **User Authentication**: Secure login via Google and GitHub using NextAuth.js
- **Personal Blog Pages**: Each user gets their own public profile page with their blogs
- **Cloud Storage**: Blog content stored in AWS S3 with MongoDB metadata
- **Search Functionality**: Search through all blogs with instant results
- **Dark Mode**: Built-in dark mode support for comfortable reading
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Authentication**: NextAuth.js with Google and GitHub providers
- **Database**: MongoDB for user data and blog metadata
- **Storage**: AWS S3 for blog content storage
- **Styling**: TailwindCSS with custom components
- **Analytics**: Vercel Analytics

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   
```
env
MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET=your_aws_secret
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and database connections
- `/public` - Static assets
- `/types` - TypeScript type definitions

## Features in Detail

### Authentication

Users can sign in using their Google or GitHub accounts. Upon first login, a unique username is generated based on their display name or email.

### Blog Creation

Users can create blogs using Markdown with a live preview feature. The editor supports:

- Real-time Markdown preview
- Code syntax highlighting
- Table formatting

### Storage Architecture

- Blog metadata (title, description, user info) stored in MongoDB
- Full blog content stored in AWS S3 buckets
- Efficient retrieval system for fast blog loading

### Search Functionality

Full-text search implementation across all blogs, searching through titles and content with real-time results.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
