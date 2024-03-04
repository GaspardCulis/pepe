import { defineConfig } from "tinacms";
import { LocalAuthProvider } from "tinacms";
import AuthProvider from "../lib/AuthProvider";
import CustomMediaStore from "../lib/MediaStore";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// Your hosting provider likely exposes this as an environment variable
const branch =
	process.env.GITHUB_BRANCH ||
	process.env.VERCEL_GIT_COMMIT_REF ||
	process.env.HEAD ||
	"main";

export const backendUrl =
	typeof window === "undefined"
		? process.env.BACKEND_URL
		: document.location.origin;

export default defineConfig({
	branch,
	contentApiUrlOverride: `${backendUrl}/api/gql`,
	authProvider: isLocal ? new LocalAuthProvider() : new AuthProvider(),

	build: {
		outputFolder: "admin",
		publicFolder: "tina/backend",
	},
	media: {
		loadCustomStore: async () => {
			return CustomMediaStore;
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
					router: () => {
						return "/";
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
					router({ document }) {
						return `/parcours/${document._sys.filename.replace("index", "")}`;
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
			{
				name: "categories",
				label: "Elements de la galerie",
				path: "content/categories",
				ui: {
					router: ({ document }) => {
						return `/galerie/${document._sys.filename}`;
					},
				},
				fields: [
					{
						type: "string",
						name: "name",
						label: "Nom de la catégorie",
						required: true,
						isTitle: true,
					},
					{
						type: "image",
						name: "vignette",
						label: "Vignette",
						required: true,
					},
					{
						type: "object",
						name: "items",
						label: "Elements",
						list: true,
						ui: {
							itemProps(item) {
								return { label: item?.name };
							},
						},
						fields: [
							{
								type: "string",
								name: "name",
								label: "Nom",
								required: true,
								isTitle: true,
							},
							{
								type: "image",
								name: "image",
								label: "Image",
								required: true,
							},
							{
								type: "rich-text",
								name: "description",
								label: "Description",
								required: false,
								isBody: true,
							},
						],
					},
				],
			},
			{
				name: "testimonies",
				label: "Témoignages",
				path: "content/testimonies",
				ui: {
					router: () => {
						return "/temoignages";
					},
				},
				fields: [
					{
						type: "rich-text",
						name: "content",
						label: "Contenu",
						required: true,
						isBody: true,
					},
					{
						type: "string",
						name: "author",
						label: "Auteur",
						required: true,
						isTitle: true,
					},
					{
						type: "datetime",
						name: "date",
						label: "Date de publication",
						ui: {
							dateFormat: "DD-MM-YYYY",
						},
					},
				],
			},
		],
	},
});
