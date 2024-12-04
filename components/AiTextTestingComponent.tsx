import React, { useState, useCallback } from 'react';
import { TextTestingComponent } from './TextTestingComponent';
import { Card } from './Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import { Book, Lightbulb } from 'lucide-react';

type Analysis = {
  vocabulary: Array<{
    word: string;
    definition: string;
    importance: 'high' | 'medium' | 'low';
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
};

const topics = [
  'Technology', 'Science', 'History', 'Arts', 
  'Travel', 'Food', 'Environment', 'Sports'
];

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

export const AIClozeTestComponent = () => {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    text: string;
    targetWords: string[];
  } | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState(difficultyLevels[0]);
  const [wordsToBlank, setWordsToBlank] = useState(6);
  const [activeTab, setActiveTab] = useState('practice');

  const generateContent = useCallback(async () => {
    setLoading(true);
    try {
      // Generate cloze test content
      const clozeResponse = await fetch('/api/generate-cloze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty,
          wordsToBlank,
        }),
      });
      const clozeData = await clozeResponse.json();
      setGeneratedContent(clozeData);

      // Get text analysis
      const analysisResponse = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clozeData.text }),
      });
      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTopic, difficulty, wordsToBlank]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gap Frequency
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={wordsToBlank}
              onChange={(e) => setWordsToBlank(Number(e.target.value))}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <button
          onClick={generateContent}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400
                   disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Generating...' : 'Generate New Exercise'}
        </button>
      </Card>

      {(generatedContent || analysis) && (
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="practice" className="flex items-center gap-2">
                Practice Test
              </TabsTrigger>
              <TabsTrigger value="vocabulary" className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                Vocabulary
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="practice">
              {generatedContent && (
                <TextTestingComponent 
                  text={generatedContent.text}
                  type="cloze"
                  gapFrequency={wordsToBlank}
                />
              )}
            </TabsContent>

            <TabsContent value="vocabulary">
              {analysis && (
                <div className="space-y-4">
                  {analysis.vocabulary.map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{item.word}</p>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          item.importance === 'high' 
                            ? 'bg-blue-100 text-blue-800'
                            : item.importance === 'medium'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.importance}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{item.definition}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights">
              {analysis && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(analysis.metrics).map(([key, value]) => (
                      <div key={key} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </p>
                        <p className="text-2xl font-semibold">
                          {typeof value === 'number' ? value.toFixed(1) : value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Focus Areas</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {analysis.teachingGuidance.focusAreas.map((item, i) => (
                          <li key={i} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Common Challenges</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {analysis.teachingGuidance.commonChallenges.map((item, i) => (
                          <li key={i} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default AIClozeTestComponent;