
import { GoogleGenAI, Type, Modality } from "@google/genai";

export const chatWithMemoryBot = async (history: string[], userMessage: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Você é o 'Bot da Memória', o assistente de IA do Museu Digital da Memória Viva da Caserna.
    
    DIRETRIZES DE COMPORTAMENTO:
    1. Use linguagem técnico-administrativa, clara, objetiva e institucional.
    2. Organize as respostas em seções ou checklists quando apropriado.
    3. Seu foco é a história dos militares da reserva, veteranos da Guarda Territorial e da Polícia Militar.
    4. Baseie seu tom na preservação da memória afetiva e institucional.
    5. Nunca emita pareceres jurídicos definitivos.
    
    ASSINATURA OBRIGATÓRIA:
    "Esta informação é um apoio técnico. A decisão final é do gestor responsável. Documento gerado pelo Museu Digital da Memória Viva da Caserna."
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: `Histórico:\n${history.join('\n')}\n\nMensagem: ${userMessage}` }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.5,
      }
    });
    return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Erro ao conectar com a base de dados da Memória Viva.";
  }
};

export const speakMemory = async (text: string): Promise<Uint8Array | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Leia de forma solene e administrativa: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
  } catch (error) {
    console.error("Gemini TTS Error:", error);
  }
  return null;
};

export const analyzeMemoryImage = async (base64Image: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';

  const systemInstruction = `
    Você é o 'Perito de Acervo' do Museu Digital da Memória Viva da Caserna.
    Análise técnica de fotos antigas, documentos e fardamentos.
    Descreva elementos visuais, insígnias e contexto histórico da Guarda Territorial ou PMRR.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: "Realize uma perícia histórica detalhada desta imagem." }
        ]
      },
      config: {
        systemInstruction,
        temperature: 0.4
      }
    });

    return response.text || "Não foi possível extrair dados desta imagem.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Erro ao processar análise da imagem.";
  }
};
