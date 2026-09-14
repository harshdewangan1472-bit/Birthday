import raw from "./magazine_photos.json";

// Prefix every filename with the public path to magazine images folder.
const p = (name) => `/assets/images/magazine/${name}`;

const mapVal = (v) => (Array.isArray(v) ? v.map(p) : p(v));

export const featured = Object.fromEntries(
  Object.entries(raw.featured).map(([k, v]) => [k, mapVal(v)])
);

export const galleries = raw.galleries.map((g) => ({
  title: g.title,
  images: g.images.map(p),
}));
