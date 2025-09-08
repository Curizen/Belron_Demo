const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require("fs");
const axios = require("axios"); // ✅ add this
const openaiService = require("../services/openaiService");
const { v4: uuidv4 } = require("uuid");

const convertWebmToMp3 = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("mp3")
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
};

exports.sendVoiceMessage = async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ reply: "No audio file sent." });
    }

    const audioFile = req.files.audio;
    if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp");

    const webmPath = `./tmp/${audioFile.name}`;
    await audioFile.mv(webmPath);

    const mp3Path = `./tmp/${audioFile.name.split(".")[0]}.mp3`;
    await convertWebmToMp3(webmPath, mp3Path);

    // تحويل الصوت إلى نص باستخدام Whisper
    const transcription = await openaiService.transcribeAudio(mp3Path, "en");
    console.log("Transcription result:", transcription);

    // الرد من البوت
    const botReply = await openaiService.getChatbotResponse(
      `You are a helpful assistant. The user said: "${transcription}" Reply in the same language.`
    );

    res.json({ reply: botReply, transcript: transcription, lang: "en-US" });

    // حذف الملفات بعد المعالجة
    fs.unlinkSync(webmPath);
    fs.unlinkSync(mp3Path);
  } catch (err) {
    console.error(err);
    res.json({ reply: "حدث خطأ أثناء معالجة الصوت." });
  }
};

exports.getChatbotPage = (req, res) => {
  let userUuid = req.cookies?.user_uuid;

  if (!userUuid) {
    userUuid = uuidv4();
    res.cookie("user_uuid", userUuid, { maxAge: 12 * 60 * 60 * 1000 }); // 12 hours
  }

  res.render("chatbot", { userUuid });
};

exports.sendMessage = async (req, res) => {
  const userMessage = req.body.message;
  const lang = req.body.lang || "en";

  let prompt = "";
  if (lang === "en") {
    prompt = `You are a helpful assistant. The user said: "${userMessage}" Reply in English.`;
  } else if (lang === "de") {
    prompt = `You are a helpful assistant. The user said: "${userMessage}" Reply in German.`;
  } else if (lang === "ar") {
    prompt = `أنت مساعد ذكي. المستخدم قال: "${userMessage}" أجب باللغة العربية.`;
  }

  try {
    const botReply = await openaiService.getChatbotResponse(prompt);
    res.json({ reply: botReply });
  } catch (error) {
    console.error(error);
    res.json({ reply: "An error occurred while communicating with OpenAI." });
  }
};

// exports.analyzeMessage = async (req, res) => {
//   const userMessage = req.body.message;
//   const userUuid = req.cookies?.user_uuid || uuidv4(); // fallback just in case

//   try {
//     // Step 1: Classification prompt
//     const classificationPrompt = `
//       Classify the following user message as either "booking" or "chat".
//       - "booking" means the user is trying to schedule, reschedule, confirm, cancel,
//         or provide booking details (like name,email address, phone number, car type, license plate, appointment time).
//       - "chat" means any other general question, company info, or unrelated topic.
//       Respond with ONLY one word: booking or chat.

//       Message: "${userMessage}"
//     `;

//     const intent = await openaiService.getChatbotResponse(classificationPrompt);
//     const cleanIntent = intent.trim().toLowerCase();

//     // Step 2: Redirect based on intent
//     if (cleanIntent === "booking") {
//       const bookingResponse = await axios.post(
//         "https://curizen.app.n8n.cloud/webhook-test/ca9397b1-8604-4045-b25a-2906d897290d",
//         {
//           uuid: userUuid, // ✅ send the user's UUID
//           query: userMessage,
//         }
//       );
//       console.log(bookingResponse);
//       return res.json({ type: "booking", reply: bookingResponse.data.output });
//     } else {
//       // Fallback to chat
//       return exports.sendMessage(req, res);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ reply: "Error while analyzing message." });
//   }
// };

exports.analyzeMessage = async (req, res) => {
  const userMessage = req.body.message;
  const userUuid = req.cookies?.user_uuid || uuidv4(); // keep uuid for 12h

  try {
    // Forward everything to n8n
    const n8nResponse = await axios.post(
      "https://curizen.app.n8n.cloud/webhook/ca9397b1-8604-4045-b25a-2906d897290d", // put your n8n webhook in .env
      {
        uuid: userUuid,
        query: userMessage,
        lang: req.body.lang || "en",
      }
    );
    // console.log(n8nResponse);

    console.log(n8nResponse?.data?.output || "hi");

    console.log(n8nResponse?.data?.message?.content || "No content found");

    return res.json({
      type: "n8n",
      reply: n8nResponse.data.output || n8nResponse.data.message.content,
    });
  } catch (error) {
    console.error("Error forwarding to n8n:", error.message);
    res.status(500).json({ reply: "Error while communicating with n8n." });
  }
};
