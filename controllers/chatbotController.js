const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require("fs");
const axios = require("axios"); 
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

    const transcription = await openaiService.transcribeAudio(mp3Path, "en");
    console.log("Transcription result:", transcription);

    const botReply = await openaiService.getChatbotResponse(
      `You are a helpful assistant. The user said: "${transcription}" Reply in the same language.`
    );

    res.json({ reply: botReply, transcript: transcription, lang: "en-US" });

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
    res.cookie("user_uuid", userUuid, { maxAge: 12 * 60 * 60 * 1000 });
  }

  res.render("chatbot", { userUuid });
};

exports.sendMessage = async (req, res) => {
  const userMessage = req.body.message;
  const lang = req.body.lang || "en";
  const userId = req.body.id || uuidv4();

  try {
    const n8nResponse = await axios.post(
      "https://curizen.app.n8n.cloud/webhook/40d45577-cd94-4ce8-9e23-8b65eec82b3a",
      {
        query: userMessage,
        id: userId,
      }
    );

    const reply =
      n8nResponse?.data?.output || n8nResponse?.data?.message?.content || "No content found";

    res.json({ reply });
  } catch (error) {
    console.error("Error forwarding to n8n:", error.message);
    res.status(500).json({
      reply: "Failed to get response from n8n",
      error: error.message,
    });
  }
};

exports.analyzeMessage = async (req, res) => {
  const userMessage = req.body.message;
  const userUuid = req.cookies?.user_uuid || uuidv4();

  try {
    const n8nResponse = await axios.post(
      "https://curizen.app.n8n.cloud/webhook/40d45577-cd94-4ce8-9e23-8b65eec82b3a",
      {
        id: userUuid,
        query: userMessage,
      }
    );

    const data = n8nResponse?.data;
    let reply;

    if (data?.output) {
      if (typeof data.output === "object" && data.output.content) {
        reply = data.output.content;
      } else if (typeof data.output === "string") {
        reply = data.output;
      } else {
        reply = JSON.stringify(data.output); 
      }
    } else if (data?.message?.content) {
      reply = data.message.content;
    } else {
      reply = "No content found";
    }

    console.log("Full n8n response:", data);
    console.log("Reply sent:", reply);

    return res.json({
      type: "n8n",
      reply,
    });
  } catch (error) {
    console.error("Error forwarding to n8n:", error.message);
    res.status(500).json({ reply: "Error while communicating with n8n." });
  }
};
