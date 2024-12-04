import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { topic, difficulty} = await request.json();

    const prompt = `Generate a comprehensive text about ${topic} suitable for ${difficulty} level English learners.

Requirements:
- Write 3-4 well-developed paragraphs (at least 100 words each)
- Each paragraph should focus on a different aspect of the topic
- Use varied vocabulary and sentence structures appropriate for ${difficulty} level
- Ensure smooth transitions between paragraphs
- Include specific examples and details
- Use clear and informative topic sentences
- Maintain coherent flow of ideas
- Include factual information and explanations
- Make content engaging and educational
- Do NOT include any gaps or blanks - return only the raw text

Note: The text will be processed for cloze testing separately, so just focus on creating clear, well-structured content.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an educational content creator specializing in creating comprehensive, engaging texts for language learners. Create content that is informative, well-structured, and suitable for cloze testing."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000 
    });

    const rawText = completion.choices[0].message.content || "";



    return NextResponse.json({
      text: rawText,

    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cloze test' },
      { status: 500 }
    );
  }
}