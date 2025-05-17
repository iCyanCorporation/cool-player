# 🎧 Cool Audio Player

**A web platform that turns any video into an immersive, visually engaging wallpaper experience.**

---

## 📌 Project Overview

**Cool Audio Player** is a modern web application that allows users to select a video URL (e.g., YouTube or other media sources), pair it with a visually striking image, and use the combination as an aesthetic audio-visual wallpaper.

- **Problem Solved**: Many users want a lightweight, elegant way to enjoy music or podcasts with dynamic backgrounds instead of watching videos. Cool Audio Player delivers a focused audio experience with visual customization.
- **Target Audience**:

  - Music and podcast listeners
  - Creatives and content curators
  - Desktop and mobile wallpaper enthusiasts

---

## 🏗 Architecture & Design Principles

### 🧱 Technology Stack

| Component         | Tech                      |
| ----------------- | ------------------------- |
| Frontend          | Next.js (App Router)      |
| Styling           | TailwindCSS + ShadCN UI   |
| Audio/Video Logic | Custom Hooks & HTML5 APIs |
| Cloud Backend     | AWS Amplify Gen 2         |
| Testing           | Jest                      |
| Deployment        | Amplify Hosting (CI/CD)   |

### 🧠 Design Decisions

- **Modularity**: Code is component-driven with a focus on reusable UI and logic blocks.
- **Scalability**: Built on Amplify Gen 2 with separation of frontend/backend for horizontal scaling.
- **Developer Experience**: Shadcn UI and Tailwind for rapid UI development; Jest for reliable test coverage.
- **Performance**: Minimal dependencies and lazy loading of video/audio resources to reduce load time.

---

## 🛠 Installation & Setup

> 💡 Requirements: Node.js ≥ 18, Amplify CLI, Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/cool-audio-player.git
cd cool-audio-player
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Initialize ShadCN UI (if first-time setup)

```bash
npx shadcn@latest init
```

### 4. Amplify Gen 2 Setup

Deploy on Amplify

> This will build your Amplify Gen 2 backend and generate the `amplify_outputs.json` file required for your app.

### 5. Create `.env.local`

```dotenv
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
AMPLIFY_PROJECT_ID=your-amplify-id
```

---

## ▶️ Usage Guidelines

### Run Development Server

```bash
npm run dev
```

Access at: `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm run test
```

---

## 🧬 Code & Folder Structure

```
cool-audio-player/
├── app/                   # Next.js app routes
│   ├── [lng]/             # Internationalized routes (language folders)
│   │   └── (routes)/      # Route group for localized pages
│   │       └── page.tsx   # Home route
│   └── api/               # API routes if any
├── components/            # Shared React components
├── lib/                   # Utilities, helpers
├── hooks/                 # Custom hooks (e.g., useAudioPlayer)
├── public/                # Static files (e.g., default images)
├── styles/                # Tailwind config and global CSS
├── tests/                 # Jest test files
├── amplify/               # Amplify backend config
├── .env.local.example     # Environment variable template
└── README.md
```

### Naming & Conventions

- **File Naming**: `camelCase` for files, `PascalCase` for React components.
- **Code Formatting**: Prettier + ESLint (included in `devDependencies`)
- **Components**: Co-located with styles/test files where appropriate

---

## 🤝 Contribution & Collaboration

We welcome contributions from the community!

### Branching Model

- `main`: Production-ready code
- `dev`: Active development
- Feature branches: `feature/xyz`, `bugfix/abc`

### Pull Request Process

1. Fork the repository
2. Create a new branch from `dev`
3. Commit changes with clear messages
4. Ensure tests pass
5. Open a Pull Request with context and screenshots

### Code Review

- Follow project code style
- Avoid breaking existing functionality
- Keep changes focused and minimal

### Reporting Issues & Requesting Features

- File issues under [GitHub Issues](https://github.com/your-org/cool-audio-player/issues)
- Use labels like `bug`, `enhancement`, `question`

---

## 📄 Licensing & Contact Information

### License

MIT License
© 2025 \[Your Organization or Name]

### Maintainers

- [GitHub](https://github.com/iCyanCorporation) | [Email](mailto:you@example.com)

For support or inquiries, please open an issue or contact us directly.
