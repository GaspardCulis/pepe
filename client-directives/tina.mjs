/* CREDIT: https://github.com/dawaltconley/tina-astro */

/**
 * client-directives/tina.mjs
 * @type {import('astro').ClientDirective}
 */
export default (load, opts, el) => {
	try {
		const isEditor =
			window.frameElement && window.frameElement.id === "tina-iframe";
		if (isEditor) {
			load().then((hydrate) => hydrate());
		}
	} catch (e) {
		console.error(e);
	}
};
