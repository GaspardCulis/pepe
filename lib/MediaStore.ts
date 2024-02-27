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
		throw new Error("Method not implemented.");
	}

	isStatic?: boolean | undefined;
}
