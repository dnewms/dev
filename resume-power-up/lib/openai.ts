import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const stylePrompts = {
  action_oriented: `Transform this resume bullet point to be more action-oriented and impactful. Start with strong action verbs and focus on achievements. Make it compelling and dynamic.`,

  quantified: `Enhance this resume bullet point by adding specific metrics, percentages, or numbers wherever possible. If numbers aren't in the original, suggest realistic quantifiable achievements based on the role. Make it results-focused and data-driven.`,

  industry_specific: `Rewrite this resume bullet point using industry-specific terminology and best practices for the {industry} industry. Use relevant keywords and frameworks that hiring managers in this field value.`,

  linkedin: `Optimize this bullet point for LinkedIn's algorithm and professional readability. Use relevant keywords, make it searchable, and format it for maximum impact on LinkedIn profiles. Keep it professional yet personable.`,
};

export async function enhanceWithAI(
  text: string,
  style: keyof typeof stylePrompts,
  industry?: string
): Promise<string> {
  const prompt = stylePrompts[style].replace('{industry}', industry || 'technology');

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume writer and career coach. Your goal is to transform resume bullet points into powerful, compelling statements that get candidates noticed by recruiters and ATS systems. Return only the enhanced bullet point, nothing else.',
      },
      {
        role: 'user',
        content: `${prompt}\n\nOriginal bullet point: ${text}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0].message.content?.trim() || text;
}
