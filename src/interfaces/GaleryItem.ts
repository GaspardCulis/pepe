import type { StrapiImage } from "../../lib/strapi";

export default interface GaleryItem {
	id: number;
	attributes: {
		title: string;
		description?: string;
		category: string;
		image: {
			data: StrapiImage;
		};
	};
}
