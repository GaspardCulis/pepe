import fetchStrapiApi, {
	toImage,
	type StrapiImageSize,
} from "../../lib/strapi";
import Image from "./image";

export default class GaleryItem {
	private constructor(
		readonly id: number,
		readonly title: string,
		readonly description: string,
		readonly image: Image,
	) {}

	public static async getAll(options?: {
		query?: Record<string, string>;
		size?: StrapiImageSize;
	}): Promise<GaleryItem[]> {
		let out: GaleryItem[] = [];

		const results = await fetchStrapiApi({
			endpoint: "galery-items",
			query: {
				populate: "image",
				...options?.query,
			},
		});

		for (let result of results.data) {
			out.push(
				new GaleryItem(
					result.id,
					result.attributes.title,
					result.attributes.description,
					toImage({
						strapi_image: result.attributes.image.data,
						format: "webp",
						size: options?.size,
					}),
				),
			);
		}

		return out;
	}

	public static async get(
		id: number,
		options?: {
			size?: StrapiImageSize;
		},
	): Promise<GaleryItem> {
		const result = await this.getAll({
			...options,
			query: {
				"filters[id][$eq]": `${id}`,
			},
		});

		return result[0];
	}

	public static async getMatchingCategory(
		category: string, // No strong typing :(
		options?: {
			size?: StrapiImageSize;
		},
	): Promise<GaleryItem[]> {
		return await this.getAll({
			...options,
			query: {
				"filters[category][slug][$eq]": category,
			},
		});
	}
}
