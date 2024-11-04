import { TextTestingComponent } from '@/components/TextTestingComponent';

export default function TestPage() {
    const sampleText = "Minneapolis is a city in Minnesota. It is next to St. Paul, Minnesota. St. Paul and Minneapolis are called the Twin Cities because they are right next to each other.";
    const ctestTargets = ["is", "next", "are", "called", "right"];
    const clozeTargets = ["Minneapolis", "city", "Minnesota", "Twin", "Cities"];
  
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">C-Test Exercise</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <TextTestingComponent
                text={sampleText}
                type="ctest"
                targetWords={ctestTargets}
                showFeedback={true}
              />
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Cloze Test Exercise</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <TextTestingComponent
                text={sampleText}
                type="cloze"
                targetWords={clozeTargets}
                showFeedback={true}
              />
            </div>
          </section>
        </div>
      </main>
    );
  }