import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI, Type } from "@google/genai";

export const translateText = action({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    // Guidelines: API key must be obtained from process.env.API_KEY. Assume it is pre-configured.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following text: "${args.text}".
        
        Tasks:
        1. Identify the Hanzi (Chinese characters). If the input is not Chinese, translate it to Chinese Hanzi.
        2. Provide the Pinyin.
        3. Translate the meaning to French (Français).
        4. Translate the meaning to Malagasy (Malagasy).
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hanzi: { type: Type.STRING, description: "Chinese characters" },
              pinyin: { type: Type.STRING, description: "Pinyin pronunciation" },
              translation_fr: { type: Type.STRING, description: "French translation" },
              translation_mg: { type: Type.STRING, description: "Malagasy translation" },
            },
            required: ["hanzi", "pinyin", "translation_fr", "translation_mg"],
          },
        },
      });

      const jsonStr = response.text || "{}";
      return JSON.parse(jsonStr);
    } catch (e: any) {
      console.error("Translation Error", e);
      
      let errorMsg = "Service Unavailable";
      const rawError = e.message || e.toString();

      if (rawError.includes("429")) errorMsg = "System overloaded (429).";
      else if (rawError.includes("API key")) errorMsg = "Invalid API Key.";
      else if (rawError.includes("Safety")) errorMsg = "Safety Block.";
      else errorMsg = "Error.";

      return { 
        hanzi: "ERROR", 
        pinyin: "FAILED", 
        translation_fr: errorMsg,
        translation_mg: "Nisy olana." 
      };
    }
  },
});

export const generateQuiz = action({
  args: { topic: v.string(), difficulty: v.string() },
  handler: async (ctx, args) => {
    // Guidelines: API key must be obtained from process.env.API_KEY. Assume it is pre-configured.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère 5 questions à choix multiples (QCM) pour apprendre le Mandarin.
        
        Sujet : "${args.topic}"
        Niveau de difficulté : "${args.difficulty}" (Standard HSK)
        
        Consignes :
        1. Les questions et les explications DOIVENT être en Français.
        2. Les options doivent contenir du Mandarin (Hanzi) ou du Pinyin pertinent pour l'exercice.
        3. Adapte le vocabulaire au niveau demandé.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "La question en Français" },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "4 choix possibles"
                },
                correctAnswerIndex: { type: Type.INTEGER, description: "Index 0-3 de la bonne réponse" },
                explanation: { type: Type.STRING, description: "Explication courte en Français" }
              },
              required: ["question", "options", "correctAnswerIndex", "explanation"],
            },
          },
        },
      });

      const jsonStr = response.text || "[]";
      return JSON.parse(jsonStr);
    } catch (e: any) {
      console.error("Quiz gen error", e);
      return [{
        question: `Erreur de génération: ${e.message}`,
        options: ["Erreur", "Réessayer", "Vérifier Logs", "Contact Admin"],
        correctAnswerIndex: 0,
        explanation: "Le service IA a rencontré un problème."
      }];
    }
  },
});
