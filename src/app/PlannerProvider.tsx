import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { generateMonthlyPlan } from "../lib/generator";
import { GeneratorInput, MonthlyPlan } from "../types";

export const initialInput: GeneratorInput = {
  people: 2,
  days: 30,
  monthlyBudget: 420,
  restrictions: {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    allergies: []
  },
  preferences: ["mediterranea", "rapido"]
};

export const preferenceOptions = ["mediterranea", "alto en proteina", "rapido", "vegetal"];

export const budgetStatusLabel: Record<MonthlyPlan["budgetStatus"], string> = {
  dentro: "Dentro del presupuesto",
  ajustado: "Muy ajustado",
  excedido: "Por encima del presupuesto"
};

type PlannerContextValue = {
  formState: GeneratorInput;
  setFormState: React.Dispatch<React.SetStateAction<GeneratorInput>>;
  allergyInput: string;
  setAllergyInput: React.Dispatch<React.SetStateAction<string>>;
  plan: MonthlyPlan;
  error: string;
  generatePlan: () => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [formState, setFormState] = useState<GeneratorInput>(initialInput);
  const [allergyInput, setAllergyInput] = useState("");
  const [plan, setPlan] = useState<MonthlyPlan>(() => generateMonthlyPlan(initialInput));
  const [error, setError] = useState("");

  const generatePlanFromState = () => {
    try {
      const nextInput: GeneratorInput = {
        ...formState,
        restrictions: {
          ...formState.restrictions,
          allergies: allergyInput
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        }
      };

      const nextPlan = generateMonthlyPlan(nextInput);
      setPlan(nextPlan);
      setError("");
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "No se pudo generar el plan.");
    }
  };

  const value = useMemo(
    () => ({
      formState,
      setFormState,
      allergyInput,
      setAllergyInput,
      plan,
      error,
      generatePlan: generatePlanFromState
    }),
    [allergyInput, error, formState, plan]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);

  if (!context) {
    throw new Error("usePlanner debe usarse dentro de PlannerProvider.");
  }

  return context;
}
