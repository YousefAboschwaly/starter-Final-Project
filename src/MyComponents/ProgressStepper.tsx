
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

export function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col items-center">
            {/* Line connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute w-full h-[2px] top-4 left-[50%] -z-10",
                  currentStep > index ? "bg-primary" : "bg-muted"
                )}
              />
            )}
            
            {/* Circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                currentStep > index
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep === index
                  ? "border-primary text-primary"
                  : "border-muted text-muted-foreground"
              )}
            >
              {currentStep > index ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            {/* Label */}
            <span
              className={cn(
                "text-xs mt-2",
                currentStep === index ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}