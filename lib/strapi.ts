import Image from "../src/model/image";

interface Props {
	endpoint: string;
	query?: Record<string, string>;
	wrappedByKey?: string;
	wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchStrapiApi({
	endpoint,
	query,
}: Props): Promise<any> {
	if (endpoint.startsWith("/")) {
		endpoint = endpoint.slice(1);
	}

	const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

	if (query) {
		Object.entries(query).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
	}
	const res = await fetch(url.toString());
	let data = await res.json();

	return data;
}

export function toAbsoluteURL(url: string): string {
	return import.meta.env.STRAPI_URL + url;
}

export function toImage(conf: {
	strapi_image: StrapiImage;
	size?: StrapiImageSize;
	format?: "png" | "jpg" | "webp";
}): Image {
	if (conf.size) {
		conf.strapi_image = {
			id: conf.strapi_image.id,
			attributes:
				conf.strapi_image.attributes.formats![
					conf.format as StrapiImageSize
				],
		};
	}

	return new Image(
		toAbsoluteURL(conf.strapi_image.attributes.url) +
			(conf.format ? `?format=${conf.format}` : ""),
		conf.strapi_image.attributes.width,
		conf.strapi_image.attributes.height,
		conf.strapi_image.attributes.name,
	);
}

export interface StrapiImageAttributes {
	name: string;
	hash: string;
	ext: string;
	mime: string;
	width: number;
	height: number;
	size: number;
	formats?: {
		thumbnail: StrapiImageAttributes;
		large: StrapiImageAttributes;
		medium: StrapiImageAttributes;
		small: StrapiImageAttributes;
	};
	url: string;
}

export interface StrapiImage {
	id: number;
	attributes: StrapiImageAttributes;
}

export type StrapiImageSize = "thumbnail" | "small" | "medium" | "large";
