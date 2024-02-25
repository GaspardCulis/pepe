/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
	readonly PUBLIC_EMAILJS_PUBLIC_KEY: string;
	readonly PUBLIC_EMAILJS_SERVICE_ID: string;
	readonly PUBLIC_EMAILJS_TEMPLATE_ID: string;

	readonly PUBLIC_CONTACT_MAIL: string;

	readonly GITHUB_REPO: string;
	readonly GITHUB_OWNER: string;
	readonly GITHUB_BRANCH: string;
	readonly GITHUB_PERSONAL_ACCESS_TOKEN: string;

	readonly MONGODB_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
