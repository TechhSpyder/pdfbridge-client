"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const rules: PasswordRule[] = [
  {
    id: "length",
    label: "Minimum 8 characters",
    test: (pw) => pw.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least 1 uppercase letter",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    id: "lowercase",
    label: "At least 1 lowercase letter",
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    id: "number",
    label: "At least 1 number",
    test: (pw) => /[0-9]/.test(pw),
  },
  {
    id: "special",
    label: "At least 1 special character",
    test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
];

interface PasswordStrengthIndicatorProps {
  password: string;
  onValidationChange?: (isValid: boolean) => void;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, onValidationChange }) => {
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    const allValid = rules.every((rule) => rule.test(password));
    setIsValid(allValid);
    if (onValidationChange) {
      onValidationChange(allValid);
    }
  }, [password, onValidationChange]);

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {rules.map((rule) => {
          const isRuleMet = rule.test(password);
          return (
            <div
              key={rule.id}
              className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                isRuleMet ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              <div
                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center border ${
                  isRuleMet
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-slate-500/5 border-white/5"
                }`}
              >
                {isRuleMet ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-slate-600" />
                )}
              </div>
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>

      {/* Visual Progress Bar */}
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-4">
        <div
          className={`h-full transition-all duration-500 ${
            isValid ? "bg-emerald-500" : "bg-blue-500/50"
          }`}
          style={{
            width: `${(rules.filter((r) => r.test(password)).length / rules.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
