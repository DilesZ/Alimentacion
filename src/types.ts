export type MealType =
  | "desayuno"
  | "media_manana"
  | "comida"
  | "merienda"
  | "cena";

export type DietPreference = "vegetariano" | "vegano" | "sin_gluten";

export type NutrientKey =
  | "calories"
  | "protein"
  | "carbs"
  | "fat"
  | "fiber"
  | "vitaminA"
  | "vitaminB12"
  | "vitaminC"
  | "vitaminD"
  | "vitaminE"
  | "vitaminK"
  | "iron"
  | "calcium"
  | "zinc"
  | "magnesium";

export type NutrientSet = Record<NutrientKey, number>;

export interface SupermarketProduct {
  chain: "Mercadona" | "Consum";
  storeLabel: string;
  locality: string;
  section: string;
  price: number;
  packSizeGrams: number;
  availability: "alta" | "media";
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  allergens: string[];
  nutrientsPer100g: NutrientSet;
  supermarkets: SupermarketProduct[];
  alternativeIds: string[];
}

export interface RecipeIngredient {
  foodId: string;
  grams: number;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  mealType: MealType;
  servings: number;
  difficulty: "facil" | "media";
  preparationMinutes: number;
  tags: string[];
  cuisine: string;
  steps: string[];
  ingredients: RecipeIngredient[];
}

export interface Restrictions {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  allergies: string[];
}

export interface GeneratorInput {
  people: number;
  days: 30 | 31;
  monthlyBudget: number;
  restrictions: Restrictions;
  preferences: string[];
}

export interface MealPlanEntry {
  mealType: MealType;
  recipe: Recipe;
  scaledIngredients: RecipeIngredient[];
  nutrients: NutrientSet;
  notes: string[];
}

export interface DayPlan {
  day: number;
  meals: MealPlanEntry[];
  totals: NutrientSet;
}

export interface ShoppingListItem {
  foodId: string;
  productName: string;
  chain: "Mercadona" | "Consum";
  section: string;
  gramsNeeded: number;
  packsNeeded: number;
  estimatedCost: number;
  availability: "alta" | "media";
  alternatives: string[];
}

export interface ShoppingSectionGroup {
  chain: "Mercadona" | "Consum";
  section: string;
  items: ShoppingListItem[];
}

export interface NutrientProgress {
  nutrient: NutrientKey;
  target: number;
  actual: number;
  percentage: number;
}

export interface MonthlyPlan {
  input: GeneratorInput;
  days: DayPlan[];
  dailyTarget: NutrientSet;
  monthlyTarget: NutrientSet;
  monthlyTotals: NutrientSet;
  nutrientProgress: NutrientProgress[];
  shoppingList: ShoppingSectionGroup[];
  totalEstimatedCost: number;
  budgetStatus: "dentro" | "ajustado" | "excedido";
}
