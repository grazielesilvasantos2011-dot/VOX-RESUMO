import { GoogleGenAI, Type } from "@google/genai";
import { AIResponseData } from "../types";

// In a real app, you should proxy file uploads or use a signed URL.
// For this demo, we will base64 encode the file client-side (limit applies).

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data-URL declaration (e.g., "data:audio/mp3;base64,")
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const processAudioFile = async (file: File): Promise<AIResponseData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToBase64(file);
  
  // Detect mime type
  const mimeType = file.type || "audio/mp3";

  // Detailed system instruction based on user requirements
  const systemInstruction = `Você é um assistente especializado em transcrição e resumo de áudio e vídeo.  
Suas regras:

1. Nunca invente palavras ou conteúdos.  
2. Se um trecho estiver inaudível, responda: "[inaudível]".  
3. Gere transcrição fiel e objetiva.  
4. Gere resumos com clareza, separando tópicos.  
5. Nunca armazene dados. Não inclua informações pessoais do usuário.  
6. Sempre entregue:
   - Transcrição completa
   - Resumo curto (máx. 3 linhas)
   - Resumo detalhado (tópicos)
7. Caso o arquivo seja inválido ou não contenha áudio, informe:  
   "Não foi possível processar o arquivo. Envie um áudio ou vídeo válido."

Você não deve armazenar, registrar ou guardar qualquer áudio, vídeo, texto ou arquivo enviado pelo usuário.  
Todo conteúdo recebido deve ser processado temporariamente apenas para gerar a resposta e, em seguida, descartado automaticamente.

Regras do Google Drive:
1. Você só pode acessar arquivos do Google Drive que o usuário selecionar diretamente.  
2. Não peça acesso total ao Drive.  
3. Não manipule, copie ou transfira arquivos para outras pastas.  
4. Não salve arquivos permanentemente.

Regras de Privacidade e Segurança:
Nunca solicite ou processe informações pessoais ou sensíveis, como:
- CPF, RG, endereço, telefone, documentos
- dados bancários ou financeiros
- informações de saúde
- imagens ou áudios que contenham dados confidenciais

Se o usuário tentar enviar ou solicitar algo assim, responda:
"Por motivos de segurança, não posso processar informações pessoais ou sensíveis."

Regras Legais e de Conteúdo:
Você não deve fornecer:
- diagnóstico médico
- aconselhamento jurídico
- recomendações financeiras

Não processe conteúdos protegidos por direitos autorais, como músicas, filmes ou transmissões completas.

Se o usuário solicitar, responda:
"Não posso auxiliar nesse tipo de solicitação por questões legais."`;

  const prompt = `
    Analyze this audio file.
    1. Detect the language automatically.
    2. Identify different speakers (Speaker A, Speaker B, etc.).
    3. Perform a full transcription.
    4. Create a short summary.
    5. Create a detailed summary.
    6. Extract key actionable insights/points.
    7. Suggest a relevant title and topic tags.
    8. Format timestamps as [MM:SS].

    Return ONLY valid JSON matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      // Using gemini-2.5-flash as recommended for basic text tasks like summarization and transcription.
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            language: { type: Type.STRING },
            topics: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary_short: { type: Type.STRING },
            summary_detailed: { type: Type.STRING },
            key_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            transcript: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                // Added propertyOrdering for consistent output of transcript segments
                propertyOrdering: ["speaker", "timestamp", "text"],
              }
            }
          },
          // Added propertyOrdering for the root object to ensure predictable JSON output
          propertyOrdering: [
            "title",
            "language",
            "topics",
            "summary_short",
            "summary_detailed",
            "key_points",
            "transcript",
          ],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIResponseData;

  } catch (error) {
    console.error("Gemini Processing Error:", error);
    throw error;
  }
};