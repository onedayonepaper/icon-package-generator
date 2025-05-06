# Icon Package Generator

A web application that generates a complete set of icons and manifest.json for your web app from a single PNG image.

## Features

- Upload a 1024x1024 PNG image
- Generate multiple icon sizes
- Customize manifest settings
- Preview image with size controls
- Download as a ZIP package
- Internationalization support (English/Korean)

## Live Demo

Visit the live demo at: [https://haneulhaneul.github.io/icon-package-generator](https://haneulhaneul.github.io/icon-package-generator)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- react-dropzone

## License

MIT

## Project Structure

```
icon-pkg-generator/
├─ app/                 # Next.js UI
│  ├─ page.tsx         # Main page
│  └─ components/      # React components
├─ src/
│  ├─ generate.ts      # Core icon generation
│  └─ sizes.ts         # Icon size definitions
├─ tests/              # Test files
└─ public/             # Static assets
``` 