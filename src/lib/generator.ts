import { foodMap, mealLabels, recipes } from "../data/catalog";
import {
  DayPlan,
  FoodItem,
  GeneratorInput,
  MealPlanEntry,
  MealType,
  MonthlyPlan,
  NutrientKey,
  Recipe,
  RecipeIngredient,
  ShoppingListItem,
  ShoppingSectionGroup
} from "../types";
import {
  addNutrients,
  buildProgress,
  defaultDailyTarget,
  emptyNutrients,
  ingredientsToNutrients,
  multiplyNutrients,
  nutrientKeys,
  percentage,
  round
} from "./nutrition";

const mealOrder: MealType[] = ["desayuno", "media_manana", "comida", "merienda", "cena"];

const mealWeights: Record<MealType, number> = {
  desayuno: 0.22,
  media_manana: 0.1,
  comida: 0.33,
  merienda: 0.1,
  cena: 0.25
};

const preferredCuisineBonus = (recipe: Recipe, preferences: string[]) => {
  if (preferences.length === 0) {
    return 0;
  }

  return preferences.some((preference) =>
    `${recipe.title} ${recipe.cuisine} ${recipe.tags.join(" ")}`.toLowerCase().includes(preference.toLowerCase())
  )
    ? 1
    : 0;
};

const isRecipeAllowed = (recipe: Recipe, input: GeneratorInput) => {
  const recipeFoods = recipe.ingredients.map((ingredient) => foodMap[ingredient.foodId]).filter(Boolean);

  if (input.restrictions.vegan && recipeFoods.some((food) => !food.tags.includes("vegano"))) {
    return false;
  }

  if (!input.restrictions.vegan && input.restrictions.vegetarian && recipeFoods.some((food) => !food.tags.includes("vegetariano") && !food.tags.includes("vegano"))) {
    return false;
  }

  if (input.restrictions.glutenFree && recipeFoods.some((food) => food.allergens.includes("gluten"))) {
    return false;
  }

  if (input.restrictions.allergies.length > 0) {
    const blocked = new Set(input.restrictions.allergies.map((allergy) => allergy.toLowerCase()));
    if (recipeFoods.some((food) => food.allergens.some((allergen) => blocked.has(allergen.toLowerCase())))) {
      return false;
    }
  }

  return true;
};

const getAllowedRecipesByMeal = (input: GeneratorInput): Record<MealType, Recipe[]> => {
  const filtered = recipes.filter((recipe) => isRecipeAllowed(recipe, input));
  const groups = mealOrder.reduce(
    (accumulator, mealType) => {
      accumulator[mealType] = filtered
        .filter((recipe) => recipe.mealType === mealType)
        .sort((left, right) => preferredCuisineBonus(right, input.preferences) - preferredCuisineBonus(left, input.preferences));
      return accumulator;
    },
    {} as Record<MealType, Recipe[]>
  );

  return groups;
};

const scaleRecipeIngredients = (recipe: Recipe, factor: number, glutenFree: boolean): RecipeIngredient[] =>
  recipe.ingredients.map((ingredient) => {
    if (glutenFree && ingredient.foodId === "whole_bread") {
      return { ...ingredient, foodId: "gluten_free_bread", grams: round(ingredient.grams * factor) };
    }

    if (glutenFree && ingredient.foodId === "whole_pasta") {
      return { ...ingredient, foodId: "gluten_free_pasta", grams: round(ingredient.grams * factor) };
    }

    return { ...ingredient, grams: round(ingredient.grams * factor) };
  });

const cloneMeal = (meal: MealPlanEntry): MealPlanEntry => ({
  ...meal,
  scaledIngredients: meal.scaledIngredients.map((ingredient) => ({ ...ingredient })),
  nutrients: { ...meal.nutrients },
  notes: [...meal.notes]
});

const findFood = (foodId: string): FoodItem => foodMap[foodId];

const addIngredientToMeal = (meal: MealPlanEntry, foodId: string, grams: number, note: string) => {
  const existing = meal.scaledIngredients.find((ingredient) => ingredient.foodId === foodId);
  if (existing) {
    existing.grams = round(existing.grams + grams);
  } else {
    meal.scaledIngredients.push({ foodId, grams });
  }

  meal.nutrients = ingredientsToNutrients(meal.scaledIngredients);
  meal.notes.push(note);
};

const getMealForBooster = (meals: MealPlanEntry[], mealType: MealType) =>
  meals.find((meal) => meal.mealType === mealType) ?? meals[0];

type BoosterTemplate = {
  nutrient: NutrientKey;
  foodId: string;
  grams: number;
  mealType: MealType;
  note: string;
};

const applyBoosters = (day: DayPlan, dailyTarget: ReturnType<typeof defaultDailyTarget>, input: GeneratorInput): DayPlan => {
  const boostedDay: DayPlan = {
    day: day.day,
    meals: day.meals.map(cloneMeal),
    totals: { ...day.totals }
  };

  const boosterTemplates: BoosterTemplate[] = input.restrictions.vegan
    ? [
        { nutrient: "vitaminD", foodId: "uv_mushrooms", grams: 120, mealType: "cena", note: "Refuerzo de vitamina D y minerales." },
        { nutrient: "vitaminB12", foodId: "nutritional_yeast", grams: 10, mealType: "desayuno", note: "Refuerzo fortificado de vitamina B12." },
        { nutrient: "calcium", foodId: "soy_milk", grams: 200, mealType: "merienda", note: "Refuerzo de calcio con bebida fortificada." },
        { nutrient: "iron", foodId: "lentils", grams: 120, mealType: "comida", note: "Refuerzo de hierro vegetal." },
        { nutrient: "vitaminE", foodId: "almonds", grams: 15, mealType: "media_manana", note: "Refuerzo de vitamina E." },
        { nutrient: "vitaminK", foodId: "spinach", grams: 80, mealType: "cena", note: "Refuerzo verde de vitamina K." },
        { nutrient: "magnesium", foodId: "chia", grams: 15, mealType: "desayuno", note: "Refuerzo de magnesio y fibra." }
      ]
    : [
        { nutrient: "vitaminD", foodId: "salmon", grams: 80, mealType: "cena", note: "Refuerzo de vitamina D con pescado azul." },
        { nutrient: "vitaminB12", foodId: "sardines", grams: 40, mealType: "cena", note: "Refuerzo de vitamina B12." },
        { nutrient: "calcium", foodId: "greek_yogurt", grams: 120, mealType: "merienda", note: "Refuerzo extra de calcio." },
        { nutrient: "iron", foodId: "spinach", grams: 70, mealType: "comida", note: "Refuerzo vegetal de hierro y folatos." },
        { nutrient: "vitaminE", foodId: "almonds", grams: 15, mealType: "media_manana", note: "Refuerzo de vitamina E." },
        { nutrient: "vitaminK", foodId: "broccoli", grams: 90, mealType: "cena", note: "Refuerzo extra de vitamina K." },
        { nutrient: "magnesium", foodId: "chia", grams: 12, mealType: "desayuno", note: "Refuerzo de magnesio y fibra." }
      ];

  for (let cycle = 0; cycle < 3; cycle += 1) {
    boostedDay.totals = boostedDay.meals.reduce((totals, meal) => addNutrients(totals, meal.nutrients), emptyNutrients());

    let changed = false;

    for (const booster of boosterTemplates) {
      const food = findFood(booster.foodId);
      const contribution = food.nutrientsPer100g[booster.nutrient];
      const actual = boostedDay.totals[booster.nutrient];
      const target = dailyTarget[booster.nutrient];

      if (actual >= target || contribution <= 0) {
        continue;
      }

      const portionContribution = (contribution * booster.grams) / 100;
      if (portionContribution <= 0) {
        continue;
      }

      const deficit = target - actual;
      const multiplier = Math.min(2, Math.max(1, Math.ceil(deficit / portionContribution)));
      const meal = getMealForBooster(boostedDay.meals, booster.mealType);
      addIngredientToMeal(meal, booster.foodId, booster.grams * multiplier, booster.note);
      changed = true;
    }

    if (!changed) {
      break;
    }
  }

  boostedDay.totals = boostedDay.meals.reduce((totals, meal) => addNutrients(totals, meal.nutrients), emptyNutrients());
  return boostedDay;
};

const buildDayPlan = (dayNumber: number, availableRecipes: Record<MealType, Recipe[]>, input: GeneratorInput, perPersonTarget: ReturnType<typeof defaultDailyTarget>): DayPlan => {
  const meals = mealOrder.map((mealType, index) => {
    const recipesForMeal = availableRecipes[mealType];
    const selectedRecipe = recipesForMeal[(dayNumber + index) % recipesForMeal.length];
    const scaledIngredients = scaleRecipeIngredients(selectedRecipe, input.people, input.restrictions.glutenFree);

    return {
      mealType,
      recipe: selectedRecipe,
      scaledIngredients,
      nutrients: ingredientsToNutrients(scaledIngredients),
      notes: [
        `Objetivo aproximado del bloque: ${Math.round(perPersonTarget.calories * mealWeights[mealType] * input.people)} kcal.`,
        `Receta base: ${mealLabels[mealType]}.`
      ]
    };
  });

  const totals = meals.reduce((accumulator, meal) => addNutrients(accumulator, meal.nutrients), emptyNutrients());
  return { day: dayNumber, meals, totals };
};

const toShoppingList = (days: DayPlan[]): { shoppingList: ShoppingSectionGroup[]; totalEstimatedCost: number } => {
  const gramsByFood = new Map<string, number>();

  for (const day of days) {
    for (const meal of day.meals) {
      for (const ingredient of meal.scaledIngredients) {
        gramsByFood.set(ingredient.foodId, round((gramsByFood.get(ingredient.foodId) ?? 0) + ingredient.grams));
      }
    }
  }

  const items: ShoppingListItem[] = Array.from(gramsByFood.entries()).map(([foodId, gramsNeeded]) => {
    const food = findFood(foodId);
    const chosenProduct = [...food.supermarkets].sort((left, right) => left.price / left.packSizeGrams - right.price / right.packSizeGrams)[0];
    const packsNeeded = Math.max(1, Math.ceil(gramsNeeded / chosenProduct.packSizeGrams));
    const estimatedCost = round(packsNeeded * chosenProduct.price);

    return {
      foodId,
      productName: food.name,
      chain: chosenProduct.chain,
      section: chosenProduct.section,
      gramsNeeded: round(gramsNeeded),
      packsNeeded,
      estimatedCost,
      availability: chosenProduct.availability,
      alternatives: food.alternativeIds.map((id) => foodMap[id]?.name).filter(Boolean)
    };
  });

  const groupedMap = new Map<string, ShoppingSectionGroup>();

  for (const item of items.sort((left, right) => left.chain.localeCompare(right.chain) || left.section.localeCompare(right.section) || left.productName.localeCompare(right.productName))) {
    const key = `${item.chain}-${item.section}`;

    if (!groupedMap.has(key)) {
      groupedMap.set(key, { chain: item.chain, section: item.section, items: [] });
    }

    groupedMap.get(key)!.items.push(item);
  }

  const shoppingList = Array.from(groupedMap.values());
  const totalEstimatedCost = round(items.reduce((sum, item) => sum + item.estimatedCost, 0));

  return { shoppingList, totalEstimatedCost };
};

const calculateBudgetStatus = (totalCost: number, budget: number): MonthlyPlan["budgetStatus"] => {
  if (totalCost <= budget * 0.9) {
    return "dentro";
  }

  if (totalCost <= budget) {
    return "ajustado";
  }

  return "excedido";
};

export const generateMonthlyPlan = (input: GeneratorInput): MonthlyPlan => {
  const availableRecipes = getAllowedRecipesByMeal(input);

  for (const mealType of mealOrder) {
    if (availableRecipes[mealType].length === 0) {
      throw new Error(`No hay recetas compatibles para ${mealLabels[mealType]} con las restricciones seleccionadas.`);
    }
  }

  const perPersonTarget = defaultDailyTarget();
  const dailyTarget = multiplyNutrients(perPersonTarget, input.people);
  const monthlyTarget = multiplyNutrients(dailyTarget, input.days);

  const days = Array.from({ length: input.days }, (_, index) => {
    const baseDay = buildDayPlan(index + 1, availableRecipes, input, perPersonTarget);
    return applyBoosters(baseDay, dailyTarget, input);
  });

  const monthlyTotals = days.reduce((totals, day) => addNutrients(totals, day.totals), emptyNutrients());
  const nutrientProgress = buildProgress(monthlyTotals, monthlyTarget);
  const { shoppingList, totalEstimatedCost } = toShoppingList(days);

  return {
    input,
    days,
    dailyTarget,
    monthlyTarget,
    monthlyTotals,
    nutrientProgress,
    shoppingList,
    totalEstimatedCost,
    budgetStatus: calculateBudgetStatus(totalEstimatedCost, input.monthlyBudget)
  };
};

export const summarizeChainSpend = (shoppingList: ShoppingSectionGroup[]) => {
  const totals = new Map<string, number>();

  for (const group of shoppingList) {
    for (const item of group.items) {
      totals.set(group.chain, round((totals.get(group.chain) ?? 0) + item.estimatedCost));
    }
  }

  return Array.from(totals.entries()).map(([chain, cost]) => ({
    chain,
    cost,
    percentage: percentage(cost, Array.from(totals.values()).reduce((sum, value) => sum + value, 0))
  }));
};

export const summarizeDailyCoverage = (days: DayPlan[], dailyTarget: MonthlyPlan["dailyTarget"]) =>
  days.map((day) => ({
    day: `Dia ${day.day}`,
    energia: percentage(day.totals.calories, dailyTarget.calories),
    proteinas: percentage(day.totals.protein, dailyTarget.protein),
    micronutrientes: round(
      nutrientKeys
        .filter((key) => !["calories", "protein", "carbs", "fat"].includes(key))
        .reduce((sum, key) => sum + percentage(day.totals[key], dailyTarget[key]), 0) / 11
    )
  }));
