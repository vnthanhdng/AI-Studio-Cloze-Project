'use client';
import React, { useState } from 'react';

import { TextTestingComponent } from '@/components/TextTestingComponent';
import { TextTestingForm } from '@/components/TextTestingForm';
import { TestContent } from '@/types';

export default function TestPage() {
    const [testContent, setTestContent] = useState<TestContent>({
      text: "Minneapolis is a city in Minnesota.\n\nIt is next to St. Paul, Minnesota.\n\nSt. Paul and Minneapolis are called the Twin Cities because they are right next to each other.",
      targetWords: ["is", "next", "are", "called", "right"],
      type: 'ctest'
    });
  
    const handleTestSubmit = (data: TestContent) => {
      setTestContent(data);
    };
  
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Test</h2>
            <TextTestingForm onSubmit={handleTestSubmit} defaultType={testContent.type} />
          </section>
  
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {testContent.type === 'ctest' ? 'C-Test' : 'Cloze Test'} Preview
            </h2>
            <TextTestingComponent
              text={testContent.text}
              type={testContent.type}
              targetWords={testContent.targetWords}
              showFeedback={true}
            />
          </section>
        </div>
      </main>
    );
  }