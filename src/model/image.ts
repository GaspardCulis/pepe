export default class Image {
	public constructor(
		readonly src: string,
		readonly width: number,
		readonly height: number,
		readonly alt: string,
	) {}

	public static default(): Image {
		return new Image("", 0, 0, "");
	}
}
