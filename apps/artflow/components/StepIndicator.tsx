import React from 'react';
import { WorkflowStep } from '../types';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: WorkflowStep) => void;
  unlockedSteps: Set<WorkflowStep>;
}

const steps = [
  { id: WorkflowStep.PROMPT, label: 'Prompt' },
  { id: WorkflowStep.IMAGE, label: 'Create' },
  { id: WorkflowStep.VIDEO, label: 'Animate' },
  { id: WorkflowStep.THUMBNAILS, label: 'Thumbnails' },
  { id: WorkflowStep.FINALIZE, label: 'Finalize' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick, unlockedSteps }) => {
  return (
    <div className="w-full py-6 px-4">
      <div className="flex justify-between items-center max-w-5xl mx-auto relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-brand-500 -z-10 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isNavigable = unlockedSteps.has(step.id);

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <button 
                onClick={() => isNavigable && onStepClick?.(step.id)}
                disabled={!isNavigable || isCurrent}
                className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all duration-300 border-2 outline-none
                  ${isCompleted ? 'bg-brand-500 border-brand-500 text-white' : ''}
                  ${isCurrent ? 'bg-white border-brand-500 text-brand-600 scale-110 shadow-lg shadow-brand-500/20' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-slate-100 border-slate-300 text-slate-400' : ''}
                  ${isNavigable && !isCurrent ? 'cursor-pointer hover:scale-110 hover:shadow-md' : 'cursor-default'}
                  ${!isNavigable ? 'opacity-50' : ''}
                `}
                title={isNavigable ? `Go to ${step.label}` : 'Complete previous steps to unlock'}
              >
                {isCompleted ? '✓' : step.id + 1}
              </button>
              <span 
                className={`
                  text-[10px] md:text-xs font-medium uppercase tracking-wider hidden md:block
                  ${isCurrent ? 'text-brand-700 font-bold' : 'text-slate-500'}
                  ${isNavigable ? 'text-slate-600' : 'text-slate-300'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};