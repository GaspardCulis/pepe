import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
	process.env.GITHUB_BRANCH ||
	process.env.VERCEL_GIT_COMMIT_REF ||
	process.env.HEAD ||
	"main";

export default defineConfig({
	branch,

	// Get this from tina.io
	clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
	// Get this from tina.io
	token: process.env.TINA_TOKEN,

	build: {
		outputFolder: "admin",
		publicFolder: "public",
	},
	media: {
		tina: {
			mediaRoot: "",
			publicFolder: "public",
		},
	},
	// See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
	schema: {
		collections: [
			{
				name: "home",
				label: "Acceuil",
				path: "content/home",
				ui: {
					allowedActions: {
						create: false,
						delete: false,
					},
					filename: {
						readonly: true,
					},
				},
				fields: [
					{
						type: "rich-text",
						name: "quote",
						label: "Citation",
						required: true,
						isBody: true,
					},
				],
			},
			{
				name: "story",
				label: "Histoire",
				path: "content/story",
				ui: {
					allowedActions: {
						create: false,
						delete: false,
					},
					filename: {
						readonly: true,
					},
				},
				fields: [
					{
						type: "string",
						name: "title",
						label: "Titre de la page",
						required: true,
						isTitle: true,
					},
					{
						type: "rich-text",
						name: "body",
						label: "Contenu",
						required: true,
						isBody: true,
					},
				],
			},
		],
	},
});
