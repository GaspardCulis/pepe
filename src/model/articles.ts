import fetchStrapiApi from "../../lib/strapi";

export default class Articles {
	private constructor(readonly content: string) {}

	public static async get(): Promise<Articles> {
		const result = await fetchStrapiApi({
			endpoint: "articles",
		});

		return new Articles(result.data.attributes.content);
	}
}
