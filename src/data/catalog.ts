import { FoodItem, MealType, NutrientSet, Recipe } from "../types";

const zeroNutrients: NutrientSet = {
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
};

const n = (values: Partial<NutrientSet>): NutrientSet => ({
  ...zeroNutrients,
  ...values
});

const product = (
  chain: "Mercadona" | "Consum",
  section: string,
  price: number,
  packSizeGrams: number,
  availability: "alta" | "media" = "alta"
) => ({
  chain,
  storeLabel: `${chain} Paiporta`,
  locality: "Paiporta, Valencia",
  section,
  price,
  packSizeGrams,
  availability
});

export const mealLabels: Record<MealType, string> = {
  desayuno: "Desayuno",
  media_manana: "Media manana",
  comida: "Comida",
  merienda: "Merienda",
  cena: "Cena"
};

export const foods: FoodItem[] = [
  {
    id: "oats",
    name: "Copos de avena integral",
    category: "cereales",
    tags: ["vegetariano"],
    allergens: ["gluten"],
    nutrientsPer100g: n({ calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, iron: 4.7, zinc: 4, magnesium: 177, vitaminB12: 0, vitaminE: 0.4 }),
    supermarkets: [product("Mercadona", "Cereales y desayuno", 1.8, 500), product("Consum", "Desayuno y galletas", 1.95, 500)],
    alternativeIds: ["brown_rice"]
  },
  {
    id: "greek_yogurt",
    name: "Yogur griego natural",
    category: "lacteos",
    tags: ["vegetariano", "sin_gluten"],
    allergens: ["lactosa"],
    nutrientsPer100g: n({ calories: 97, protein: 9, carbs: 3.9, fat: 5, calcium: 120, vitaminB12: 0.5, vitaminA: 40, zinc: 0.6, magnesium: 11 }),
    supermarkets: [product("Mercadona", "Refrigerados", 1.9, 500), product("Consum", "Yogures y postres", 2.1, 500)],
    alternativeIds: ["soy_milk"]
  },
  {
    id: "soy_milk",
    name: "Bebida de soja fortificada",
    category: "bebidas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: ["soja"],
    nutrientsPer100g: n({ calories: 45, protein: 3.2, carbs: 2.5, fat: 2, calcium: 120, vitaminB12: 0.38, vitaminD: 1.2, vitaminA: 60, vitaminE: 0.9 }),
    supermarkets: [product("Mercadona", "Bebidas vegetales", 1.35, 1000), product("Consum", "Bebidas vegetales", 1.49, 1000)],
    alternativeIds: ["greek_yogurt"]
  },
  {
    id: "whole_bread",
    name: "Pan integral",
    category: "panaderia",
    tags: ["vegetariano"],
    allergens: ["gluten"],
    nutrientsPer100g: n({ calories: 247, protein: 8.8, carbs: 41, fat: 3.4, fiber: 7, iron: 2.7, magnesium: 82, zinc: 1.2 }),
    supermarkets: [product("Mercadona", "Panaderia", 1.55, 400), product("Consum", "Panaderia", 1.75, 400)],
    alternativeIds: ["gluten_free_bread"]
  },
  {
    id: "gluten_free_bread",
    name: "Pan sin gluten",
    category: "panaderia",
    tags: ["vegetariano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 265, protein: 5, carbs: 48, fat: 5, fiber: 6, iron: 1.5, magnesium: 28 }),
    supermarkets: [product("Mercadona", "Dieteticos", 2.85, 300), product("Consum", "Especialidades sin gluten", 3.05, 300)],
    alternativeIds: ["whole_bread"]
  },
  {
    id: "egg",
    name: "Huevo",
    category: "proteinas",
    tags: ["vegetariano", "sin_gluten"],
    allergens: ["huevo"],
    nutrientsPer100g: n({ calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, vitaminA: 140, vitaminB12: 1.1, vitaminD: 2.2, vitaminE: 1.1, iron: 1.8, zinc: 1.1 }),
    supermarkets: [product("Mercadona", "Huevos", 2.4, 700), product("Consum", "Huevos", 2.65, 700)],
    alternativeIds: ["tofu"]
  },
  {
    id: "avocado",
    name: "Aguacate",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, vitaminE: 2.1, vitaminK: 21, magnesium: 29 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 2.99, 500), product("Consum", "Frutas y verduras", 3.1, 500)],
    alternativeIds: ["olive_oil"]
  },
  {
    id: "banana",
    name: "Platano",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, vitaminC: 8.7, vitaminB12: 0, magnesium: 27 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.75, 1000), product("Consum", "Frutas y verduras", 1.85, 1000)],
    alternativeIds: ["orange", "kiwi"]
  },
  {
    id: "orange",
    name: "Naranja",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, vitaminC: 53, calcium: 40, vitaminA: 11 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 2.1, 1000), product("Consum", "Frutas y verduras", 2.25, 1000)],
    alternativeIds: ["kiwi", "banana"]
  },
  {
    id: "kiwi",
    name: "Kiwi",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5, fiber: 3, vitaminC: 92.7, vitaminE: 1.5, vitaminK: 40, magnesium: 17 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 2.85, 500), product("Consum", "Frutas y verduras", 2.95, 500)],
    alternativeIds: ["orange"]
  },
  {
    id: "almonds",
    name: "Almendras naturales",
    category: "frutos_secos",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: ["frutos secos"],
    nutrientsPer100g: n({ calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9, fiber: 12.5, vitaminE: 25.6, calcium: 269, iron: 3.7, zinc: 3.1, magnesium: 270 }),
    supermarkets: [product("Mercadona", "Frutos secos", 2.55, 200), product("Consum", "Frutos secos", 2.7, 200)],
    alternativeIds: ["chia"]
  },
  {
    id: "chia",
    name: "Semillas de chia",
    category: "semillas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4, calcium: 631, iron: 7.7, zinc: 4.6, magnesium: 335 }),
    supermarkets: [product("Mercadona", "Semillas y superalimentos", 2.45, 250), product("Consum", "Dieteticos", 2.7, 250)],
    alternativeIds: ["almonds"]
  },
  {
    id: "spinach",
    name: "Espinaca fresca",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, vitaminA: 469, vitaminC: 28, vitaminE: 2, vitaminK: 483, iron: 2.7, calcium: 99, magnesium: 79 }),
    supermarkets: [product("Mercadona", "Verduras refrigeradas", 1.55, 300), product("Consum", "Verduras refrigeradas", 1.65, 300)],
    alternativeIds: ["broccoli"]
  },
  {
    id: "broccoli",
    name: "Brocoli",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, vitaminA: 31, vitaminC: 89, vitaminK: 102, calcium: 47, iron: 0.7, magnesium: 21 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.9, 500), product("Consum", "Frutas y verduras", 2.05, 500)],
    alternativeIds: ["spinach"]
  },
  {
    id: "lentils",
    name: "Lentejas cocidas",
    category: "legumbres",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, iron: 3.3, zinc: 1.3, magnesium: 36 }),
    supermarkets: [product("Mercadona", "Legumbres cocidas", 0.95, 400), product("Consum", "Conservas vegetales", 1.05, 400)],
    alternativeIds: ["chickpeas", "tofu"]
  },
  {
    id: "chickpeas",
    name: "Garbanzos cocidos",
    category: "legumbres",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, iron: 2.9, zinc: 1.5, magnesium: 48, calcium: 49 }),
    supermarkets: [product("Mercadona", "Legumbres cocidas", 0.99, 400), product("Consum", "Conservas vegetales", 1.09, 400)],
    alternativeIds: ["lentils", "tofu"]
  },
  {
    id: "quinoa",
    name: "Quinoa cocida",
    category: "cereales",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, iron: 1.5, zinc: 1.1, magnesium: 64 }),
    supermarkets: [product("Mercadona", "Arroces y quinoa", 2.65, 250), product("Consum", "Dieteticos", 2.85, 250)],
    alternativeIds: ["brown_rice"]
  },
  {
    id: "brown_rice",
    name: "Arroz integral cocido",
    category: "cereales",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 123, protein: 2.7, carbs: 25.6, fat: 1, fiber: 1.8, iron: 0.6, magnesium: 44, zinc: 0.8 }),
    supermarkets: [product("Mercadona", "Arroces", 1.55, 500), product("Consum", "Arroces", 1.7, 500)],
    alternativeIds: ["quinoa", "oats"]
  },
  {
    id: "salmon",
    name: "Salmon fresco",
    category: "pescado",
    tags: ["sin_gluten"],
    allergens: ["pescado"],
    nutrientsPer100g: n({ calories: 208, protein: 20, carbs: 0, fat: 13, vitaminD: 10, vitaminB12: 3.2, vitaminE: 2, iron: 0.8, zinc: 0.6, magnesium: 27 }),
    supermarkets: [product("Mercadona", "Pescaderia", 5.8, 300), product("Consum", "Pescaderia", 6.15, 300)],
    alternativeIds: ["sardines", "chicken"]
  },
  {
    id: "sardines",
    name: "Sardinas en conserva",
    category: "pescado",
    tags: ["sin_gluten"],
    allergens: ["pescado"],
    nutrientsPer100g: n({ calories: 208, protein: 24.6, carbs: 0, fat: 11.5, vitaminD: 4.8, vitaminB12: 8.9, calcium: 382, iron: 2.9, zinc: 1.3, magnesium: 39 }),
    supermarkets: [product("Mercadona", "Conservas de pescado", 2.3, 120), product("Consum", "Conservas de pescado", 2.45, 120)],
    alternativeIds: ["salmon", "chicken"]
  },
  {
    id: "tofu",
    name: "Tofu firme enriquecido con calcio",
    category: "proteinas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: ["soja"],
    nutrientsPer100g: n({ calories: 144, protein: 17.3, carbs: 3.2, fat: 8.7, calcium: 350, iron: 2.7, zinc: 1.4, magnesium: 30 }),
    supermarkets: [product("Mercadona", "Refrigerados veganos", 2.2, 250), product("Consum", "Vegetal refrigerado", 2.35, 250)],
    alternativeIds: ["chickpeas", "egg"]
  },
  {
    id: "chicken",
    name: "Pechuga de pollo",
    category: "carnes",
    tags: ["sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 165, protein: 31, carbs: 0, fat: 3.6, vitaminB12: 0.3, iron: 1, zinc: 1, magnesium: 29 }),
    supermarkets: [product("Mercadona", "Carniceria", 4.25, 400), product("Consum", "Carniceria", 4.45, 400)],
    alternativeIds: ["turkey", "tofu"]
  },
  {
    id: "turkey",
    name: "Pavo loncheado bajo en sal",
    category: "carnes",
    tags: ["sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 104, protein: 17, carbs: 2, fat: 2, vitaminB12: 0.8, zinc: 1.2, iron: 1 }),
    supermarkets: [product("Mercadona", "Charcuteria", 2.15, 200), product("Consum", "Charcuteria", 2.25, 200)],
    alternativeIds: ["chicken", "tofu"]
  },
  {
    id: "sweet_potato",
    name: "Boniato",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, fiber: 3, vitaminA: 709, vitaminC: 2.4, magnesium: 25 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.85, 1000), product("Consum", "Frutas y verduras", 1.95, 1000)],
    alternativeIds: ["pumpkin", "carrot"]
  },
  {
    id: "carrot",
    name: "Zanahoria",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, vitaminA: 835, vitaminC: 5.9, vitaminK: 13.2, magnesium: 12 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.15, 1000), product("Consum", "Frutas y verduras", 1.25, 1000)],
    alternativeIds: ["pumpkin", "sweet_potato"]
  },
  {
    id: "hummus",
    name: "Hummus clasico",
    category: "refrigerados",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: ["sesamo"],
    nutrientsPer100g: n({ calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6, fiber: 6, iron: 2.4, calcium: 49, magnesium: 29 }),
    supermarkets: [product("Mercadona", "Refrigerados", 1.55, 240), product("Consum", "Refrigerados", 1.65, 240)],
    alternativeIds: ["chickpeas", "tofu"]
  },
  {
    id: "olive_oil",
    name: "Aceite de oliva virgen extra",
    category: "aceites",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 884, fat: 100, vitaminE: 14, vitaminK: 60 }),
    supermarkets: [product("Mercadona", "Aceites", 6.4, 500), product("Consum", "Aceites", 6.7, 500)],
    alternativeIds: ["avocado"]
  },
  {
    id: "tomato",
    name: "Tomate",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, vitaminA: 42, vitaminC: 14, vitaminK: 7.9 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.85, 1000), product("Consum", "Frutas y verduras", 1.95, 1000)],
    alternativeIds: ["pumpkin"]
  },
  {
    id: "uv_mushrooms",
    name: "Champinones expuestos a UV",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, vitaminD: 10, vitaminB12: 0, magnesium: 9 }),
    supermarkets: [product("Mercadona", "Setas y verduras", 2.15, 300), product("Consum", "Setas y verduras", 2.25, 300)],
    alternativeIds: ["broccoli", "spinach"]
  },
  {
    id: "nutritional_yeast",
    name: "Levadura nutricional fortificada",
    category: "dieteticos",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 325, protein: 45, carbs: 35, fat: 5, fiber: 20, vitaminB12: 17, zinc: 7, iron: 5, magnesium: 180 }),
    supermarkets: [product("Mercadona", "Dieteticos", 3.45, 150, "media"), product("Consum", "Dieteticos", 3.7, 150, "media")],
    alternativeIds: ["soy_milk"]
  },
  {
    id: "pumpkin",
    name: "Calabaza",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, vitaminA: 426, vitaminC: 9, vitaminE: 1.1, magnesium: 12 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.6, 1000), product("Consum", "Frutas y verduras", 1.7, 1000)],
    alternativeIds: ["sweet_potato", "carrot"]
  },
  {
    id: "whole_pasta",
    name: "Pasta integral",
    category: "pastas",
    tags: ["vegetariano"],
    allergens: ["gluten"],
    nutrientsPer100g: n({ calories: 348, protein: 13, carbs: 67, fat: 2.5, fiber: 8, iron: 3.6, magnesium: 85, zinc: 1.8 }),
    supermarkets: [product("Mercadona", "Pastas", 1.25, 500), product("Consum", "Pastas", 1.35, 500)],
    alternativeIds: ["gluten_free_pasta"]
  },
  {
    id: "gluten_free_pasta",
    name: "Pasta sin gluten",
    category: "pastas",
    tags: ["vegetariano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 356, protein: 6.5, carbs: 78, fat: 1.5, fiber: 2.5, iron: 1.2, magnesium: 20 }),
    supermarkets: [product("Mercadona", "Especialidades sin gluten", 2.25, 400), product("Consum", "Especialidades sin gluten", 2.45, 400)],
    alternativeIds: ["whole_pasta", "brown_rice"]
  }
];

export const foodMap = Object.fromEntries(foods.map((food) => [food.id, food])) as Record<string, FoodItem>;

const recipe = (
  id: string,
  title: string,
  mealType: MealType,
  preparationMinutes: number,
  tags: string[],
  ingredients: Array<[string, number]>,
  steps: string[],
  cuisine = "mediterranea"
): Recipe => ({
  id,
  title,
  mealType,
  servings: 1,
  difficulty: preparationMinutes <= 15 ? "facil" : "media",
  preparationMinutes,
  tags,
  cuisine,
  steps,
  ingredients: ingredients.map(([foodId, grams]) => ({ foodId, grams }))
});

export const recipes: Recipe[] = [
  recipe(
    "breakfast-oats",
    "Porridge de avena con yogur, platano y chia",
    "desayuno",
    10,
    ["vegetariano"],
    [["oats", 60], ["greek_yogurt", 180], ["banana", 120], ["chia", 15], ["almonds", 20]],
    [
      "Calienta ligeramente la avena con un poco de agua hasta que espese.",
      "Sirve con yogur griego, rodajas de platano y semillas de chia.",
      "Anade almendras picadas por encima para mejorar saciedad y vitamina E."
    ]
  ),
  recipe(
    "breakfast-toast",
    "Tostada integral con aguacate, tomate y huevo",
    "desayuno",
    12,
    ["vegetariano"],
    [["whole_bread", 80], ["avocado", 70], ["tomato", 80], ["egg", 110], ["olive_oil", 5]],
    [
      "Tuesta el pan integral.",
      "Cocina el huevo a la plancha o cocido durante 6 a 8 minutos.",
      "Monta la tostada con aguacate, tomate y un hilo de aceite."
    ]
  ),
  recipe(
    "breakfast-smoothie",
    "Batido verde fortificado con soja y levadura nutricional",
    "desayuno",
    8,
    ["vegetariano", "vegano", "sin_gluten"],
    [["soy_milk", 300], ["spinach", 60], ["banana", 120], ["chia", 18], ["uv_mushrooms", 70], ["nutritional_yeast", 10]],
    [
      "Introduce todos los ingredientes en la batidora.",
      "Tritura hasta obtener una textura fina y homogena.",
      "Sirve frio para preservar vitamina C y una parte de la vitamina D fortificada."
    ]
  ),
  recipe(
    "breakfast-chia",
    "Pudin de chia con kiwi y bebida de soja",
    "desayuno",
    10,
    ["vegetariano", "vegano", "sin_gluten"],
    [["soy_milk", 280], ["chia", 30], ["kiwi", 140], ["almonds", 15]],
    [
      "Mezcla la bebida de soja con la chia y deja reposar al menos 20 minutos.",
      "Sirve con kiwi troceado y almendras laminadas.",
      "Aporta fibra, calcio y omega vegetal para empezar el dia."
    ]
  ),
  recipe(
    "snack-fruit-nuts",
    "Fruta fresca con almendras",
    "media_manana",
    5,
    ["vegetariano", "vegano", "sin_gluten"],
    [["orange", 180], ["almonds", 25]],
    [
      "Lava y pela la fruta si es necesario.",
      "Combina con las almendras para sumar vitamina C y grasas saludables."
    ]
  ),
  recipe(
    "snack-hummus",
    "Hummus con bastones de zanahoria",
    "media_manana",
    5,
    ["vegetariano", "vegano", "sin_gluten"],
    [["hummus", 80], ["carrot", 120]],
    [
      "Corta la zanahoria en bastones.",
      "Sirve junto al hummus como tentempie rico en fibra y hierro."
    ]
  ),
  recipe(
    "snack-yogurt",
    "Yogur con kiwi y chia",
    "media_manana",
    5,
    ["vegetariano", "sin_gluten"],
    [["greek_yogurt", 170], ["kiwi", 120], ["chia", 12]],
    [
      "Sirve el yogur en un bol.",
      "Anade kiwi y chia justo antes de consumir."
    ]
  ),
  recipe(
    "lunch-lentils",
    "Lentejas con espinacas, quinoa y zanahoria",
    "comida",
    25,
    ["vegetariano", "vegano", "sin_gluten"],
    [["lentils", 220], ["spinach", 120], ["carrot", 100], ["quinoa", 150], ["olive_oil", 10]],
    [
      "Saltea zanahoria y espinaca con aceite.",
      "Anade lentejas y quinoa cocida y cocina 5 minutos.",
      "Rectifica de especias y sirve caliente."
    ]
  ),
  recipe(
    "lunch-salmon",
    "Salmon al horno con arroz integral y brocoli",
    "comida",
    30,
    ["sin_gluten"],
    [["salmon", 180], ["brown_rice", 180], ["broccoli", 200], ["olive_oil", 10], ["orange", 100]],
    [
      "Hornea el salmon a 190 grados durante 14 minutos.",
      "Cuece el brocoli al vapor y acompana con arroz integral.",
      "Sirve con gajos de naranja para reforzar absorcion del hierro."
    ]
  ),
  recipe(
    "lunch-quinoa",
    "Bowl de quinoa con garbanzos, brocoli y aguacate",
    "comida",
    20,
    ["vegetariano", "vegano", "sin_gluten"],
    [["quinoa", 180], ["chickpeas", 180], ["broccoli", 160], ["avocado", 80], ["olive_oil", 8]],
    [
      "Calienta quinoa y garbanzos por separado.",
      "Cocina el brocoli al vapor o salteado.",
      "Monta el bowl con aguacate laminado y aceite."
    ]
  ),
  recipe(
    "lunch-chicken",
    "Pollo a la plancha con boniato y espinacas",
    "comida",
    25,
    ["sin_gluten"],
    [["chicken", 180], ["sweet_potato", 220], ["spinach", 120], ["olive_oil", 10]],
    [
      "Asa el boniato hasta que quede tierno.",
      "Cocina el pollo a la plancha y saltea ligeramente la espinaca.",
      "Sirve todo junto para una comida completa y saciante."
    ]
  ),
  recipe(
    "lunch-pasta",
    "Pasta integral con pavo y tomate",
    "comida",
    20,
    ["sin_gluten_opcional"],
    [["whole_pasta", 90], ["turkey", 120], ["tomato", 140], ["spinach", 80], ["olive_oil", 8]],
    [
      "Cuece la pasta al dente.",
      "Saltea el pavo con tomate y espinaca.",
      "Mezcla y ajusta con aceite de oliva."
    ],
    "fusion"
  ),
  recipe(
    "snack-toast",
    "Tostada de hummus y tomate",
    "merienda",
    6,
    ["vegetariano"],
    [["whole_bread", 70], ["hummus", 70], ["tomato", 80]],
    [
      "Tuesta el pan.",
      "Unta hummus y termina con tomate en rodajas."
    ]
  ),
  recipe(
    "snack-smoothie",
    "Batido citrico con soja, kiwi y levadura nutricional",
    "merienda",
    6,
    ["vegetariano", "vegano", "sin_gluten"],
    [["soy_milk", 250], ["kiwi", 100], ["orange", 140], ["nutritional_yeast", 8]],
    [
      "Tritura todos los ingredientes hasta homogeneizar.",
      "Sirve recien hecho para aprovechar micronutrientes y calcio."
    ]
  ),
  recipe(
    "snack-yogurt-afternoon",
    "Yogur con naranja y almendras",
    "merienda",
    5,
    ["vegetariano", "sin_gluten"],
    [["greek_yogurt", 170], ["orange", 150], ["almonds", 18]],
    [
      "Sirve el yogur con gajos de naranja.",
      "Anade almendras para mejorar saciedad y vitamina E."
    ]
  ),
  recipe(
    "dinner-tortilla",
    "Tortilla de espinacas con tomate",
    "cena",
    15,
    ["vegetariano", "sin_gluten"],
    [["egg", 120], ["spinach", 120], ["tomato", 100], ["olive_oil", 6], ["gluten_free_bread", 50]],
    [
      "Bate el huevo y cocina con la espinaca hasta cuajar.",
      "Acompana con tomate fresco y una rebanada de pan."
    ]
  ),
  recipe(
    "dinner-tofu",
    "Tofu salteado con setas UV y arroz integral",
    "cena",
    18,
    ["vegetariano", "vegano", "sin_gluten"],
    [["tofu", 180], ["uv_mushrooms", 140], ["brown_rice", 160], ["broccoli", 120], ["olive_oil", 8]],
    [
      "Dora el tofu en una sarten amplia.",
      "Saltea setas y brocoli a fuego vivo.",
      "Sirve con arroz integral para completar aminoacidos y vitamina D."
    ]
  ),
  recipe(
    "dinner-sardines",
    "Sardinas con quinoa y ensalada de tomate",
    "cena",
    10,
    ["sin_gluten"],
    [["sardines", 120], ["quinoa", 170], ["tomato", 150], ["spinach", 60], ["olive_oil", 8]],
    [
      "Escurre las sardinas y prepara la quinoa.",
      "Combina tomate y espinaca como ensalada fresca.",
      "Aliña con aceite y sirve."
    ]
  ),
  recipe(
    "dinner-cream",
    "Crema de calabaza con garbanzos y levadura nutricional",
    "cena",
    20,
    ["vegetariano", "vegano", "sin_gluten"],
    [["pumpkin", 250], ["carrot", 80], ["chickpeas", 160], ["soy_milk", 150], ["nutritional_yeast", 10], ["olive_oil", 8]],
    [
      "Cuece calabaza y zanahoria hasta que esten tiernas.",
      "Tritura con bebida de soja hasta conseguir una crema fina.",
      "Sirve con garbanzos templados y levadura nutricional por encima."
    ]
  )
];
