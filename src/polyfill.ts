import "./polyfill-install.mjs";

declare global {
  interface Uint8Array {
    toBase64(): string;
  }

  interface Uint8ArrayConstructor {
    fromBase64(string: string): Uint8Array;
  }
}
