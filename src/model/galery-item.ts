import fetchStrapiApi, {
	toImage,
	type StrapiImageSize,
} from "../../lib/strapi";
import Image from "./image";

export default class GaleryItem {
	private constructor(
		readonly title: string,
		readonly description: string,
		readonly image: Image,
	) {}

	public static async getMatchingCategory(
		category: string, // No strong typing :(
		options?: {
			size?: StrapiImageSize;
		},
	): Promise<GaleryItem[]> {
		let out: GaleryItem[] = [];

		const results = await fetchStrapiApi({
			endpoint: "galery-items",
			query: {
				populate: "image",
				"filters[category][slug][$eq]": category,
			},
		});

		for (let result of results.data) {
			out.push(
				new GaleryItem(
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
}
