import fetchStrapiApi, {
	toImage,
	type StrapiImageSize,
} from "../../lib/strapi";
import Image from "./image";

export default class GaleryCategory {
	private constructor(
		readonly name: string,
		readonly slug: string,
		readonly vignette: Image,
	) {}

	public static async getAll(
		query_vignette: boolean = false,
		size: StrapiImageSize | undefined = undefined,
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
					result.attributes.slug,
					query_vignette
						? toImage({
								strapi_image: result.attributes.vignette.data,
								format: "webp",
								size,
						  })
						: Image.default(),
				),
			);
		}

		return out;
	}

	public static async getBySlug(
		slug: string,
		query_vignette: boolean = false,
		size: StrapiImageSize | undefined = undefined,
	): Promise<GaleryCategory> {
		const query: any = {
			"filters[slug][$eq]": slug,
		};
		if (query_vignette) {
			query.populate = "vignette";
		}

		const result = (
			await fetchStrapiApi({
				endpoint: "galery-categories",
				query,
			})
		).data[0];

		return new GaleryCategory(
			result.attributes.name,
			result.attributes.slug,
			query_vignette
				? toImage({
						strapi_image: result.attributes.vignette.data,
						format: "webp",
						size,
				  })
				: Image.default(),
		);
	}
}
