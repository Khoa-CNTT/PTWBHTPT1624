// src/api/gemini.ts

import { genAI } from '../config/genAI';

export const generateGeminiResponse = async (prompt: string) => {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    return response;
};
