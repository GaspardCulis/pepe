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
		const accessToken = await this.logtoClient.getAccessToken(
			this.logtoResource,
		);
		const request = await fetch(
			`/api/tina/media?query=${encodeURIComponent(JSON.stringify(options || {}))}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		const request_json = await request.json().catch((e) => null);
		if (request_json === null) {
			throw new Error("Invalid JSON received");
		}

		if (request.status != 200) {
			throw new Error(request_json.error);
		}

		return request_json;
	}

	isStatic?: boolean | undefined;
}
