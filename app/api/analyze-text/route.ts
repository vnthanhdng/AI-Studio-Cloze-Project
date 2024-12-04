import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

type TextAnalysis = {
  clozeWords: Array<{
    word: string,
    reason: string,
    difficulty: 'basic' | 'intermediate' | 'advanced'
  }>;
  vocabulary: Array<{
    word: string,
    definition: string,
    importance: 'high' | 'medium' | 'low'
  }>;
  metrics: {
    readabilityScore: number;
    averageWordLength: number;
    sentenceComplexity: number;
    academicWordPercentage: number;
  };
  teachingGuidance: {
    focusAreas: string[];
    suggestedActivities: string[];
    commonChallenges: string[];
  };
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const analysisPrompt = `Analyze this text for language learning purposes and provide a structured analysis. Format your response exactly as specified below, keeping the exact structure:

CLOZE_WORDS
[List each word on a new line with its difficulty level (basic/intermediate/advanced) and reason for selection, separated by |]
example|basic|Key concept word that demonstrates understanding
[End list with ---]
---

VOCABULARY
[List important vocabulary words with definitions and importance (high/medium/low), separated by |]
example|A representative instance|high
[End list with ---]
---

METRICS
readabilityScore|75
averageWordLength|5.2
sentenceComplexity|0.65
academicWordPercentage|15
[End metrics with ---]
---

TEACHING_GUIDANCE
Focus Areas:
[List each focus area on a new line]
Example focus area 1
Example focus area 2

Suggested Activities:
[List each activity on a new line]
Example activity 1
Example activity 2

Common Challenges:
[List each challenge on a new line]
Example challenge 1
Example challenge 2

Text to analyze: ${text}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in educational linguistics and text analysis. Provide detailed, structured analysis of texts for language learning purposes."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.3
    });

    const response = completion.choices[0].message.content || "";
    
    // Parse the structured response into our TextAnalysis type
    const analysis: TextAnalysis = {
      clozeWords: [],
      vocabulary: [],
      metrics: {
        readabilityScore: 0,
        averageWordLength: 0,
        sentenceComplexity: 0,
        academicWordPercentage: 0
      },
      teachingGuidance: {
        focusAreas: [],
        suggestedActivities: [],
        commonChallenges: []
      }
    };

    // Split response into sections
    const sections = response.split('---');
    
    // Parse CLOZE_WORDS section
    const clozeSection = sections[0].split('\n')
      .filter(line => line.includes('|'))
      .map(line => {
        const [word, difficulty, reason] = line.split('|');
        return {
          word: word.trim(),
          difficulty: difficulty.trim() as 'basic' | 'intermediate' | 'advanced',
          reason: reason.trim()
        };
      });
    analysis.clozeWords = clozeSection;

    // Parse VOCABULARY section
    const vocabSection = sections[1].split('\n')
      .filter(line => line.includes('|'))
      .map(line => {
        const [word, definition, importance] = line.split('|');
        return {
          word: word.trim(),
          definition: definition.trim(),
          importance: importance.trim() as 'high' | 'medium' | 'low'
        };
      });
    analysis.vocabulary = vocabSection;

    // Parse METRICS section
    const metricsLines = sections[2].split('\n')
      .filter(line => line.includes('|'));
    metricsLines.forEach(line => {
      const [key, value] = line.split('|');
      if (key in analysis.metrics) {
        analysis.metrics[key as keyof typeof analysis.metrics] = parseFloat(value);
      }
    });

    // Parse TEACHING_GUIDANCE section
    const guidanceText = sections[3];
    
    const focusAreasMatch = guidanceText.match(/Focus Areas:\n((?:.*\n)*?)(?:\n|Suggested)/);
    if (focusAreasMatch) {
      analysis.teachingGuidance.focusAreas = focusAreasMatch[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim());
    }

    const activitiesMatch = guidanceText.match(/Suggested Activities:\n((?:.*\n)*?)(?:\n|Common)/);
    if (activitiesMatch) {
      analysis.teachingGuidance.suggestedActivities = activitiesMatch[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim());
    }

    const challengesMatch = guidanceText.match(/Common Challenges:\n((?:.*\n)*)/);
    if (challengesMatch) {
      analysis.teachingGuidance.commonChallenges = challengesMatch[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim());
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
}