import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { X } from 'lucide-react';
import { useState } from 'react';

// --- Helper Data ---
const symptoms = [
  { id: 'cramps', label: 'Cramps' },
  { id: 'headache', label: 'Headache' },
  { id: 'bloating', label: 'Bloating' },
  { id: 'breast-tenderness', label: 'Breast Tenderness' },
  { id: 'fatigue', label: 'Fatigue' }
];

const moods = ['Happy', 'Sad', 'Irritable', 'Anxious', 'Calm'];
const energyLevels = ['High', 'Medium', 'Low'];

// --- Component Definition ---
export function DailyCheckIn() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'cramps',
    'bloating'
  ]);
  const [mood, setMood] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState<string | null>('Medium');
  const [notes, setNotes] = useState('');

  const handleSymptomChange = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FEFBFD]">
      <div className="flex-grow">
        <header className="flex items-center justify-between p-5 pb-3">
          <Button variant="ghost" size="icon" className="text-[#382631]">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
          <h1 className="text-lg font-semibold text-[#382631]">
            Daily Check-in
          </h1>
          <div className="w-8"></div>
        </header>

        <main className="space-y-8 px-5 pb-8 pt-3">
          {/* Symptoms Section */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-[#382631]">
              Symptoms
            </h2>
            <div className="space-y-4">
              {symptoms.map((symptom) => (
                <Label
                  key={symptom.id}
                  htmlFor={symptom.id}
                  className={`flex items-center gap-x-4 rounded-xl border border-[#F3E7ED] bg-white p-4 transition-colors
                    ${
                      selectedSymptoms.includes(symptom.id)
                        ? 'border-[#E92E8B] bg-[#FCEFF6]'
                        : ''
                    }`}>
                  <Checkbox
                    id={symptom.id}
                    checked={selectedSymptoms.includes(symptom.id)}
                    onCheckedChange={() => handleSymptomChange(symptom.id)}
                    className="h-5 w-5 rounded-md border-2 border-[#E7CFDB] bg-transparent data-[state=checked]:border-[#E92E8B] data-[state=checked]:bg-[#E92E8B] data-[state=checked]:text-[#FEFBFD] focus:ring-2 focus:ring-[#E92E8B] focus:ring-offset-2 focus:ring-offset-white"
                  />
                  <span className="text-base text-[#382631]">
                    {symptom.label}
                  </span>
                </Label>
              ))}
            </div>
          </section>

          {/* Mood Section */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-[#382631]">
              Mood
            </h2>
            <ToggleGroup
              type="single"
              value={mood ?? ''}
              onValueChange={(value) => setMood(value || null)}
              className="flex flex-wrap justify-start gap-3">
              {moods.map((moodItem) => (
                <ToggleGroupItem
                  key={moodItem}
                  value={moodItem}
                  className="rounded-full border border-[#F3E7ED] bg-white px-4 py-2.5 text-sm font-medium text-[#382631] transition-colors duration-200 hover:bg-[#FCEFF6] data-[state=on]:border-[#E92E8B] data-[state=on]:bg-[#E92E8B] data-[state=on]:text-white">
                  {moodItem}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>

          {/* Energy Level Section */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-[#382631]">
              Energy Level
            </h2>
            <ToggleGroup
              type="single"
              value={energyLevel ?? ''}
              onValueChange={(value) => setEnergyLevel(value || null)}
              className="flex flex-wrap justify-start gap-3">
              {energyLevels.map((level) => (
                <ToggleGroupItem
                  key={level}
                  value={level}
                  className="rounded-full border border-[#F3E7ED] bg-white px-4 py-2.5 text-sm font-medium text-[#382631] transition-colors duration-200 hover:bg-[#FCEFF6] data-[state=on]:border-[#E92E8B] data-[state=on]:bg-[#E92E8B] data-[state=on]:text-white">
                  {level}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>

          {/* Notes Section */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-[#382631]">
              Notes
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes here..."
              className="min-h-36 w-full resize-none rounded-xl border-[#F3E7ED] bg-white p-4 text-base text-[#382631] placeholder:text-[#9A4C73]/60 focus:border-[#E92E8B] focus:ring-2 focus:ring-[#E92E8B]/50"
            />
          </section>
        </main>
      </div>

      <footer className="sticky bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent p-5 pb-5 pt-2">
        <Button className="w-full rounded-full bg-[#E92E8B] py-3.5 text-center text-base font-semibold text-[#FEFBFD] shadow-lg shadow-[#E92E8B]/30 transition-transform active:scale-95 hover:bg-[#E92E8B]/90">
          Save
        </Button>
      </footer>
    </div>
  );
}
