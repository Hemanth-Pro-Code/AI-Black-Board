import Tesseract from "tesseract.js";

export async function recognizeBoard(
  image: string
): Promise<string> {
  const result = await Tesseract.recognize(
    image,
    "eng",
    {
      logger: () => {},
    }
  );

  return result.data.text
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}