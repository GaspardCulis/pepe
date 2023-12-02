import fetchStrapiApi from "../../lib/strapi";

export default class Chronology {
	private constructor(readonly content: string) {}

	public static async get(): Promise<Chronology> {
		const result = await fetchStrapiApi({
			endpoint: "chronology",
		});

		return new Chronology(result.data.attributes.content);
	}
}
