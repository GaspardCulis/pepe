import fetchStrapiApi, { toImage } from "../../lib/strapi";
import type Image from "./image";

export default class GaleryCategory {
	private constructor(
		readonly name: string,
		readonly vignette: Image | undefined,
		readonly slug: string,
	) {}

	public static async getAll(
		query_vignette: boolean = false,
	): Promise<GaleryCategory[]> {
		let out: GaleryCategory[] = [];

		const results = await fetchStrapiApi({
			endpoint: "galery-categories",
			query: query_vignette ? { populate: "vignette" } : undefined,
		});

		for (let result of results.data) {
			out.push(
				new GaleryCategory(
					result.attributes.name,
					query_vignette
						? toImage(result.attributes.vignette.data)
						: undefined,
					result.attributes.slug,
				),
			);
		}

		return out;
	}
}
