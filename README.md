# Ajanta Hotel

Ajanta Hotel is an offline room tracking app built with Vite, React, and TypeScript. It supports features like room occupancy/maintenance toggling, local history per room, and offline/local storage support.

## Features

- Grid of up to 300 rooms
- Toggle room status (available, occupied, maintenance)
- Local history tracking for each room
- Offline/local storage support

## How to Download and Run the App

### Download the App

1. Visit the repository: [Ajanta Hotel](https://github.com/Sathvik265/Ajanta-Hotel).
2. Click the green **Code** button and select **Download ZIP**.
3. Extract the ZIP file to access the project files.

Alternatively, clone the repository using Git:

```bash
git clone https://github.com/Sathvik265/Ajanta-Hotel.git
```

### Run the App Locally

1. Open a terminal in the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL (e.g., `http://localhost:3000`) in your browser to view the app.

### Run the App Using Electron

1. For development mode:
   ```bash
   npm run electron:dev
   ```
2. For production mode:
   ```bash
   npm run electron:build
   ```

### Build for Production

To create a production build of the app:

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment

This app is configured for deployment on GitHub Pages. To deploy:

1. Build the app:
   ```bash
   npm run build
   ```
2. Push the `dist` folder to the `gh-pages` branch:
   ```bash
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

## License

This project is licensed under the MIT License.

---

_This project was bootstrapped with Vite + React + TypeScript._

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
