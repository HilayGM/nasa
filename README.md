<<<<<<< HEAD
# NASA APOD Explorer
=======
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

[![AI Powered](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=openai&logoColor=white)](https://deepmind.google/technologies/gemini/)

[![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[![v0.dev](https://img.shields.io/badge/v0.dev-black?style=for-the-badge&logo=vercel&logoColor=white)](https://v0.dev)


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
>>>>>>> bdf4e35b790542f6eeaa3482ecd12147e4dcc97a

A modern, interactive web application built with [Next.js](https://nextjs.org) that explores the cosmos using NASA's Astronomy Picture of the Day (APOD) API. This project features stunning visuals, smooth animations, and interactive elements to provide an engaging user experience.

## 🚀 Features

-   **Astronomy Picture of the Day**: Fetches and displays the latest images and videos from NASA's APOD API.
-   **Featured Showcase**: Highlights the most recent entry with detailed descriptions and immersive animations.
-   **Interactive Grid**: A dynamic grid of recent APOD entries.
-   **Drag & Drop Interface**: Reorder cards in the grid using [Swapy](https://swapy.tuhin.dev/) for a personalized layout.
-   **Immersive Background**: A custom "Tubes" background effect for visual depth.
-   **Smooth Animations**: Powered by [GSAP](https://gsap.com/) and CSS transitions for a polished feel.


## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & CSS Modules
-   **Animations**: [GSAP](https://gsap.com/) (GreenSock Animation Platform)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Drag & Drop**: [Swapy](https://swapy.tuhin.dev/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives

## 📦 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd nasa
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🔑 Configuration

The project currently uses a hardcoded demo API key from NASA. For production or heavy use, you should obtain your own API key.

1.  Get a free API Key from [api.nasa.gov](https://api.nasa.gov/).
2.  (Optional) Update the `api_key` variable in `app/page.tsx` with your new key.

## 📂 Project Structure

```
├── app/
│   ├── components/      # Reusable UI components
│   │   ├── cards/       # Interactive card components
│   │   ├── featured/    # Featured APOD section
│   │   ├── hero/        # Hero section
│   │   ├── fondo/       # Background effects
│   │   └── v0/          # Additional UI sections
│   ├── globals.css      # Global styles and Tailwind directives
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page and data fetching logic
├── public/              # Static assets
└── documentation/       # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).


