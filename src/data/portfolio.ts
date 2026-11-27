/**
 * Site content with images attached. The text lives in ./content.ts so the
 * MCP server can read it without going through Vite; this file joins each
 * entry's image key to the built picture from `@/assets/images`.
 *
 * Images are objects (srcset + fallback + intrinsic size), not paths: hand
 * them to <Mark image={...}>.
 */
import { IMAGES, type ImageKey, type Picture } from "@/assets/images";
import * as content from "./content";

type WithPicture<T> = Omit<T, "image"> & { image: Picture };

const withImage = <T extends { image: string }>(item: T): WithPicture<T> => ({
  ...item,
  image: IMAGES[item.image as ImageKey],
});

export type Job = WithPicture<content.Job>;
export type Project = WithPicture<content.Project>;
export type Hobby = WithPicture<content.Hobby>;
export type Activity = WithPicture<content.Activity>;

export const identity = { ...content.identity, headshot: IMAGES.headshot };
export const education = content.education;
export const alsoInto = content.alsoInto;

export const experience: Job[] = content.experience.map(withImage);
export const projects: Project[] = content.projects.map(withImage);
export const hobbies: Hobby[] = content.hobbies.map(withImage);
export const extracurriculars: Activity[] = content.extracurriculars.map(withImage);

export const current = { ...content.current, books: content.current.books.map(withImage) };
