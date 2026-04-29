const {PDFParse} = require("pdf-parse");

async function uploadResume(req, res) {
    try{
        if(!req.file){
            return res.status(400).json({message: "No file uploaded"})
        }
        const pdfParse = new PDFParse({ data: req.file.buffer });
        const pdfData = await pdfParse.getText()
        const extractedText = pdfData.text.trim()
        if(!extractedText){
            return res.status(400).json({message: "Unable to extract text from the resume"})
        }
        return res.status(200).json({message: "Resume uploaded successfully", text: extractedText, pageCount: pdfData.pages?.length || 0})
    } catch (error) {
        console.error("Error uploading resume:", error.message)
        return res.status(500).json({message: "Error uploading resume"})
    }
}

module.exports = {uploadResume}