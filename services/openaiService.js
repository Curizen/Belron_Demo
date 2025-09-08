//Belron\services\openaiService.js
require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.getChatbotResponse = async (prompt) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `You are the official customer service assistant for Carglass. 
                Your task is to respond to customer inquiries professionally, politely, and clearly. 
                Focus on: 
                - Car windshield repair and replacement services 
                - Appointment scheduling and free inspections 
                - Providing advice on glass maintenance and safety 
                If the question is outside Carglass services, politely state that you specialize in windshield and car glass services only, and suggest contacting direct customer support if needed.` },
      { role: 'user', content: prompt }
    ]
  });
  return completion.choices[0].message.content;
};

exports.transcribeAudio = async (filePath, language = 'en') => {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1',
    language
  });
  return transcription.text;
};


