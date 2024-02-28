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

	private logtoClient: LogtoClient;
	private logtoResource: string = "https://danielculis.fr/api";

	constructor() {
		this.logtoClient = createLogToClient();
	}

	async persist(files: MediaUploadOptions[]): Promise<Media[]> {
		console.log(files);
		throw new Error("Method not implemented.");
	}

	async delete(media: Media): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async list(options?: MediaListOptions | undefined): Promise<MediaList> {
		const response = await this.fetch(
			`/api/tina/media?query=${encodeURIComponent(JSON.stringify(options || {}))}`,
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
