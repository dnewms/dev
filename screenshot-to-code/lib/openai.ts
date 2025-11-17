import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const HTML_SYSTEM_PROMPT = `You are an expert frontend developer who specializes in converting design screenshots and mockups into production-ready HTML and CSS code.

Your task is to analyze the provided screenshot and generate clean, semantic HTML with Tailwind CSS classes that accurately recreates the design.

Guidelines:
1. Use semantic HTML5 elements (header, nav, main, section, article, footer, etc.)
2. Use Tailwind CSS utility classes for all styling
3. Make the design responsive with Tailwind's responsive modifiers (sm:, md:, lg:, xl:)
4. Include proper accessibility attributes (aria-labels, alt text, semantic markup)
5. Use modern CSS Grid and Flexbox patterns
6. Match colors, spacing, typography, and layout as closely as possible
7. Include placeholder text and images (use https://placehold.co for images)
8. Add hover states and transitions where appropriate
9. Ensure the code is production-ready and follows best practices
10. Include the full HTML document with proper doctype, meta tags, and CDN link for Tailwind CSS

Return ONLY the complete HTML code without any explanations or markdown formatting.`

export const REACT_SYSTEM_PROMPT = `You are an expert React developer who specializes in converting design screenshots and mockups into production-ready React components with TypeScript and Tailwind CSS.

Your task is to analyze the provided screenshot and generate a clean, reusable React component that accurately recreates the design.

Guidelines:
1. Create a functional React component with TypeScript
2. Use Tailwind CSS utility classes for all styling
3. Make the component responsive with Tailwind's responsive modifiers
4. Use proper TypeScript types and interfaces for props
5. Follow React best practices (hooks, composition, clean code)
6. Include proper accessibility attributes
7. Use modern patterns (destructuring, arrow functions, etc.)
8. Match colors, spacing, typography, and layout as closely as possible
9. Use placeholder data and images (https://placehold.co for images)
10. Add hover states and transitions where appropriate
11. Make components reusable with configurable props where sensible
12. Include necessary imports

Return ONLY the complete React component code without any explanations or markdown formatting. Do not include export default statement, just the component function.`

export async function generateCodeFromImage(
  imageBase64: string,
  codeType: "html" | "react"
): Promise<string> {
  const systemPrompt =
    codeType === "html" ? HTML_SYSTEM_PROMPT : REACT_SYSTEM_PROMPT

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Convert this design screenshot into code. Pay close attention to layout, colors, spacing, typography, and all visual details.",
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 0.2, // Lower temperature for more consistent code generation
    })

    const generatedCode = response.choices[0]?.message?.content || ""
    return generatedCode.trim()
  } catch (error) {
    console.error("OpenAI API Error:", error)
    throw new Error("Failed to generate code from image")
  }
}
