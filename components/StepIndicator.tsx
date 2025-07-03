"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StepProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepProps) {
  const pathname = usePathname();

  const steps = [
    {
      name: "Basic Info",
      href: "/secure/dashboard/createpost/step-1",
      stepNumber: 1,
    },
    {
      name: "Content",
      href: "/secure/dashboard/createpost/step-2",
      stepNumber: 2,
    },
    {
      name: "Tags & Publish",
      href: "/secure/dashboard/createpost/step-3",
      stepNumber: 3,
    },
  ];

  return (
    <div className="w-full py-4 ">
      <div className="w-full max-w-2xl flex justify-center">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={cn(
                  stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                  "relative flex items-center"
                )}
              >
                <Link
                  href={step.href}
                  className={cn(
                    step.stepNumber <= currentStep
                      ? "cursor-pointer"
                      : "cursor-not-allowed pointer-events-none opacity-50",
                    "flex items-center"
                  )}
                  aria-current={
                    pathname.includes(`step-${step.stepNumber}`)
                      ? "step"
                      : undefined
                  }
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      pathname.includes(`step-${step.stepNumber}`)
                        ? "bg-secondary"
                        : step.stepNumber < currentStep
                        ? "bg-green-500"
                        : "border-2 border-gray-300 dark:border-gray-600"
                    )}
                  >
                    {step.stepNumber < currentStep ? (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{step.stepNumber}</span>
                    )}
                  </span>
                  <span className="ml-2 text-sm font-medium">{step.name}</span>
                </Link>

                {stepIdx !== steps.length - 1 ? (
                  <div
                    className={cn(
                      "absolute right-0 top-4 h-0.5 w-5 sm:w-16",
                      step.stepNumber < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    )}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
