import fetchStrapiApi from "../../lib/strapi";

export default class Itenerary {
	private constructor(readonly content: string) {}

	public static async get(): Promise<Itenerary> {
		const result = await fetchStrapiApi({
			endpoint: "parcours",
		});

		return new Itenerary(result.data.attributes.content);
	}
}
