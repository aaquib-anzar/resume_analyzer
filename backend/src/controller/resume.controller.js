const { PDFParse } = require("pdf-parse");

//const model = require("../config/gemini");
const model = require("../config/groq");

async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const pdfParse = new PDFParse({ data: req.file.buffer });
    const pdfData = await pdfParse.getText();
    const extractedText = pdfData.text.trim();
    if (!extractedText) {
      return res
        .status(400)
        .json({ message: "Unable to extract text from the resume" });
    }
    return res
      .status(200)
      .json({
        message: "Resume uploaded successfully",
        text: extractedText,
        pageCount: pdfData.pages?.length || 0,
      });
  } catch (error) {
    console.error("Error uploading resume:", error.message);
    return res.status(500).json({ message: "Error uploading resume" });
  }
}

async function analyzeResume(req, res) {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res
        .status(400)
        .json({ message: "Resume text is required for analysis" });
    }
    const prompt = `
      You are an expert resume reviewer and career coach.
      Analyze the following resume and respond ONLY in this exact JSON format:
      {
        "overallScore": <number from 0 to 100>,
        "summary": "<2-3 sentence overall assessment>",
        "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
        "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
        "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
        "suggestions": {
          "experience": "<specific suggestion for experience section>",
          "skills": "<specific suggestion for skills section>",
          "formatting": "<specific suggestion for formatting>"
        }
      }

      Resume:
      ${resumeText}

      Respond ONLY with the JSON object. No extra text, no markdown backticks.
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse JSON safely
      const analysis = JSON.parse(responseText);

      return res.status(200).json({
        message: "Resume analyzed successfully",
        analysis,
      });
    } catch (apiError) {
      console.error("Gemini API Error:", apiError.message);
      
      // Check if it's a quota/rate limit error
      if (apiError.message.includes("429") || apiError.message.includes("quota")) {
        return res.status(429).json({ 
          message: "API quota exceeded. Please try again in a few minutes." 
        });
      }
      
      if (apiError.message.includes("fetch failed")) {
        return res.status(503).json({ 
          message: "API service temporarily unavailable. Please try again shortly." 
        });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error("Error analyzing resume:", error.message);
    return res.status(500).json({ message: "Error analyzing resume" });
  }
}

async function matchResume(req, res) {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res
        .status(400)
        .json({ message: "Resume text and job description are required" });
    }

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and recruiter.
      Compare the resume against the job description and respond ONLY in this exact JSON format:
      {
        "matchScore": <number from 0 to 100>,
        "verdict": "<one line verdict — strong match / moderate match / weak match>",
        "matchedKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
        "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
        "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
      }

      Resume:
      ${resumeText}

      Job Description:
      ${jobDescription}

      Respond ONLY with the JSON object. No extra text, no markdown backticks.
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse JSON safely
      const analysis = JSON.parse(responseText);

      return res.status(200).json({ message: "Resume analyzed successfully", analysis });
    } catch (apiError) {
      console.error("Gemini API Error:", apiError.message);
      
      // Check if it's a quota/rate limit error
      if (apiError.message.includes("429") || apiError.message.includes("quota")) {
        return res.status(429).json({ 
          message: "API quota exceeded. Please try again in a few minutes." 
        });
      }
      
      if (apiError.message.includes("fetch failed")) {
        return res.status(503).json({ 
          message: "API service temporarily unavailable. Please try again shortly." 
        });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error("Error matching resume:", error.message);
    return res.status(500).json({ message: "Error matching resume" });
  }
}

module.exports = { uploadResume, analyzeResume, matchResume };
