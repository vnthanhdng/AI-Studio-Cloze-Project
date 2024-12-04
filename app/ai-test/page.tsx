"use client";

import React from "react";
import { AIClozeTestComponent } from "../../components/AiTextTestingComponent";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <header className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              AI-Powered Cloze Test Practice
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Improve your language skills with our intelligent cloze tests.
              Select a topic and difficulty level to generate personalized
              practice exercises.
            </p>
          </header>

          {/* Instructions */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How it works
            </h2>
            <ol className="space-y-3 text-gray-600">
              <li>1. Select a topic and difficulty level</li>
              <li>2. Adjust the gap frequency if desired</li>
              <li>3. Click Generate New Exercise to create a cloze test</li>
              <li>4. Fill in the blanks with appropriate words</li>
              <li>5. Click Check Answers to see your score</li>
              <li>
                6. View additional vocabulary and teaching insights in the tabs
              </li>
            </ol>
          </div>

          {/* Main Component */}
          <AIClozeTestComponent />

          {/* Tips Section */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Tips for Success
            </h2>
            <div className="space-y-3 text-blue-800">
              <p>• Read the entire passage first to understand the context</p>
              <p>• Look for clues in the surrounding words and sentences</p>
              <p>• Consider the topic when choosing your answers</p>
              <p>• Review your answers before submitting</p>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm">
            <p>© 2024 AI Studio Cloze Project. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
