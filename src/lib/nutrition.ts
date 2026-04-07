import { foodMap } from "../data/catalog";
import { NutrientKey, NutrientProgress, NutrientSet, RecipeIngredient } from "../types";

export const nutrientLabels: Record<NutrientKey, string> = {
  calories: "Energia",
  protein: "Proteinas",
  carbs: "Hidratos",
  fat: "Grasas",
  fiber: "Fibra",
  vitaminA: "Vitamina A",
  vitaminB12: "Vitamina B12",
  vitaminC: "Vitamina C",
  vitaminD: "Vitamina D",
  vitaminE: "Vitamina E",
  vitaminK: "Vitamina K",
  iron: "Hierro",
  calcium: "Calcio",
  zinc: "Zinc",
  magnesium: "Magnesio"
};

export const nutrientUnits: Record<NutrientKey, string> = {
  calories: "kcal",
  protein: "g",
  carbs: "g",
  fat: "g",
  fiber: "g",
  vitaminA: "mcg",
  vitaminB12: "mcg",
  vitaminC: "mg",
  vitaminD: "mcg",
  vitaminE: "mg",
  vitaminK: "mcg",
  iron: "mg",
  calcium: "mg",
  zinc: "mg",
  magnesium: "mg"
};

export const nutrientKeys = Object.keys(nutrientLabels) as NutrientKey[];

export const emptyNutrients = (): NutrientSet => ({
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  vitaminA: 0,
  vitaminB12: 0,
  vitaminC: 0,
  vitaminD: 0,
  vitaminE: 0,
  vitaminK: 0,
  iron: 0,
  calcium: 0,
  zinc: 0,
  magnesium: 0
});

export const defaultDailyTarget = (): NutrientSet => ({
  calories: 2150,
  protein: 95,
  carbs: 250,
  fat: 72,
  fiber: 30,
  vitaminA: 900,
  vitaminB12: 2.4,
  vitaminC: 90,
  vitaminD: 15,
  vitaminE: 15,
  vitaminK: 120,
  iron: 14,
  calcium: 1000,
  zinc: 10,
  magnesium: 400
});

export const addNutrients = (left: NutrientSet, right: NutrientSet): NutrientSet => {
  const total = emptyNutrients();

  for (const key of nutrientKeys) {
    total[key] = round(left[key] + right[key]);
  }

  return total;
};

export const multiplyNutrients = (nutrients: NutrientSet, factor: number): NutrientSet => {
  const scaled = emptyNutrients();

  for (const key of nutrientKeys) {
    scaled[key] = round(nutrients[key] * factor);
  }

  return scaled;
};

export const ingredientsToNutrients = (ingredients: RecipeIngredient[]): NutrientSet => {
  return ingredients.reduce((totals, ingredient) => {
    const food = foodMap[ingredient.foodId];
    if (!food) {
      return totals;
    }

    const ratio = ingredient.grams / 100;
    const contribution = multiplyNutrients(food.nutrientsPer100g, ratio);
    return addNutrients(totals, contribution);
  }, emptyNutrients());
};

export const percentage = (actual: number, target: number): number => {
  if (target === 0) {
    return 0;
  }

  return round((actual / target) * 100);
};

export const buildProgress = (actual: NutrientSet, target: NutrientSet): NutrientProgress[] =>
  nutrientKeys.map((nutrient) => ({
    nutrient,
    actual: round(actual[nutrient]),
    target: round(target[nutrient]),
    percentage: percentage(actual[nutrient], target[nutrient])
  }));

export const formatNumber = (value: number): string => {
  if (value >= 100) {
    return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value);
  }

  if (value >= 10) {
    return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(value);
  }

  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(value);
};

export const round = (value: number): number => Math.round(value * 100) / 100;
