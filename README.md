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

exception

npm install @zxing/browser
npm install @zxing/library
npm install react-barcode-reader
npm install react-barcode-scanner

dependencies

npm install @cloudinary/react
npm install @cloudinary/url-gen
npm install @heroicons/react
npm install @hookform/error-message
npm install @hookform/resolvers
npm install @reduxjs/toolkit
npm install @uidotdev/usehooks
npm install axios
npm install caniuse-lite
npm install classnames
npm install framer-motion
npm install date-fns
npm install date-fns-tz
npm install dayjs
npm install jwt-decode
npm install lodash-es
npm install millify
npm install react-hook-form
npm install react-icons
npm install react-redux
npm install react-router-dom
npm install react-time-ago
npm install react-toastify
npm install react-virtuoso
npm install socket.io-client
npm install styled-components
npm install use-debounce
npm install usehooks-ts
npm install uuid

/**\*\***\*\***\*\***\***\*\***\*\***\*\***/

dev dependencies

npm install -D @eslint/js
npm install -D @tailwindcss/forms
npm install -D @types/lodash-es
npm install -D @types/numeral
npm install -D @types/qs
npm install -D @types/react
npm install -D @types/react-dom
npm install -D @vitejs/plugin-react
npm install -D autoprefixer
npm install -D eslint
npm install -D eslint-plugin-react-hooks
npm install -D eslint-plugin-react-refresh
npm install -D eslint-plugin-tailwindcss
npm install -D globals
npm install -D html5-qrcode
npm install -D postcss
npm install -D tailwindcss
npm install -D typescript
npm install -D typescript-eslint
npm install -D vite
npm install -D vite-plugin-mkcert

install all shadcn ui at once

npx shadcn add alert-dialog
npx shadcn add aspect-ratio
npx shadcn add avatar
npx shadcn add badge
npx shadcn add button
npx shadcn add calendar
npx shadcn add card
npx shadcn add carousel
npx shadcn add checkbox
npx shadcn add collapsible
npx shadcn add combobox
npx shadcn add command
npx shadcn add context-menu
npx shadcn add dialog
npx shadcn add dropdown-menu
npx shadcn add form
npx shadcn add hover-card
npx shadcn add input
npx shadcn add label
npx shadcn add menubar
npx shadcn add navigation-menu
npx shadcn add pagination
npx shadcn add popover
npx shadcn add progress
npx shadcn add radio-group
npx shadcn add scroll-area
npx shadcn add select
npx shadcn add separator
npx shadcn add sheet
npx shadcn add skeleton
npx shadcn add slider
npx shadcn add sonner
npx shadcn add switch
npx shadcn add table
npx shadcn add tabs
npx shadcn add textarea
npx shadcn add toast
npx shadcn add toggle
npx shadcn add tooltip
