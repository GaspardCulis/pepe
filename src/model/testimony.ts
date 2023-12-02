import fetchStrapiApi from "../../lib/strapi";

export default class Testimony {
	private constructor(
		readonly author: string,
		readonly content: string,
		readonly date: string,
	) {}

	public static async getAll(): Promise<Testimony[]> {
		let out: Testimony[] = [];

		const results = await fetchStrapiApi({
			endpoint: "testimonies",
		});

		for (let result of results.data) {
			out.push(
				new Testimony(
					result.attributes.author,
					result.attributes.content,
					result.attributes.date,
				),
			);
		}

		return out;
	}
}
