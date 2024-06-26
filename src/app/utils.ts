export function addBoldnessAndParagraphs(text: string): string {
  // This regex finds text enclosed in double asterisks and captures the text inside
  const boldnessPattern = /\*\*(.*?)\*\*/g;

  // Replace the found text with the same text wrapped in <b> tags
  const boldText = text.replace(boldnessPattern, "<b>$1</b>");

  let paragraphPattern = /(\d+\.)/g;

  // Replace method to insert <br/> before each match
  let result = text.replace(paragraphPattern, "<br/><br/>$1");

  return result;
}
