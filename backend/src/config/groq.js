const Groq = require("groq-sdk");
const { GROQ_API_KEY } = require("./config");

const groq = new Groq({ apiKey: GROQ_API_KEY });

const model = {
  async generateContent(prompt) {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 1,
      max_tokens: 1024,
    });
    
    return {
      response: {
        text: () => response.choices[0].message.content
      }
    };
  }
};

module.exports = model;