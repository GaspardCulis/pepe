export default interface Testimony {
	id: number;
	attributes: {
		author: string;
		author_role: string;
		content: string;
	};
}
