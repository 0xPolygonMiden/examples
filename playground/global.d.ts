import "@testing-library/jest-dom/extend-expect";
declare module '*.md' {
	const value: string; // markdown is just a string
	export default value;
}
