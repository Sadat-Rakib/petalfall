// The <script> tag build: registers <petal-fall> and exposes the API as window.Petalfall.
// The element is exported (not just imported) so the build can never treat its registration as dead code.
export { PetalfallElement } from "./element";
export * from "./index";
