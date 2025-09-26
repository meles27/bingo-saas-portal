import { Button } from '@/components/ui/button';
import { useActiveManager } from '@/hooks/base/use-active-manager';

const WIZARD_STEPS = ['welcome', 'profile', 'finish'] as const;

export const OnboardingWizard = () => {
  // The hook now returns much more useful state
  const { activeKey, currentIndex, isFirst, isLast, actions } =
    useActiveManager(WIZARD_STEPS, 'welcome');

  return (
    <div className="w-full max-w-md p-6 border rounded-lg">
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="font-bold text-xl">
          Step {currentIndex + 1}: {activeKey}
        </h3>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {WIZARD_STEPS.length}
        </span>
      </div>

      {/* Render content based on the activeKey */}
      {activeKey === 'welcome' && <p>Welcome! Click Next to begin.</p>}
      {activeKey === 'profile' && <p>Please fill out your profile details.</p>}
      {activeKey === 'finish' && <p>You're all set!</p>}

      {/* The navigation logic is now much cleaner */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => actions.setPrevious()}
          disabled={isFirst} // Use the returned boolean directly
        >
          Previous
        </Button>
        <Button
          onClick={() => actions.setNext()}
          disabled={isLast} // Use the returned boolean directly
        >
          Next
        </Button>
      </div>

      {/* Bonus: demonstrate the other new actions */}
      <div className="mt-4 pt-4 border-t flex justify-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => actions.setFirst()}>
          Go to First
        </Button>
        <Button size="sm" variant="secondary" onClick={() => actions.setLast()}>
          Go to Last
        </Button>
      </div>
    </div>
  );
};
