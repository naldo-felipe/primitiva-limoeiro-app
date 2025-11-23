
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWelcomeMessage = async (visitorName: string): Promise<string> => {
  try {
    const prompt = `Gere uma mensagem de boas-vindas curta, calorosa e amigável para um visitante de igreja chamado ${visitorName}. A mensagem deve ser convidativa e expressar alegria por sua presença. Mantenha o tom pessoal e não excessivamente formal. Fale em português do Brasil.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating welcome message:", error);
    return `Bem-vindo(a), ${visitorName}! Que a sua visita seja abençoada. (Mensagem de fallback)`;
  }
};
