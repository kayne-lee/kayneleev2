/// <reference types="vite/client" />

/**
 * vite-imagetools emits an object, not a URL string, for `?as=picture` imports.
 * vite/client declares `*.png` etc. as `string`, so these query-suffixed
 * specifiers need their own declarations or TS infers the wrong type.
 */
declare module "*?as=picture" {
  const picture: {
    sources: { webp: string };
    img: { src: string; w: number; h: number };
  };
  export default picture;
}
