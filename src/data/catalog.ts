import {
  FoodItem,
  MealType,
  NutrientSet,
  Recipe,
  RecipeBudgetInsight,
  RecipeStepMedia,
  RecipeVideoConfig
} from "../types";

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
  availability: "alta" | "media" = "alta",
  mercadonaUrl?: string
) => ({
  chain,
  storeLabel: `${chain} Paiporta`,
  locality: "Paiporta, Valencia",
  section,
  price,
  packSizeGrams,
  availability,
  url: mercadonaUrl
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
    supermarkets: [product("Mercadona", "Cereales y desayuno", 2.1, 500, "alta", "https://tienda.mercadona.es/product/86368/copos-avena-hacendado-paquete"), product("Consum", "Desayuno y galletas", 1.95, 500)],
    alternativeIds: ["brown_rice"]
  },
  {
    id: "greek_yogurt",
    name: "Yogur griego natural",
    category: "lacteos",
    tags: ["vegetariano", "sin_gluten"],
    allergens: ["lactosa"],
    nutrientsPer100g: n({ calories: 97, protein: 9, carbs: 3.9, fat: 5, calcium: 120, vitaminB12: 0.5, vitaminA: 40, zinc: 0.6, magnesium: 11 }),
    supermarkets: [product("Mercadona", "Refrigerados", 2.2, 1000, "alta", "https://tienda.mercadona.es/product/20512/yogur-griego-natural-hacendado-bote"), product("Consum", "Yogures y postres", 2.1, 500)],
    alternativeIds: ["soy_milk"]
  },
  {
    id: "soy_milk",
    name: "Bebida de soja fortificada",
    category: "bebidas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: ["soja"],
    nutrientsPer100g: n({ calories: 45, protein: 3.2, carbs: 2.5, fat: 2, calcium: 120, vitaminB12: 0.38, vitaminD: 1.2, vitaminA: 60, vitaminE: 0.9 }),
    supermarkets: [product("Mercadona", "Bebidas vegetales", 1.35, 1000, "alta", "https://tienda.mercadona.es/product/29314/bebida-soja-0-azucares-hacendado-brick"), product("Consum", "Bebidas vegetales", 1.49, 1000)],
    alternativeIds: ["greek_yogurt"]
  },
  {
    id: "whole_bread",
    name: "Pan integral",
    category: "panaderia",
    tags: ["vegetariano"],
    allergens: ["gluten"],
    nutrientsPer100g: n({ calories: 247, protein: 8.8, carbs: 41, fat: 3.4, fiber: 7, iron: 2.7, magnesium: 82, zinc: 1.2 }),
    supermarkets: [product("Mercadona", "Panaderia", 1.5, 350, "alta", "https://tienda.mercadona.es/product/12049.1/pan-integral-trigo-100"), product("Consum", "Panaderia", 1.75, 400)],
    alternativeIds: ["gluten_free_bread"]
  },
  {
    id: "gluten_free_bread",
    name: "Pan sin gluten",
    category: "panaderia",
    tags: ["vegetariano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 265, protein: 5, carbs: 48, fat: 5, fiber: 6, iron: 1.5, magnesium: 28 }),
    supermarkets: [product("Mercadona", "Panaderia", 2.85, 300, "alta", "https://tienda.mercadona.es/product/82735/hogaza-sin-gluten-cortada-paquete"), product("Consum", "Especialidades sin gluten", 3.05, 300)],
    alternativeIds: ["whole_bread"]
  },
  {
    id: "egg",
    name: "Huevo",
    category: "proteinas",
    tags: ["vegetariano", "sin_gluten"],
    allergens: ["huevo"],
    nutrientsPer100g: n({ calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, vitaminA: 140, vitaminB12: 1.1, vitaminD: 2.2, vitaminE: 1.1, iron: 1.8, zinc: 1.1 }),
    supermarkets: [product("Mercadona", "Huevos", 3.55, 600, "alta", "https://tienda.mercadona.es/product/30167/huevos-tamanos-diferentes-paquete")],
    alternativeIds: ["tofu"]
  },
  {
    id: "avocado",
    name: "Aguacate",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, vitaminE: 2.1, vitaminK: 21, magnesium: 29 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 2.99, 500, "alta", "https://tienda.mercadona.es/product/3830/aguacate-pieza"), product("Consum", "Frutas y verduras", 3.1, 500)],
    alternativeIds: ["olive_oil"]
  },
  {
    id: "banana",
    name: "Platano",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, vitaminC: 8.7, vitaminB12: 0, magnesium: 27 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.55, 1000, "alta", "https://tienda.mercadona.es/product/3824/banana-pieza"), product("Consum", "Frutas y verduras", 1.85, 1000)],
    alternativeIds: ["orange", "kiwi"]
  },
  {
    id: "orange",
    name: "Naranja",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, vitaminC: 53, calcium: 40, vitaminA: 11 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.85, 1000, "alta", "https://tienda.mercadona.es/product/3235/naranja-mesa-pieza"), product("Consum", "Frutas y verduras", 2.25, 1000)],
    alternativeIds: ["kiwi", "banana"]
  },
  {
    id: "kiwi",
    name: "Kiwi",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5, fiber: 3, vitaminC: 92.7, vitaminE: 1.5, vitaminK: 40, magnesium: 17 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 3.25, 500, "alta", "https://tienda.mercadona.es/product/3820/kiwi-verde-pieza"), product("Consum", "Frutas y verduras", 2.95, 500)],
    alternativeIds: ["orange"]
  },
  {
    id: "almonds",
    name: "Almendras naturales",
    category: "frutos_secos",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: ["frutos secos"],
    nutrientsPer100g: n({ calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9, fiber: 12.5, vitaminE: 25.6, calcium: 269, iron: 3.7, zinc: 3.1, magnesium: 270 }),
    supermarkets: [product("Mercadona", "Frutos secos", 2.55, 200, "alta", "https://tienda.mercadona.es/product/23575/almendra-natural-hacendado-sin-piel-paquete"), product("Consum", "Frutos secos", 2.7, 200)],
    alternativeIds: ["chia"]
  },
  {
    id: "chia",
    name: "Semillas de chia",
    category: "semillas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4, calcium: 631, iron: 7.7, zinc: 4.6, magnesium: 335 }),
    supermarkets: [product("Mercadona", "Semillas y superalimentos", 2.45, 250, "alta", "https://tienda.mercadona.es/product/5464/semillas-chia-hacendado-paquete"), product("Consum", "Dieteticos", 2.7, 250)],
    alternativeIds: ["almonds"]
  },
  {
    id: "spinach",
    name: "Espinaca fresca",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, vitaminA: 469, vitaminC: 28, vitaminE: 2, vitaminK: 483, iron: 2.7, calcium: 99, magnesium: 79 }),
    supermarkets: [product("Mercadona", "Verduras refrigeradas", 1.55, 300, "alta", "https://tienda.mercadona.es/product/69730/espinacas-cortadas-paquete"), product("Consum", "Verduras refrigeradas", 1.65, 300)],
    alternativeIds: ["broccoli"]
  },
  {
    id: "broccoli",
    name: "Brocoli",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, vitaminA: 31, vitaminC: 89, vitaminK: 102, calcium: 47, iron: 0.7, magnesium: 21 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.9, 500, "alta", "https://tienda.mercadona.es/product/69580/brocoli-pieza"), product("Consum", "Frutas y verduras", 2.05, 500)],
    alternativeIds: ["spinach"]
  },
  {
    id: "lentils",
    name: "Lentejas cocidas",
    category: "legumbres",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, iron: 3.3, zinc: 1.3, magnesium: 36 }),
    supermarkets: [product("Mercadona", "Legumbres cocidas", 0.9, 570, "alta", "https://tienda.mercadona.es/product/26030/lenteja-cocida-hacendado-tarro"), product("Consum", "Conservas vegetales", 1.05, 400)],
    alternativeIds: ["chickpeas", "tofu"]
  },
  {
    id: "chickpeas",
    name: "Garbanzos cocidos",
    category: "legumbres",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, iron: 2.9, zinc: 1.5, magnesium: 48, calcium: 49 }),
    supermarkets: [product("Mercadona", "Legumbres cocidas", 0.85, 570, "alta", "https://tienda.mercadona.es/product/26029/garbanzo-cocido-hacendado-tarro"), product("Consum", "Conservas vegetales", 1.09, 400)],
    alternativeIds: ["lentils", "tofu"]
  },
  {
    id: "quinoa",
    name: "Quinoa cocida",
    category: "cereales",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, iron: 1.5, zinc: 1.1, magnesium: 64 }),
    supermarkets: [product("Mercadona", "Arroces y quinoa", 1.4, 250, "alta", "https://tienda.mercadona.es/product/22278/quinoa-cocida-blanca-roja-sabroz-brillante-pack-2"), product("Consum", "Dieteticos", 2.85, 250)],
    alternativeIds: ["brown_rice"]
  },
  {
    id: "brown_rice",
    name: "Arroz integral cocido",
    category: "cereales",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 123, protein: 2.7, carbs: 25.6, fat: 1, fiber: 1.8, iron: 0.6, magnesium: 44, zinc: 0.8 }),
    supermarkets: [product("Mercadona", "Arroces", 1.65, 1000, "alta", "https://tienda.mercadona.es/product/5184/arroz-integral-largo-hacendado-paquete"), product("Consum", "Arroces", 1.7, 500)],
    alternativeIds: ["quinoa", "oats"]
  },
  {
    id: "salmon",
    name: "Salmon fresco",
    category: "pescado",
    tags: ["sin_gluten"],
    allergens: ["pescado"],
    nutrientsPer100g: n({ calories: 208, protein: 20, carbs: 0, fat: 13, vitaminD: 10, vitaminB12: 3.2, vitaminE: 2, iron: 0.8, zinc: 0.6, magnesium: 27 }),
    supermarkets: [product("Mercadona", "Pescaderia", 5.8, 300, "alta", "https://tienda.mercadona.es/product/87204/filete-salmon-bandeja"), product("Consum", "Pescaderia", 6.15, 300)],
    alternativeIds: ["sardines", "chicken"]
  },
  {
    id: "sardines",
    name: "Sardinas en conserva",
    category: "pescado",
    tags: ["sin_gluten"],
    allergens: ["pescado"],
    nutrientsPer100g: n({ calories: 208, protein: 24.6, carbs: 0, fat: 11.5, vitaminD: 4.8, vitaminB12: 8.9, calcium: 382, iron: 2.9, zinc: 1.3, magnesium: 39 }),
    supermarkets: [product("Mercadona", "Conservas de pescado", 2.3, 120, "alta", "https://tienda.mercadona.es/product/18252/sardinas-aceite-oliva-hacendado-pack-2"), product("Consum", "Conservas de pescado", 2.45, 120)],
    alternativeIds: ["salmon", "chicken"]
  },
  {
    id: "tofu",
    name: "Tofu firme enriquecido con calcio",
    category: "proteinas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: ["soja"],
    nutrientsPer100g: n({ calories: 144, protein: 17.3, carbs: 3.2, fat: 8.7, calcium: 350, iron: 2.7, zinc: 1.4, magnesium: 30 }),
    supermarkets: [product("Mercadona", "Refrigerados veganos", 2.2, 250, "alta", "https://tienda.mercadona.es/product/51097/tofu-firme-frias-paquete"), product("Consum", "Vegetal refrigerado", 2.35, 250)],
    alternativeIds: ["chickpeas", "egg"]
  },
  {
    id: "chicken",
    name: "Pechuga de pollo",
    category: "carnes",
    tags: ["sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 165, protein: 31, carbs: 0, fat: 3.6, vitaminB12: 0.3, iron: 1, zinc: 1, magnesium: 29 }),
    supermarkets: [product("Mercadona", "Aves", 4.25, 400, "alta", "https://tienda.mercadona.es/product/8667/pechuga-pollo-92-hacendado-lonchas-paquete"), product("Consum", "Carniceria", 4.45, 400)],
    alternativeIds: ["turkey", "tofu"]
  },
  {
    id: "turkey",
    name: "Pavo loncheado bajo en sal",
    category: "carnes",
    tags: ["sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 104, protein: 17, carbs: 2, fat: 2, vitaminB12: 0.8, zinc: 1.2, iron: 1 }),
    supermarkets: [product("Mercadona", "Charcuteria", 2.15, 200, "alta", "https://tienda.mercadona.es/product/60243/pechuga-pavo-bajo-sal-hacendado-finas-lonchas-paquete"), product("Consum", "Charcuteria", 2.25, 200)],
    alternativeIds: ["chicken", "tofu"]
  },
  {
    id: "sweet_potato",
    name: "Boniato",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, fiber: 3, vitaminA: 709, vitaminC: 2.4, magnesium: 25 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.85, 1000, "alta", "https://tienda.mercadona.es/product/69239/batata-pieza"), product("Consum", "Frutas y verduras", 1.95, 1000)],
    alternativeIds: ["pumpkin", "carrot"]
  },
  {
    id: "carrot",
    name: "Zanahoria",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, vitaminA: 835, vitaminC: 5.9, vitaminK: 13.2, magnesium: 12 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.15, 1000, "alta", "https://tienda.mercadona.es/product/69586/zanahorias-paquete"), product("Consum", "Frutas y verduras", 1.25, 1000)],
    alternativeIds: ["pumpkin", "sweet_potato"]
  },
  {
    id: "hummus",
    name: "Hummus clasico",
    category: "refrigerados",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: ["sesamo"],
    nutrientsPer100g: n({ calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6, fiber: 6, iron: 2.4, calcium: 49, magnesium: 29 }),
    supermarkets: [product("Mercadona", "Refrigerados", 1.55, 240, "alta", "https://tienda.mercadona.es/product/80858/hummus-garbanzos-hacendado-receta-clasica-tarrina"), product("Consum", "Refrigerados", 1.65, 240)],
    alternativeIds: ["chickpeas", "tofu"]
  },
  {
    id: "olive_oil",
    name: "Aceite de oliva virgen extra",
    category: "aceites",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 884, fat: 100, vitaminE: 14, vitaminK: 60 }),
    supermarkets: [product("Mercadona", "Aceites", 4.95, 1000, "alta", "https://tienda.mercadona.es/product/4740/aceite-oliva-virgen-extra-hacendado-botella")],
    alternativeIds: ["avocado"]
  },
  {
    id: "tomato",
    name: "Tomate",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, vitaminA: 42, vitaminC: 14, vitaminK: 7.9 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.85, 1000, "alta", "https://tienda.mercadona.es/product/69971/tomates-malla"), product("Consum", "Frutas y verduras", 1.95, 1000)],
    alternativeIds: ["pumpkin"]
  },
  {
    id: "uv_mushrooms",
    name: "Champinones expuestos a UV",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, vitaminD: 10, vitaminB12: 0, magnesium: 9 }),
    supermarkets: [product("Mercadona", "Setas y verduras", 2.15, 300, "alta", "https://tienda.mercadona.es/product/69519/champinon-laminado-limpio-bandeja"), product("Consum", "Setas y verduras", 2.25, 300)],
    alternativeIds: ["broccoli", "spinach"]
  },
  {
    id: "nutritional_yeast",
    name: "Levadura nutricional fortificada",
    category: "dieteticos",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 325, protein: 45, carbs: 35, fat: 5, fiber: 20, vitaminB12: 17, zinc: 7, iron: 5, magnesium: 180 }),
    supermarkets: [product("Mercadona", "Dieteticos", 3.45, 150, "media", "https://tienda.mercadona.es/product/35517/levadura-nutricional-copos-deliplus-paquete"), product("Consum", "Dieteticos", 3.7, 150, "media")],
    alternativeIds: ["soy_milk"]
  },
  {
    id: "pumpkin",
    name: "Calabaza",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, vitaminA: 426, vitaminC: 9, vitaminE: 1.1, magnesium: 12 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 1.6, 1000, "alta", "https://tienda.mercadona.es/product/69853/media-calabaza-cacahuete-12-pieza"), product("Consum", "Frutas y verduras", 1.7, 1000)],
    alternativeIds: ["sweet_potato", "carrot"]
  },
  {
    id: "whole_pasta",
    name: "Pasta integral",
    category: "pastas",
    tags: ["vegetariano"],
    allergens: ["gluten"],
    nutrientsPer100g: n({ calories: 348, protein: 13, carbs: 67, fat: 2.5, fiber: 8, iron: 3.6, magnesium: 85, zinc: 1.8 }),
    supermarkets: [product("Mercadona", "Pastas", 1.25, 500, "alta", "https://tienda.mercadona.es/product/35777/pasta-penne-integral-hacendado-paquete"), product("Consum", "Pastas", 1.35, 500)],
    alternativeIds: ["gluten_free_pasta"]
  },
  {
    id: "gluten_free_bread",
    name: "Pan sin gluten",
    category: "pan",
    tags: ["vegetariano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 265, protein: 8, carbs: 52, fat: 3, fiber: 3 }),
    supermarkets: [product("Mercadona", "Especialidades sin gluten", 2.85, 300, "alta", "https://tienda.mercadona.es/product/82735/hogaza-sin-gluten-cortada-paquete"), product("Consum", "Especialidades sin gluten", 2.45, 400)],
    alternativeIds: ["whole_pasta", "brown_rice"]
  },
  // NUEVOS ALIMENTOS PARA RECETAS SIMPLES
  {
    id: "milk",
    name: "Leche",
    category: "lacteos",
    tags: ["vegetariano"],
    allergens: ["lactosa"],
    nutrientsPer100g: n({ calories: 42, protein: 3.4, carbs: 5, fat: 1, calcium: 125, vitaminB12: 0.5 }),
    supermarkets: [product("Mercadona", "Refrigerados", 0.84, 1000, "alta", "https://tienda.mercadona.es/product/10382/leche-semidesnatada-hacendado-brick"), product("Consum", "Leche y derivados", 1.25, 1000)],
    alternativeIds: ["soy_milk"]
  },
  {
    id: "cocoa_powder",
    name: "Cacao en polvo",
    category: "desayunos",
    tags: ["vegetariano", "vegano"],
    allergens: [],
    nutrientsPer100g: n({ calories: 228, protein: 20, carbs: 58, fat: 14, iron: 13.9, magnesium: 228 }),
    supermarkets: [product("Mercadona", "Cereales y desayuno", 2.45, 200, "alta", "https://tienda.mercadona.es/product/22580/cacao-puro-polvo-chocolatera-0-azucares-anadidos-bote"), product("Consum", "Cacao y chocolates", 2.65, 200)],
    alternativeIds: []
  },
  {
    id: "cookies",
    name: "Galletas",
    category: "desayunos",
    tags: ["vegetariano"],
    allergens: ["gluten", "huevo"],
    nutrientsPer100g: n({ calories: 484, protein: 7, carbs: 64, fat: 23, fiber: 2, iron: 3 }),
    supermarkets: [product("Mercadona", "Galletas", 1.35, 800, "alta", "https://tienda.mercadona.es/product/14132/galletas-maria-dorada-hacendado-paquete"), product("Consum", "Galletas", 1.7, 400)],
    alternativeIds: ["cereals"]
  },
  {
    id: "mermelada",
    name: "Mermelada",
    category: "desayunos",
    tags: ["vegetariano", "vegano"],
    allergens: [],
    nutrientsPer100g: n({ calories: 278, protein: 0.4, carbs: 69, fat: 0.1, fiber: 1, iron: 1.6 }),
    supermarkets: [product("Mercadona", "Mermeladas y confituras", 1.85, 350, "alta", "https://tienda.mercadona.es/product/15091/mermelada-fresa-hacendado-tarro"), product("Consum", "Mermeladas", 2.05, 350)],
    alternativeIds: ["honey"]
  },
  {
    id: "butter",
    name: "Mantequilla",
    category: "lacteos",
    tags: ["vegetariano"],
    allergens: ["lactosa"],
    nutrientsPer100g: n({ calories: 717, protein: 0.9, carbs: 0.1, fat: 81, vitaminA: 684 }),
    supermarkets: [product("Mercadona", "Refrigerados", 2.25, 250, "alta", "https://tienda.mercadona.es/product/20716/mantequilla-sin-sal-anadida-hacendado-pastilla"), product("Consum", "Mantequilla y margarina", 2.45, 250)],
    alternativeIds: ["olive_oil"]
  },
  {
    id: "cereals",
    name: "Cereales de desayuno",
    category: "cereales",
    tags: ["vegetariano"],
    allergens: ["gluten"],
    nutrientsPer100g: n({ calories: 379, protein: 7, carbs: 84, fat: 1.8, fiber: 7, iron: 14 }),
    supermarkets: [product("Mercadona", "Cereales y desayuno", 2.15, 375, "alta", "https://tienda.mercadona.es/product/9362/cereales-copos-maiz-corn-flakes-hacendado-caja"), product("Consum", "Cereales", 2.35, 375)],
    alternativeIds: ["oats"]
  },
  {
    id: "apple",
    name: "Manzana",
    category: "frutas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, vitaminC: 4.6 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 2.25, 1000, "alta", "https://tienda.mercadona.es/product/3028/manzana-golden-pieza"), product("Consum", "Frutas", 2.45, 1000)],
    alternativeIds: ["banana", "orange"]
  },
  {
    id: "flour",
    name: "Harina",
    category: "cereales",
    tags: ["vegetariano", "vegano"],
    allergens: ["gluten"],
    nutrientsPer100g: n({ calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7, iron: 4.6 }),
    supermarkets: [product("Mercadona", "Harinas", 0.85, 1000, "alta", "https://tienda.mercadona.es/product/29100/harina-trigo-hacendado-paquete"), product("Consum", "Harinas", 0.95, 1000)],
    alternativeIds: ["oats"]
  },
  {
    id: "honey",
    name: "Miel",
    category: "dulces",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 304, protein: 0.3, carbs: 82, fat: 0, iron: 0.4 }),
    supermarkets: [product("Mercadona", "Miel y derivados", 3.45, 500, "alta", "https://tienda.mercadona.es/product/15430/miel-flores-hacendado-bote"), product("Consum", "Miel", 3.65, 500)],
    alternativeIds: ["mermelada"]
  },
  {
    id: "tomato_sauce",
    name: "Salsa de tomate",
    category: "salsas",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 32, protein: 1.3, carbs: 6.5, fat: 0.3, fiber: 1.5, vitaminC: 7 }),
    supermarkets: [product("Mercadona", "Salsas", 1.15, 390, "alta", "https://tienda.mercadona.es/product/52859/salsa-tomate-con-albahaca-hacendado-tarro"), product("Consum", "Salsas", 1.25, 390)],
    alternativeIds: ["tomato"]
  },
  {
    id: "potato",
    name: "Patata",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2 }),
    supermarkets: [product("Mercadona", "Patatas", 1.35, 1500, "alta", "https://tienda.mercadona.es/product/69555/patatas-bag-malla")],
    alternativeIds: ["sweet_potato"]
  },
  {
    id: "ham",
    name: "Jamon cocido",
    category: "carnes",
    tags: [],
    allergens: [],
    nutrientsPer100g: n({ calories: 96, protein: 17, carbs: 1.5, fat: 2.5, vitaminB12: 1, iron: 1.2 }),
    supermarkets: [product("Mercadona", "Charcuteria", 3.85, 200, "alta", "https://tienda.mercadona.es/product/59256/jamon-cocido-hacendado-lonchas-paquete"), product("Consum", "Jamon cocido", 4.15, 200)],
    alternativeIds: ["chicken"]
  },
  {
    id: "cheese",
    name: "Queso fundido",
    category: "lacteos",
    tags: ["vegetariano"],
    allergens: ["lactosa", "leche"],
    nutrientsPer100g: n({ calories: 300, protein: 17, carbs: 3, fat: 24, calcium: 500, vitaminB12: 1.5 }),
    supermarkets: [product("Mercadona", "Quesos", 2.65, 200, "alta", "https://tienda.mercadona.es/product/50371/queso-lonchas-fundido-sandwich-mezcla-hacendado-paquete"), product("Consum", "Quesos", 2.85, 200)],
    alternativeIds: []
  },
  {
    id: "lettuce",
    name: "Lechuga",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, vitaminA: 370, vitaminC: 18 }),
    supermarkets: [product("Mercadona", "Verduras refrigeradas", 1.45, 300, "alta", "https://tienda.mercadona.es/product/69670/lechuga-iceberg-paquete"), product("Consum", "Lechugas", 1.55, 300)],
    alternativeIds: ["spinach"]
  },
  {
    id: "chocolate",
    name: "Chocolate con leche",
    category: "dulces",
    tags: ["vegetariano"],
    allergens: ["leche", "gluten"],
    nutrientsPer100g: n({ calories: 535, protein: 8, carbs: 59, fat: 30, iron: 2 }),
    supermarkets: [product("Mercadona", "Chocolate", 1.85, 200, "alta", "https://tienda.mercadona.es/product/80517/chocolate-con-leche-classic-hacendado-tableta"), product("Consum", "Chocolates", 2.05, 200)],
    alternativeIds: []
  },
  {
    id: "condensed_milk",
    name: "Leche condensada",
    category: "dulces",
    tags: ["vegetariano"],
    allergens: ["leche"],
    nutrientsPer100g: n({ calories: 321, protein: 8, carbs: 54, fat: 8, calcium: 284 }),
    supermarkets: [product("Mercadona", "Leche condensada", 1.65, 250, "alta", "https://tienda.mercadona.es/product/60347/leche-condensada-hacendado-bote"), product("Consum", "Leche condensada", 1.85, 250)],
    alternativeIds: ["honey"]
  },
  {
    id: "cereals_bar",
    name: "Barrita de cereales",
    category: "snacks",
    tags: ["vegetariano"],
    allergens: ["gluten", "frutos secos"],
    nutrientsPer100g: n({ calories: 400, protein: 6, carbs: 70, fat: 10, fiber: 4, iron: 5 }),
    supermarkets: [product("Mercadona", "Barritas", 1.45, 120, "alta", "https://tienda.mercadona.es/product/9350/barritas-cereales-hacendado-chocolate-con-leche-caja"), product("Consum", "Barritas", 1.65, 120)],
    alternativeIds: ["cookies"]
  },
  {
    id: "onion",
    name: "Cebolla",
    category: "verduras",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, vitaminC: 7.4 }),
    supermarkets: [product("Mercadona", "Frutas y verduras", 0.95, 1000, "alta", "https://tienda.mercadona.es/product/69079/cebollas-malla"), product("Consum", "Verduras", 1.05, 1000)],
    alternativeIds: ["carrot"]
  },
  {
    id: "fish",
    name: "Pescado blanco",
    category: "pescado",
    tags: ["sin_gluten"],
    allergens: ["pescado"],
    nutrientsPer100g: n({ calories: 86, protein: 18.5, carbs: 0, fat: 1, vitaminB12: 2, vitaminD: 1 }),
    supermarkets: [product("Mercadona", "Pescaderia", 5.45, 400, "alta", "https://tienda.mercadona.es/product/62228/filetes-merluza-cabo-sin-piel-hacendado-ultracongelados-paquete"), product("Consum", "Pescado fresco", 5.85, 400)],
    alternativeIds: ["chicken", "egg"]
  },
  {
    id: "rice",
    name: "Arroz blanco",
    category: "cereales",
    tags: ["vegetariano", "vegano", "sin_gluten"],
    allergens: [],
    nutrientsPer100g: n({ calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, iron: 0.2 }),
    supermarkets: [product("Mercadona", "Arroces", 1.25, 1000, "alta", "https://tienda.mercadona.es/product/5063/arroz-largo-hacendado-paquete"), product("Consum", "Arroces", 1.35, 1000)],
    alternativeIds: ["brown_rice", "whole_pasta"]
  },
  {
    id: "bacon",
    name: "Bacon",
    category: "carnes",
    tags: [],
    allergens: [],
    nutrientsPer100g: n({ calories: 541, protein: 37, carbs: 1.4, fat: 42, vitaminB12: 1.1, iron: 1.4 }),
    supermarkets: [product("Mercadona", "Charcuteria", 3.45, 200, "alta", "https://tienda.mercadona.es/product/7791/bacon-hacendado-cintas-pack-2"), product("Consum", "Bacon", 3.65, 200)],
    alternativeIds: ["ham"]
  },
  {
    id: "pasta",
    name: "Fideos",
    category: "pastas",
    tags: ["vegetariano"],
    allergens: ["gluten"],
    nutrientsPer100g: n({ calories: 370, protein: 13, carbs: 75, fat: 1.5, fiber: 3, iron: 4 }),
    supermarkets: [product("Mercadona", "Pastas", 0.95, 500, "alta", "https://tienda.mercadona.es/product/13577/fideo-cabello-angel-hacendado-paquete"), product("Consum", "Pastas", 1.05, 500)],
    alternativeIds: ["rice"]
  }
];

export const foodMap = Object.fromEntries(foods.map((food) => [food.id, food])) as Record<string, FoodItem>;

const round = (value: number) => Math.round(value * 100) / 100;

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const shorten = (value: string, maxLength: number) =>
  value.length <= maxLength ? value : `${value.slice(0, maxLength - 1).trimEnd()}...`;

const recipeVideoIds: Partial<Record<string, string>> = {
  "breakfast-oats": "iplL0Zw2BcU",
  "breakfast-toast": "qxqJNRNrOvo",
  "breakfast-smoothie": "S1dqNEi38UU",
  "breakfast-chia": "muee5181ljs",
  "snack-fruit-nuts": "Gm7HVLr93e4",
  "snack-hummus": "UUXq_zjm_c4",
  "snack-yogurt": "o3SxDMZTuKs",
  "lunch-lentils": "qqTPr6Hsrd8",
  "lunch-salmon": "bfQ14YiZolY",
  "lunch-quinoa": "oCQUGFbyJ-k",
  "lunch-chicken": "XVE2Agj0WG8",
  "lunch-pasta": "77K7PO2QU2k",
  "snack-toast": "StGLwtRSn9E",
  "snack-smoothie": "0GqoDZStyS0",
  "snack-yogurt-afternoon": "kp9k9Ty1gQw",
  "dinner-tortilla": "GtKa_-X-eoo",
  "dinner-tofu": "FRTqQ2zJRUU",
  "dinner-sardines": "QXa4Twl_xWw",
  "dinner-cream": "W3Gk_o9Tc-A"
};

const buildRecipeCardSvg = (title: string, subtitle: string, accentKey: MealType) => {
  const palette: Record<MealType, [string, string]> = {
    desayuno: ["#0f766e", "#2dd4bf"],
    media_manana: ["#2563eb", "#60a5fa"],
    comida: ["#ea580c", "#fb923c"],
    merienda: ["#7c3aed", "#a78bfa"],
    cena: ["#1d4ed8", "#38bdf8"]
  };
  const [primary, secondary] = palette[accentKey];

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${secondary}" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" rx="36" fill="url(#g)" />
      <circle cx="1140" cy="140" r="88" fill="rgba(255,255,255,0.16)" />
      <circle cx="180" cy="620" r="132" fill="rgba(255,255,255,0.12)" />
      <rect x="84" y="96" width="1112" height="528" rx="32" fill="rgba(255,255,255,0.12)" />
      <text x="126" y="250" font-size="60" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${shorten(title, 32)}</text>
      <text x="126" y="332" font-size="30" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.92)">${shorten(
        subtitle,
        56
      )}</text>
      <text x="126" y="564" font-size="25" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.82)">Planificador Saludable · Paso visual</text>
    </svg>
  `);
};

const getIngredientFractionalCost = (foodId: string, grams: number) => {
  const food = foodMap[foodId];
  const cheapestProduct = [...food.supermarkets].sort(
    (left, right) => left.price / left.packSizeGrams - right.price / right.packSizeGrams
  )[0];

  return round((cheapestProduct.price / cheapestProduct.packSizeGrams) * grams);
};

const buildBudgetInsight = (ingredients: Array<[string, number]>, servings: number): RecipeBudgetInsight => {
  const estimatedCost = round(ingredients.reduce((sum, [foodId, grams]) => sum + getIngredientFractionalCost(foodId, grams), 0));
  const costPerServing = round(estimatedCost / servings);
  const expensiveAlternatives = ingredients
    .filter(([foodId, grams]) => getIngredientFractionalCost(foodId, grams) >= 1.6)
    .flatMap(([foodId]) => foodMap[foodId].alternativeIds.map((id) => foodMap[id]?.name).filter(Boolean))
    .slice(0, 4);

  return {
    estimatedCost,
    costPerServing,
    recommendedForBudget: costPerServing <= 3.5,
    monthlyFriendly: costPerServing * 30 <= 250,
    expensiveAlternatives
  };
};

const buildGallery = (id: string, title: string, mealType: MealType, steps: string[]): RecipeStepMedia[] =>
  steps.slice(0, 6).map((step, index) => ({
    id: `${id}-step-${index + 1}`,
    title: `Paso ${index + 1}`,
    image: buildRecipeCardSvg(title, `Paso ${index + 1}: ${step}`, mealType),
    alt: `Ilustracion del paso ${index + 1} para ${title}`
  }));

const buildVideoConfig = (id: string, title: string, mealType: MealType, steps: string[]): RecipeVideoConfig => ({
  searchQuery: `${title} receta saludable facil`,
  youtubeVideoId: recipeVideoIds[id],
  fallbackImage: buildRecipeCardSvg(title, "Video no disponible ahora. Sigue la version paso a paso.", mealType),
  transcript: steps.map((step, index) => `Paso ${index + 1}. ${step}`)
});

const recipe = (
  id: string,
  title: string,
  mealType: MealType,
  preparationMinutes: number,
  tags: string[],
  ingredients: Array<[string, number]>,
  steps: string[],
  cuisine = "mediterranea"
): Recipe => {
  const budget = buildBudgetInsight(ingredients, 1);
  const gallery = buildGallery(id, title, mealType, steps);

  return {
    id,
    title,
    mealType,
    servings: 1,
    difficulty: preparationMinutes <= 15 ? "facil" : "media",
    preparationMinutes,
    tags: [...tags, ...(budget.recommendedForBudget ? ["economica"] : [])],
    cuisine,
    summary: `${title} lista en ${preparationMinutes} minutos, con ${ingredients.length} ingredientes principales y enfoque economico.`,
    steps,
    ingredients: ingredients.map(([foodId, grams]) => ({ foodId, grams })),
    gallery,
    video: buildVideoConfig(id, title, mealType, steps),
    budget
  };
};

export const recipes: Recipe[] = [
  // DESAYUNOS - abundantes
  recipe(
    "breakfast-milk",
    "Leche con cacao, galletas y platano",
    "desayuno",
    3,
    ["vegetariano"],
    [["milk", 400], ["cocoa_powder", 15], ["cookies", 60], ["banana", 150]],
    [
      "Calienta la leche un poco (no hace falta hervir).",
      "Anade el cacao en polvo y mezcla bien.",
      "Sirve con galletas y rodajas de platano."
    ]
  ),
  recipe(
    "breakfast-yogurt",
    "Yogur griego con miel, platano y galletas",
    "desayuno",
    3,
    ["vegetariano", "sin_gluten"],
    [["greek_yogurt", 350], ["honey", 30], ["banana", 150], ["cookies", 40]],
    [
      "Sirve el yogur griego en un bol grande.",
      "Anade miel al gusto.",
      "Añade rodajas de platano y galletas."
    ]
  ),
  recipe(
    "breakfast-pan-mermelada",
    "Pan con mermelada, mantequilla y chocolate",
    "desayuno",
    5,
    ["vegetariano"],
    [["whole_bread", 120], ["mermelada", 50], ["butter", 20], ["chocolate", 30]],
    [
      "Tuesta el pan.",
      "Unta la mantequilla.",
      "Añade mermelada y chocolate por encima."
    ]
  ),
  recipe(
    "breakfast-cereales",
    "Cereales con leche, platano y galletas",
    "desayuno",
    3,
    ["vegetariano"],
    [["cereals", 100], ["milk", 300], ["banana", 150], ["cookies", 40]],
    [
      "Vierte los cereales en un bol grande.",
      "Anade la leche fria.",
      "Añade rodajas de platano y galletas."
    ]
  ),
  recipe(
    "breakfast-tostada-huevo",
    "Tostadas con huevo frito y bacon",
    "desayuno",
    10,
    ["vegetariano"],
    [["whole_bread", 120], ["egg", 200], ["bacon", 80], ["cheese", 40], ["olive_oil", 10]],
    [
      "Tuesta las rebanadas de pan.",
      "Frie los huevos con el bacon en un poco de aceite.",
      "Coloca el huevo y el bacon sobre las tostadas y añade queso."
    ]
  ),
  recipe(
    "breakfast-panqueques",
    "Panqueques con miel y mantequilla",
    "desayuno",
    15,
    ["vegetariano"],
    [["flour", 150], ["egg", 200], ["milk", 300], ["honey", 40], ["butter", 30]],
    [
      "Mezcla harina, huevo y leche hasta obtener una masa fluida.",
      "Cocina pequeñas tortillas en una sarten con mantequilla.",
      "Sirve con miel y mantequilla por encima."
    ]
  ),
  recipe(
    "breakfast-fruta",
    "Fruta variada con frutos secos y miel",
    "desayuno",
    2,
    ["vegetariano", "vegano", "sin_gluten"],
    [["apple", 200], ["banana", 150], ["orange", 200], ["almonds", 40], ["honey", 30]],
    [
      "Lava y pela la fruta.",
      "Cortala en trozos.",
      "Añade almendras y miel."
    ]
  ),
  recipe(
    "breakfast-avena",
    "Avena cocida con leche, miel y frutas",
    "desayuno",
    10,
    ["vegetariano", "vegano"],
    [["oats", 120], ["milk", 400], ["honey", 30], ["banana", 150], ["apple", 100]],
    [
      "Hierve la avena con la leche a fuego lento 8 minutos.",
      "Retira del fuego y deja reposar 2 minutos.",
      "Sirve con miel, rodajas de platano y manzana."
    ]
  ),
  recipe(
    "breakfast-tortilla",
    "Tortilla con pan y queso",
    "desayuno",
    10,
    ["vegetariano"],
    [["egg", 250], ["whole_bread", 100], ["cheese", 60], ["butter", 15]],
    [
      "Bate los huevos y cocina la tortilla.",
      "Tuesta el pan con mantequilla.",
      "Sirve la tortilla con el pan y el queso."
    ]
  ),

  // SNACKS / MEDIA MAÑANA - mas abundantes
  recipe(
    "snack-yogurt",
    "Yogur con frutas y galletas",
    "media_manana",
    2,
    ["vegetariano", "sin_gluten"],
    [["greek_yogurt", 250], ["banana", 150], ["cookies", 50]],
    [
      "Sirve el yogur en un bol.",
      "Añade plátano troceado y galletas."
    ]
  ),
  recipe(
    "snack-fruta",
    "Fruta fresca con frutos secos",
    "media_manana",
    1,
    ["vegetariano", "vegano", "sin_gluten"],
    [["apple", 200], ["banana", 150], ["almonds", 40]],
    [
      "Lava la manzana y el plátano.",
      "Come con las almendras."
    ]
  ),
  recipe(
    "snack-galletas",
    "Galletas con leche",
    "media_manana",
    2,
    ["vegetariano"],
    [["cookies", 80], ["milk", 300]],
    [
      "Come las galletas.",
      "Bebe la leche."
    ]
  ),
  recipe(
    "snack-barrita",
    "Barrita de cereales con fruta",
    "media_manana",
    1,
    ["vegetariano"],
    [["cereals_bar", 60], ["banana", 120]],
    [
      "Come la barrita.",
      "Añade una fruta."
    ]
  ),

  // COMIDAS - abundantes y completas
  recipe(
    "lunch-pasta-tomate",
    "Pasta grande con salsa de tomate y queso",
    "comida",
    20,
    ["vegetariano"],
    [["whole_pasta", 200], ["tomato_sauce", 300], ["cheese", 80], ["olive_oil", 15]],
    [
      "Cuece la pasta según instrucciones.",
      "Calienta la salsa de tomate.",
      "Mezcla la pasta con la salsa, añade queso y aceite."
    ]
  ),
  recipe(
    "lunch-arroz-pollo",
    "Arroz con pollo, huevo y verduras",
    "comida",
    25,
    [],
    [["rice", 200], ["chicken", 250], ["egg", 100], ["carrot", 120], ["olive_oil", 15]],
    [
      "Cuece el arroz.",
      "Saltea el pollo con la zanahoria.",
      "Añade el huevo frito y mezcla todo."
    ]
  ),
  recipe(
    "lunch-lentejas",
    "Lentejas abundantes con arroz y huevo",
    "comida",
    30,
    ["vegetariano", "vegano", "sin_gluten"],
    [["lentils", 300], ["rice", 180], ["egg", 100], ["carrot", 100], ["olive_oil", 15]],
    [
      "Cocina las lentejas hasta que estén tiernas.",
      "Cuece el arroz por separado.",
      "Sirve las lentejas sobre el arroz con huevo."
    ]
  ),
  recipe(
    "lunch-ensalada",
    "Ensalada completa con pollo y queso",
    "comida",
    15,
    [],
    [["lettuce", 150], ["tomato", 150], ["chicken", 200], ["cheese", 60], ["egg", 100], ["olive_oil", 15]],
    [
      "Lava y corta las verduras.",
      "Añade el pollo en trozos, el queso y el huevo.",
      "Aliña con aceite y vinagre."
    ]
  ),
  recipe(
    "lunch-pasta-pollo",
    "Pasta con pollo abundante y salsa",
    "comida",
    20,
    [],
    [["whole_pasta", 200], ["chicken", 250], ["tomato_sauce", 250], ["cheese", 60], ["olive_oil", 12]],
    [
      "Cuece la pasta.",
      "Saltea el pollo y añade la salsa.",
      "Mezcla todo junto con queso."
    ]
  ),
  recipe(
    "lunch-huevos-patatas",
    "Huevos abundantes con patatas fritas",
    "comida",
    25,
    ["vegetariano"],
    [["egg", 250], ["potato", 350], ["olive_oil", 25]],
    [
      "Fríe las patatas en rodajas.",
      "Fríe los huevos.",
      "Sirve juntos."
    ]
  ),
  recipe(
    "lunch-sandwich",
    "Sandwich triple de jamón, queso y huevo",
    "comida",
    10,
    [],
    [["whole_bread", 180], ["ham", 100], ["cheese", 80], ["egg", 100], ["tomato", 80], ["butter", 15]],
    [
      "Tosta el pan con mantequilla.",
      "Coloca el jamón, el queso y el huevo.",
      "Añade tomate y cierra el sandwich."
    ]
  ),
  recipe(
    "lunch-pizza",
    "Pizza casera rápida",
    "comida",
    20,
    ["vegetariano"],
    [["flour", 150], ["tomato_sauce", 200], ["cheese", 120], ["ham", 100], ["olive_oil", 10]],
    [
      "Estira la masa de harina con agua y aceite.",
      "Añade salsa de tomate, queso y jamón.",
      "Hornea a 200C durante 15 minutos."
    ]
  ),
  recipe(
    "lunch-arroz-frito",
    "Arroz frito con huevo y verduras",
    "comida",
    15,
    ["vegetariano", "sin_gluten"],
    [["rice", 250], ["egg", 150], ["carrot", 100], ["olive_oil", 20]],
    [
      "Cocina el arroz y déjalo enfriar.",
      "Saltea las verduras con el arroz.",
      "Añade el huevo frito y mezcla todo."
    ]
  ),
  recipe(
    "lunch-wrap",
    "Wrap de pollo y queso",
    "comida",
    10,
    [],
    [["whole_bread", 150], ["chicken", 200], ["cheese", 80], ["lettuce", 80]],
    [
      "Tuesta la tortilla o pan.",
      "Añade el pollo, queso y lechuga.",
      "Enrolla y sirve."
    ]
  ),
  recipe(
    "lunch-menestra",
    "Menestra de verduras con arroz",
    "comida",
    20,
    ["vegetariano", "vegano", "sin_gluten"],
    [["rice", 200], ["broccoli", 150], ["potato", 200], ["carrot", 100], ["olive_oil", 15]],
    [
      "Cocina las verduras con la patata.",
      "Añade agua y cocina 15 minutos.",
      "Sirve con arroz."
    ]
  ),
  recipe(
    "lunch-guiso-lentejas",
    "Guiso de lentejas con batata",
    "comida",
    20,
    ["vegetariano", "vegano", "sin_gluten"],
    [["lentils", 300], ["sweet_potato", 200], ["onion", 100], ["tomato", 80], ["olive_oil", 15]],
    [
      "Sofríe la cebolla y añade las lentejas.",
      "Añade agua y cocina 15 minutos.",
      "Añade la batata en dados y cocina."
    ]
  ),
  recipe(
    "lunch-quinoa-ensalada",
    "Ensalada de quinoa con pollo",
    "comida",
    15,
    ["sin_gluten"],
    [["quinoa", 200], ["chicken", 250], ["lettuce", 150], ["tomato", 100], ["olive_oil", 15]],
    [
      "Cocina la quinoa y déjala enfriar.",
      "Cocina el pollo a la plancha.",
      "Mezcla todo con lechuga y tomate, aliña."
    ]
  ),
  recipe(
    "lunch-sopa-fideos",
    "Sopa de fideos con pollo",
    "comida",
    20,
    [],
    [["pasta", 120], ["chicken", 200], ["onion", 100], ["carrot", 80], ["olive_oil", 10]],
    [
      "Hierve el pollo y Reserva el caldo.",
      "Cocina los fideos en el caldo.",
      "Sirve con el pollo troceado."
    ]
  ),
  recipe(
    "lunch-boniato-pollo",
    "Batata asada con pollo y ensalada",
    "comida",
    20,
    ["sin_gluten"],
    [["sweet_potato", 300], ["chicken", 250], ["lettuce", 150], ["olive_oil", 15]],
    [
      "Asa la batata en dados.",
      "Cocina el pollo a la plancha.",
      "Sirve con ensalada y aceite."
    ]
  ),

  // MERIENDAS - algo dulce y abundante
  recipe(
    "snack-merienda-yogurt",
    "Yogur con miel y galletas",
    "merienda",
    2,
    ["vegetariano", "sin_gluten"],
    [["greek_yogurt", 250], ["honey", 30], ["cookies", 50]],
    [
      "Sirve el yogur.",
      "Añade un poco de miel.",
      "Come con galletas."
    ]
  ),
  recipe(
    "snack-arroz-leche",
    "Arroz con leche condensada",
    "merienda",
    5,
    ["vegetariano"],
    [["rice", 150], ["condensed_milk", 80], ["milk", 200]],
    [
      "Cuece el arroz y déjalo enfriar.",
      "Sirve con leche condensada y un poco de leche."
    ]
  ),
  recipe(
    "snack-fruta-chocolate",
    "Fruta con chocolate y galletas",
    "merienda",
    5,
    ["vegetariano", "sin_gluten"],
    [["banana", 200], ["chocolate", 50], ["cookies", 40]],
    [
      "Pela el plátano.",
      "Derrites el chocolate y baña el plátano.",
      "Come con galletas."
    ]
  ),
  recipe(
    "snack-galletas-leche",
    "Galletas abundantes con leche",
    "merienda",
    3,
    ["vegetariano"],
    [["cookies", 100], ["milk", 400]],
    [
      "Vierte la leche en un vaso grande.",
      "Come las galletas mojando en la leche."
    ]
  ),
  recipe(
    "snack-yogur-fruta",
    "Yogur con fruta y miel",
    "merienda",
    2,
    ["vegetariano", "sin_gluten"],
    [["greek_yogurt", 250], ["banana", 150], ["honey", 30]],
    [
      "Sirve el yogur en un bol.",
      "Añade el plátano troceado.",
      "Riega con miel."
    ]
  ),
  recipe(
    "snack-tostada-mermelada",
    "Tostada con mermelada y mantequilla",
    "merienda",
    3,
    ["vegetariano"],
    [["whole_bread", 120], ["mermelada", 40], ["butter", 15]],
    [
      "Tosta el pan.",
      "Unta con mantequilla.",
      "Añade mermelada por encima."
    ]
  ),
  recipe(
    "snack-barrita-leche",
    "Barrita de cereales con leche",
    "merienda",
    2,
    ["vegetariano"],
    [["cereals_bar", 80], ["milk", 300]],
    [
      "Sirve la leche en un vaso.",
      "Come las barritas junto con la leche."
    ]
  ),
  recipe(
    "snack-fruta-seca",
    "Fruta fresca con frutos secos",
    "merienda",
    1,
    ["vegetariano", "vegano", "sin_gluten"],
    [["apple", 200], ["banana", 150], ["almonds", 40]],
    [
      "Lava y pela la fruta.",
      "Come con las almendras."
    ]
  ),
  recipe(
    "snack-cereales-leche",
    "Cereales con leche",
    "merienda",
    2,
    ["vegetariano"],
    [["cereals", 80], ["milk", 300]],
    [
      "Vierte los cereales en un bowl.",
      "Añade la leche fría.",
      "Come directamente."
    ]
  ),
  recipe(
    "snack-chocolate-leche",
    "Chocolate con leche",
    "merienda",
    2,
    ["vegetariano"],
    [["chocolate", 50], ["milk", 300]],
    [
      "Derrites el chocolate en un vaso.",
      "Añade la leche caliente.",
      "Remueve y sirve."
    ]
  ),

  // CENAS - abundantes
  recipe(
    "dinner-omelette",
    "Tortilla francesa doble con pan",
    "cena",
    15,
    ["vegetariano"],
    [["egg", 300], ["butter", 20], ["whole_bread", 100]],
    [
      "Bate los huevos.",
      "Cocina en una sarten con mantequilla.",
      "Sirve con pan tostado."
    ]
  ),
  recipe(
    "dinner-tortilla-patata",
    "Tortilla de patatas grande",
    "cena",
    20,
    ["vegetariano"],
    [["egg", 350], ["potato", 400], ["olive_oil", 20]],
    [
      "Fríe las patatas cortadas en rodajas.",
      "Bate los huevos y mézclalos con las patatas.",
      "Cocina la mezcla en la sarten hasta que cuaje."
    ]
  ),
  recipe(
    "dinner-sopa",
    "Sopa de verduras abundante",
    "cena",
    20,
    ["vegetariano", "vegano", "sin_gluten"],
    [["carrot", 150], ["potato", 200], ["onion", 100], ["olive_oil", 10]],
    [
      "Pica las verduras en trozos pequeños.",
      "Hierve en agua con sal.",
      "Sirve caliente."
    ]
  ),
  recipe(
    "dinner-pescado",
    "Pescado al horno con patatas",
    "cena",
    20,
    ["sin_gluten"],
    [["fish", 300], ["potato", 350], ["olive_oil", 15]],
    [
      "Coloca el pescado y las rodajas de patata en una fuente.",
      "Rocía con aceite y hornea a 200C.",
      "Sirve cuando el pescado esté hecho."
    ]
  ),
  recipe(
    "dinner-pollo-asado",
    "Pollo con verduras",
    "cena",
    20,
    ["sin_gluten"],
    [["chicken", 400], ["carrot", 200], ["potato", 250], ["olive_oil", 15]],
    [
      "Coloca el pollo en una fuente con las verduras.",
      "Rocía con aceite y hornea a 200C.",
      "Sirve cuando esté dorado."
    ]
  ),
  recipe(
    "dinner-crema",
    "Crema de verduras",
    "cena",
    20,
    ["vegetariano", "vegano", "sin_gluten"],
    [["pumpkin", 350], ["carrot", 200], ["potato", 200], ["olive_oil", 10]],
    [
      "Hierve todas las verduras.",
      "Tritura con la batidora.",
      "Sirve caliente."
    ]
  ),
  recipe(
    "dinner-huevos-cocidos",
    "Huevos cocidos con pan y queso",
    "cena",
    15,
    ["vegetariano"],
    [["egg", 250], ["whole_bread", 120], ["cheese", 60], ["butter", 15]],
    [
      "Cocina los huevos 10 minutos.",
      "Tosta el pan con mantequilla y queso.",
      "Come juntos."
    ]
  ),
  recipe(
    "dinner-arroz-blanco",
    "Arroz con pollo",
    "cena",
    20,
    [],
    [["rice", 200], ["chicken", 200], ["olive_oil", 12]],
    [
      "Cuece el arroz.",
      "Saltea el pollo.",
      "Mezcla todo y sirve."
    ]
  ),
  recipe(
    "dinner-pasta-carbonara",
    "Pasta carbonara cremosa",
    "cena",
    20,
    ["vegetariano"],
    [["whole_pasta", 200], ["egg", 150], ["bacon", 80], ["cheese", 50]],
    [
      "Cuece la pasta.",
      "Saltea el bacon y añade los huevos revueltos.",
      "Mezcla con la pasta y el queso."
    ]
  ),
  recipe(
    "dinner-ensalada-vegana",
    "Ensalada completa vegana",
    "cena",
    10,
    ["vegetariano", "vegano", "sin_gluten"],
    [["lettuce", 200], ["tomato", 150], ["carrot", 100], ["olive_oil", 15]],
    [
      "Lava y corta las verduras.",
      "Mezcla en un bowl.",
      "Aliña con aceite y sirve."
    ]
  ),
  recipe(
    "dinner-tostadas",
    "Tostadas con jamón y queso",
    "cena",
    10,
    [],
    [["whole_bread", 180], ["ham", 100], ["cheese", 80], ["butter", 15]],
    [
      "Tosta el pan con mantequilla.",
      "Añade el jamón y el queso.",
      "Sirve caliente."
    ]
  ),
  recipe(
    "dinner-sardinas",
    "Sardinas con pan",
    "cena",
    15,
    ["sin_gluten"],
    [["sardines", 200], ["whole_bread", 120], ["olive_oil", 15]],
    [
      "Calienta las sardinas.",
      "Tosta el pan.",
      "Come insieme con aceite."
    ]
  )
];
