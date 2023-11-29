import fetchStrapiApi, { toImage } from "../../lib/strapi";
import type Image from "./image";

export default class GaleryCategory {
	private constructor(
		readonly name: string,
		readonly vignette: Image,
		readonly slug: string,
	) {}

	public static async getAll(): Promise<GaleryCategory[]> {
		let out: GaleryCategory[] = [];

		const results = await fetchStrapiApi({
			endpoint: "galery-categories",
			query: { populate: "vignette" },
		});

		for (let result of results.data) {
			out.push(
				new GaleryCategory(
					result.attributes.name,
					toImage(result.attributes.vignette.data),
					result.attributes.slug,
				),
			);
		}

		return out;
	}
}
