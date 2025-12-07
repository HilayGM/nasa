# Technical Documentation

This document provides a deep dive into the architecture, components, and implementation details of the NASA APOD Explorer application.

## 🏗️ Architecture Overview

The application is built using **Next.js 16** with the **App Router**. It leverages Server Components for the initial shell and Client Components for interactive elements and data fetching.

### Core Technologies
-   **Next.js**: Handles routing and rendering.
-   **React**: UI library for building components.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **GSAP**: Used for complex animations (Hero, Featured section).
-   **Swapy**: Enables drag-and-drop functionality for the card grid.

## 🔄 Data Flow

1.  **Fetching**: Data is fetched client-side in `app/page.tsx` using the `useEffect` hook.
    -   Endpoint: `https://api.nasa.gov/planetary/apod`
    -   Parameters: `count=5` (Fetches 5 random/recent images).
2.  **State Management**:
    -   `nasaData`: Stores the array of APOD objects.
    -   `loading`: Boolean state for loading UI.
    -   `error`: Stores any error messages.
3.  **Distribution**:
    -   The **first item** (`nasaData[0]`) is passed to the `<FeaturedApod />` component.
    -   The **remaining items** (`nasaData.slice(1)`) are passed to the `<Cards />` component.

## 🧩 Component Breakdown

### 1. Main Page (`app/page.tsx`)
The entry point of the application. It orchestrates the data fetching and layout of the main sections.
-   **Responsibility**: Fetch data, handle loading/error states, render `Hero`, `FeaturedApod`, and `Cards`.

### 2. Hero Section (`app/components/hero/Hero.tsx`)
Displays the introductory title and branding.
-   **Styling**: Uses CSS Modules or Tailwind for layout.
-   **Animations**: Likely uses GSAP for entrance animations of text.

### 3. Featured APOD (`app/components/featured/FeaturedApod.tsx`)
Showcases the "Image of the Day" (or the first item fetched).
-   **Props**: Receives a single `NasaData` object.
-   **Features**:
    -   Displays high-quality image/video.
    -   Shows title, date, and explanation.
    -   Includes entrance animations for visual impact.

### 4. Interactive Cards (`app/components/cards/Cards.tsx` & `Card.tsx`)
A grid of APOD entries that allows user interaction.
-   **Cards Container (`Cards.tsx`)**:
    -   Implements `swapy` to enable drag-and-drop reordering of child `Card` components.
    -   Manages the grid layout.
-   **Individual Card (`Card.tsx`)**:
    -   Displays a thumbnail and brief info.
    -   **Hover Effects**: Scales up or reveals info on hover.
    -   **Expand**: May include functionality to view details in a modal or expanded view.

### 5. Background (`app/components/fondo/page.tsx`)
Renders the "Tubes" background effect.
-   **Implementation**: Likely uses Canvas, Three.js, or complex CSS/SVG animations to create a moving background that adds depth without interfering with content readability.

## 🎨 Styling & Theming

-   **Tailwind CSS**: Used for layout, spacing, typography, and colors.
-   **CSS Modules**: Used for component-specific styles where more control or isolation is needed (e.g., `page.module.css`).
-   **Global Styles**: Defined in `app/globals.css`, setting up Tailwind directives and base styles.

## 🔧 Key Libraries & Utilities

-   **Swapy**:
    -   Used in `Cards.tsx`.
    -   Enables "layout agnostic" drag-and-drop. It works by swapping the DOM nodes directly based on user gestures.
-   **GSAP**:
    -   Used for high-performance animations.
    -   Timeline-based animations for synchronized entrance effects.

## 🚀 Future Improvements

-   **Server-Side Rendering (SSR)**: Move data fetching to a Server Component for better SEO and initial load performance.
-   **Pagination**: Load more images as the user scrolls.
-   **Date Picker**: Allow users to select a specific date for the APOD.
-   **Environment Variables**: Secure the API key using `.env.local`.
