/** @type {import('tailwindcss').Config} */
export default {
  // Avoid a single recursive `./src/**` walk — on Windows leftover folders
  // (e.g. deleted `src/components/crop`) can throw EPERM during scandir.
  content: [
    './index.html',
    './src/*.{js,jsx,ts,tsx}',
    './src/components/*.{js,jsx,ts,tsx}',
    './src/components/layout/**/*.{js,jsx,ts,tsx}',
    './src/components/tools/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/constants/**/*.{js,jsx,ts,tsx}',
    './src/lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
