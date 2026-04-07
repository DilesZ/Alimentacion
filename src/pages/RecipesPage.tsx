import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../app/usePageMeta";
import { foodMap, mealLabels, recipes } from "../data/catalog";
import { getPageIllustration, getRecipeIllustration } from "../lib/media";
import { formatNumber, ingredientsToNutrients } from "../lib/nutrition";

const allMealTypes = ["todas", "desayuno", "comida", "cena"] as const;
const mealIcons: Record<string, string> = {
  desayuno: "🌅",
  comida: "☀️",
  cena: "🌙"
};

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState<(typeof allMealTypes)[number]>("todas");
  const [dietFilter, setDietFilter] = useState("todas");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0].id);
  const [servings, setServings] = useState(1);

  usePageMeta({
    title: "Recetas | Planificador Nutricional Saludable",
    description: "Biblioteca de recetas saludables para planificar tu alimentacion.",
    keywords: "recetas saludables, cocina, alimentacion, menu semanal",
    preloadImage: getPageIllustration("recetas")
  });

  const filteredRecipes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return recipes.filter((recipe) => {
      if (mealTypeFilter !== "todas" && recipe.mealType !== mealTypeFilter) {
        return false;
      }

      if (dietFilter !== "todas" && !recipe.tags.includes(dietFilter)) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      const ingredientNames = recipe.ingredients.map((ingredient) => foodMap[ingredient.foodId].name.toLowerCase());
      const haystack = `${recipe.title} ${recipe.cuisine} ${recipe.tags.join(" ")} ${ingredientNames.join(" ")}`.toLowerCase();
      return haystack.includes(searchValue);
    });
  }, [dietFilter, mealTypeFilter, search]);

  const selectedRecipe = useMemo(
    () => filteredRecipes.find((recipe) => recipe.id === selectedRecipeId) ?? filteredRecipes[0] ?? recipes[0],
    [filteredRecipes, selectedRecipeId]
  );

  const recipeNutrition = useMemo(() => ingredientsToNutrients(selectedRecipe.ingredients), [selectedRecipe]);

  useEffect(() => {
    if (!filteredRecipes.some((recipe) => recipe.id === selectedRecipeId) && filteredRecipes[0]) {
      setSelectedRecipeId(filteredRecipes[0].id);
    }
  }, [filteredRecipes, selectedRecipeId]);

  useEffect(() => {
    setServings(selectedRecipe.servings);
  }, [selectedRecipe]);

  return (
    <div className="page-grid">
      {/* HERO */}
      <section className="hero-section recipes-hero">
        <div className="hero-content">
          <h1>Recetas</h1>
          <p className="hero-subtitle">{recipes.length} recetas disponibles</p>
        </div>
      </section>

      {/* FILTROS COMPACTOS */}
      <section className="panel compact-form">
        <div className="form-row">
          <div className="form-group search-group">
            <label>🔍 Buscar</label>
            <input
              type="search"
              value={search}
              placeholder="Buscar receta o ingrediente..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>🍽️ Tipo</label>
            <select value={mealTypeFilter} onChange={(event) => setMealTypeFilter(event.target.value as typeof mealTypeFilter)}>
              {allMealTypes.map((option) => (
                <option key={option} value={option}>
                  {option === "todas" ? "Todos" : mealLabels[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>🥗 Dieta</label>
            <select value={dietFilter} onChange={(event) => setDietFilter(event.target.value)}>
              <option value="todas">Todas</option>
              <option value="vegetariano">Vegetariano</option>
              <option value="vegano">Vegano</option>
              <option value="sin_gluten">Sin gluten</option>
            </select>
          </div>
        </div>
      </section>

      {/* RECETA SELECCIONADA - GRANDE Y VISUAL */}
      <section className="selected-recipe">
        <div className="recipe-hero-card">
          <img
            className="recipe-main-image"
            src={getRecipeIllustration(selectedRecipe)}
            alt={selectedRecipe.title}
          />
          
          <div className="recipe-hero-content">
            <div className="recipe-badges">
              <span className="meal-badge">{mealIcons[selectedRecipe.mealType]} {mealLabels[selectedRecipe.mealType]}</span>
              <span className="time-badge">⏱️ {selectedRecipe.preparationMinutes} min</span>
              <span className="cost-badge">💰 {formatNumber(selectedRecipe.budget.costPerServing)}€</span>
            </div>
            
            <h2>{selectedRecipe.title}</h2>
            
            <div className="recipe-tags">
              {selectedRecipe.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>

            <div className="recipe-stats-grid">
              <div className="stat-item">
                <span className="stat-icon">🔥</span>
                <span className="stat-val">{formatNumber(recipeNutrition.calories)}</span>
                <span className="stat-lbl">kcal</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🥩</span>
                <span className="stat-val">{formatNumber(recipeNutrition.protein)}</span>
                <span className="stat-lbl">proteína</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🥗</span>
                <span className="stat-val">{formatNumber(recipeNutrition.fiber)}</span>
                <span className="stat-lbl">fibra</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🍞</span>
                <span className="stat-val">{formatNumber(recipeNutrition.carbs)}</span>
                <span className="stat-lbl">carbs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recipe-details-grid">
          <div className="detail-card ingredients-card">
            <h3>🥕 Ingredientes</h3>
            <div className="servings-control">
              <label>Porciones:</label>
              <input
                type="number"
                min={1}
                max={8}
                value={servings}
                onChange={(event) => setServings(Math.max(1, Number(event.target.value) || 1))}
              />
            </div>
            <ul className="ingredients-list">
              {selectedRecipe.ingredients.map((ingredient) => (
                <li key={`${selectedRecipe.id}-${ingredient.foodId}`}>
                  <span className="ing-name">{foodMap[ingredient.foodId].name}</span>
                  <span className="ing-amount">{Math.round(ingredient.grams * servings)} g</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-card steps-card">
            <h3>👩‍🍳 Preparacion</h3>
            <ol className="steps-list">
              {selectedRecipe.steps.map((step, index) => (
                <li key={index}>
                  <span className="step-num">{index + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* GALERIA DE RECETAS */}
      <section className="recipes-gallery">
        <h2>Todas las recetas ({filteredRecipes.length})</h2>
        <div className="gallery-grid">
          {filteredRecipes.map((recipe) => {
            const active = recipe.id === selectedRecipe.id;
            const nutrition = ingredientsToNutrients(recipe.ingredients);

            return (
              <button
                key={recipe.id}
                className={`gallery-card ${active ? "active" : ""}`}
                onClick={() => setSelectedRecipeId(recipe.id)}
              >
                <img src={getRecipeIllustration(recipe)} alt={recipe.title} />
                <div className="gallery-card-content">
                  <span className="gallery-meal-type">
                    {mealIcons[recipe.mealType]} {mealLabels[recipe.mealType]}
                  </span>
                  <h3>{recipe.title}</h3>
                  <div className="gallery-meta">
                    <span>⏱️ {recipe.preparationMinutes} min</span>
                    <span>🔥 {formatNumber(nutrition.calories)} kcal</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}