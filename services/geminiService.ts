
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAi = () => {
  const key = process.env.API_KEY;
  if (!key) throw new Error("Critical: AI Node missing Authorization Key.");
  return new GoogleGenAI({ apiKey: key });
};

export const getReceptionistStream = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  const ai = getAi();
  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: history,
    config: {
      systemInstruction: `You are the OmniFlow AI Receptionist. You represent a multi-niche business engine.
      Niches Managed:
      - Residential/Commercial Cleaning
      - Spiritual Purge & Exorcism
      - Custom Software Architecture
      - Community Strategy
      - Retail Ops
      
      Tone: Elite, efficient, helpful. Use Markdown for clarity.
      Instruction: Guide users toward Booking Estimates or the Neural Dialer.`,
      temperature: 0.7,
      topP: 0.95
    }
  });
};

export const getQuoteEstimation = async (serviceName: string, details: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze service: ${serviceName} with details: ${details}. Provide cost packet.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lowEstimate: { type: Type.NUMBER },
          highEstimate: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          breakdown: { type: Type.ARRAY, items: { type: Type.STRING } },
          disclaimer: { type: Type.STRING }
        },
        required: ["lowEstimate", "highEstimate", "currency", "breakdown"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateVoiceGuidance = async (text: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Instructional voice: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
