import '@testing-library/jest-dom/extend-expect';

declare module '*.md' {
  const value: string;
  export default value;
}