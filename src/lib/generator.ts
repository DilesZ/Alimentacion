import { foodMap, mealLabels, recipes } from "../data/catalog";
import {
  DayPlan,
  FoodItem,
  GeneratorInput,
  MealType,
  MonthlyPlan,
  Recipe,
  RecipeIngredient,
  ShoppingListItem,
  ShoppingSectionGroup,
  WeeklyShoppingPlan
} from "../types";
import { addNutrients, buildProgress, defaultDailyTarget, emptyNutrients, ingredientsToNutrients, multiplyNutrients, percentage, round } from "./nutrition";

const mealOrder: MealType[] = ["desayuno", "comida", "cena"];

const mealWeights: Record<MealType, number> = {
  desayuno: 0.25,
  media_manana: 0,
  comida: 0.4,
  merienda: 0,
  cena: 0.35
};

const disallowedFoodIds = new Set([
  "avocado",
  "chia",
  "hummus",
  "nutritional_yeast",
  "quinoa",
  "salmon",
  "soy_milk",
  "tofu",
  "uv_mushrooms"
]);

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

const isRecipePlanCompliant = (recipe: Recipe) =>
  recipe.preparationMinutes <= 15 &&
  recipe.ingredients.length <= 5 &&
  recipe.budget.costPerServing <= 2.8 &&
  recipe.ingredients.every((ingredient) => !disallowedFoodIds.has(ingredient.foodId));

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
  const filtered = recipes.filter((recipe) => isRecipeAllowed(recipe, input) && isRecipePlanCompliant(recipe));
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

const findFood = (foodId: string): FoodItem => foodMap[foodId];
const selectRecipeForDay = (recipesForMeal: Recipe[], dayNumber: number, offset: number) => {
  const weekIndex = Math.floor((dayNumber - 1) / 7);
  const weeklySpan = Math.min(3, recipesForMeal.length);
  const weeklySlot = (dayNumber - 1) % weeklySpan;
  return recipesForMeal[(weekIndex * weeklySpan + weeklySlot + offset) % recipesForMeal.length];
};

const buildDayPlan = (
  dayNumber: number,
  availableRecipes: Record<MealType, Recipe[]>,
  input: GeneratorInput,
  perPersonTarget: ReturnType<typeof defaultDailyTarget>
): DayPlan => {
  const meals = mealOrder.map((mealType, index) => {
    const recipesForMeal = availableRecipes[mealType];
    const selectedRecipe = selectRecipeForDay(recipesForMeal, dayNumber, index);
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

const buildWeeklyShopping = (days: DayPlan[]): WeeklyShoppingPlan[] => {
  const weeklyPlans: WeeklyShoppingPlan[] = [];

  for (let index = 0; index < days.length; index += 7) {
    const weekDays = days.slice(index, index + 7);
    const ingredientUsage = new Map<string, number>();

    for (const day of weekDays) {
      for (const meal of day.meals) {
        for (const ingredient of meal.scaledIngredients) {
          ingredientUsage.set(ingredient.foodId, round((ingredientUsage.get(ingredient.foodId) ?? 0) + ingredient.grams));
        }
      }
    }

    const highlights = Array.from(ingredientUsage.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([foodId]) => findFood(foodId).name);

    const { shoppingList, totalEstimatedCost } = toShoppingList(weekDays);

    weeklyPlans.push({
      week: weeklyPlans.length + 1,
      startDay: weekDays[0].day,
      endDay: weekDays[weekDays.length - 1].day,
      shoppingList,
      estimatedCost: totalEstimatedCost,
      reuseHighlights: highlights,
      wasteTips: [
        `Prioriza primero ${highlights.slice(0, 2).join(" y ").toLowerCase()} para reutilizarlos en varias recetas de la semana.`,
        "Lava y corta verduras en una sola tanda para desayunos, comidas y cenas.",
        "Reserva sobrantes cocinados de arroz, lentejas o pollo para la siguiente receta del mismo bloque semanal."
      ]
    });
  }

  return weeklyPlans;
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

  const days = Array.from({ length: input.days }, (_, index) => buildDayPlan(index + 1, availableRecipes, input, perPersonTarget));

  const monthlyTotals = days.reduce((totals, day) => addNutrients(totals, day.totals), emptyNutrients());
  const nutrientProgress = buildProgress(monthlyTotals, monthlyTarget);
  const { shoppingList, totalEstimatedCost } = toShoppingList(days);
  const weeklyShopping = buildWeeklyShopping(days);

  return {
    input,
    days,
    dailyTarget,
    monthlyTarget,
    monthlyTotals,
    nutrientProgress,
    shoppingList,
    weeklyShopping,
    totalEstimatedCost,
    budgetStatus: calculateBudgetStatus(totalEstimatedCost, input.monthlyBudget * input.people)
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
      (
        percentage(day.totals.fiber, dailyTarget.fiber) +
        percentage(day.totals.vitaminA, dailyTarget.vitaminA) +
        percentage(day.totals.vitaminC, dailyTarget.vitaminC) +
        percentage(day.totals.iron, dailyTarget.iron) +
        percentage(day.totals.calcium, dailyTarget.calcium)
      ) / 5
    )
  }));
