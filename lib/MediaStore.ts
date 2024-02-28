import LogtoClient from "@logto/browser";
import type {
	Media,
	MediaList,
	MediaListOptions,
	MediaStore,
	MediaUploadOptions,
} from "tinacms";
import { DEFAULT_MEDIA_UPLOAD_TYPES } from "tinacms";
import { createLogToClient } from "./utils";

export default class CustomMediaStore implements MediaStore {
	accept = DEFAULT_MEDIA_UPLOAD_TYPES;

	private API_ROUTE = "/api/tina/media";

	private logtoClient: LogtoClient;
	private logtoResource: string = "https://danielculis.fr/api";

	constructor() {
		this.logtoClient = createLogToClient();
	}

	async persist(files: MediaUploadOptions[]): Promise<Media[]> {
		const new_files: Media[] = [];

		for (const f of files) {
			const { directory, file } = f;
			const form_data = new FormData();
			form_data.append("file", file);
			form_data.append("directory", directory);
			form_data.append("filename", file.name);

			const response = await this.fetch(this.API_ROUTE, {
				method: "POST",
				body: form_data,
			});

			if (response.status != 200) {
				throw new Error(await response.text());
			}
			const response_json = await response.json();

			new_files.push(response_json);
		}

		return new_files;
	}

	async delete(media: Media): Promise<void> {
		await this.fetch(
			`${this.API_ROUTE}?key=${encodeURIComponent(media.id)}`,
			{
				method: "DELETE",
			},
		);
	}

	async list(options?: MediaListOptions | undefined): Promise<MediaList> {
		const response = await this.fetch(
			`${this.API_ROUTE}?query=${encodeURIComponent(JSON.stringify(options || {}))}`,
		);
		const response_json = await response.json().catch((e) => null);
		if (response_json === null) {
			throw new Error("Invalid JSON received");
		}

		if (response.status != 200) {
			throw new Error(response_json.error);
		}

		return response_json;
	}

	private async fetch(info: RequestInfo, init?: RequestInit) {
		const accessToken = await this.logtoClient.getAccessToken(
			this.logtoResource,
		);
		return fetch(info, {
			...init,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	isStatic?: boolean | undefined;
}
