import { AbstractAuthProvider } from "tinacms";
import LogtoClient from "@logto/browser";
import { createLogToClient } from "./utils";

export default class AuthProvider extends AbstractAuthProvider {
	private _logtoClient: LogtoClient | undefined;

	constructor() {
		super();
	}

	private getLogToClient(): LogtoClient {
		if (!this._logtoClient) {
			this._logtoClient = createLogToClient();
		}
		return this._logtoClient;
	}

	async getToken(): Promise<any> {
		const accessToken = await this.getLogToClient().getAccessToken(
			"https://danielculis.fr/api",
		);
		return { id_token: accessToken };
	}

	async getUser(): Promise<boolean> {
		return this.getLogToClient().isAuthenticated();
	}

	async logout(): Promise<any> {
		return this.getLogToClient().signOut();
	}

	async authenticate(
		props?: Record<string, string> | undefined,
	): Promise<any> {
		this.getLogToClient().signIn(
			`${document.location.origin}/auth/callback`,
		);
	}
}
