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
	readonly GITHUB_WEBHOOK_SECRET: string;

	readonly MONGODB_URI: string;

	readonly AWS_ACCESS_KEY_ID: string;
	readonly AWS_SECRET_ACCESS_KEY: string;
	readonly AWS_DEFAULT_REGION: string;
	readonly AWS_ENDPOINT_URL: string;
	readonly AWS_WEB_ENDPOINT_URL: string;
	readonly AWS_BUCKET_NAME: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
