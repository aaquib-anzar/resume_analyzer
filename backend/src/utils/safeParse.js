function safeParse(jsonString) {
  try {
    // Remove markdown backticks if model adds them
    const cleaned = jsonString.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    return null;
  }
}
module.exports = safeParse;
