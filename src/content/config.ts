import { defineCollection, z } from "astro:content";

const galeryCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			image: image().refine((img) => img.width >= 512, {
				message: "Cover image must be at least 1080 pixels wide!",
			}),
			imageAlt: z.string(),
			category: z.enum(["jarre", "modelage", "cristallisation"]),
		}),
});

export const collections = {
	galerie: galeryCollection,
};
