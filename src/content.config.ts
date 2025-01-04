import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const categories = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/categories" }),
    schema: z.object({
        name: z.string(),
        vignette: z.string(), // URL to CMS
        items: z.array(z.object({
            name: z.string(),
            image: z.string(), // URL to CMS
            description: z.string()
        }))
    })
});

const story = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/story" }),
    schema: z.object({
        slug: z.string(),
        title: z.string()
    })
});

const testimonies = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/testimonies" }),
    schema: z.object({
        author: z.string(),
        date: z.coerce.date().optional(),
    })
});

export const collections = { categories, story, testimonies };