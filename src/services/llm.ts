import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function queryLLM(prompt: string, context: string[]): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const fullPrompt = `${prompt}\n\nEvidence:\n${context.join('\n\n')}`;
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

export async function* streamQueryLLM(prompt: string, context: string[]): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const fullPrompt = `${prompt}\n\nEvidence:\n${context.join('\n\n')}`;
  const result = await model.generateContentStream(fullPrompt);
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}