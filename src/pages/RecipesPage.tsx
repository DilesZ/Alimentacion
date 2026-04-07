import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../app/usePageMeta";
import { foodMap, mealLabels, recipes } from "../data/catalog";
import { getPageIllustration, getRecipeIllustration } from "../lib/media";
import { formatNumber, ingredientsToNutrients } from "../lib/nutrition";

const allDifficulties = ["todas", "facil", "media"] as const;
const allMealTypes = ["todas", "desayuno", "comida", "cena"] as const;

const getYoutubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
const getYoutubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [ingredientFilter, setIngredientFilter] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState<(typeof allMealTypes)[number]>("todas");
  const [difficultyFilter, setDifficultyFilter] = useState<(typeof allDifficulties)[number]>("todas");
  const [maxMinutes, setMaxMinutes] = useState(15);
  const [dietFilter, setDietFilter] = useState("todas");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0].id);
  const [servings, setServings] = useState(1);

  usePageMeta({
    title: "Recetas | Planificador Nutricional Saludable",
    description: "Biblioteca de recetas saludables para planificar tu alimentacion.",
    keywords: "recetas saludables, cocina, alimentacion, menu semanal",
    preloadImage: getPageIllustration("recetas")
  });

  const cuisines = useMemo(() => Array.from(new Set(recipes.map((recipe) => recipe.cuisine))).sort(), []);

  const filteredRecipes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    const ingredientValue = ingredientFilter.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const ingredientNames = recipe.ingredients.map((ingredient) => foodMap[ingredient.foodId].name.toLowerCase());

      if (mealTypeFilter !== "todas" && recipe.mealType !== mealTypeFilter) {
        return false;
      }

      if (difficultyFilter !== "todas" && recipe.difficulty !== difficultyFilter) {
        return false;
      }

      if (dietFilter !== "todas" && !recipe.tags.includes(dietFilter)) {
        return false;
      }

      if (recipe.preparationMinutes > maxMinutes) {
        return false;
      }

      if (ingredientValue && !ingredientNames.some((name) => name.includes(ingredientValue))) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      const haystack = `${recipe.title} ${recipe.cuisine} ${recipe.tags.join(" ")} ${ingredientNames.join(" ")} ${recipe.steps.join(" ")}`.toLowerCase();
      return haystack.includes(searchValue);
    });
  }, [dietFilter, difficultyFilter, ingredientFilter, maxMinutes, mealTypeFilter, search]);

  const selectedRecipe = useMemo(
    () => filteredRecipes.find((recipe) => recipe.id === selectedRecipeId) ?? filteredRecipes[0] ?? recipes[0],
    [filteredRecipes, selectedRecipeId]
  );

  const youtubeWatchUrl = selectedRecipe.video.youtubeVideoId
    ? getYoutubeWatchUrl(selectedRecipe.video.youtubeVideoId)
    : undefined;
  const youtubeSearchUrl = getYoutubeSearchUrl(selectedRecipe.video.searchQuery);

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
      <section className="page-hero panel">
        <div>
          <p className="eyebrow">Biblioteca de recetas</p>
          <h1>Recetas rapidas, economicas y saludables</h1>
          <p className="hero-copy">
            Explora recetas con maximo 5 ingredientes y 15 minutos de preparacion. Ajusta porciones y consulta informacion nutricional.
          </p>
          <div className="info-inline">
            <span>{recipes.length} recetas</span>
            <span>{cuisines.length} estilos</span>
            <span>{filteredRecipes.length} visibles</span>
          </div>
        </div>
        <img
          className="hero-image"
          src={getPageIllustration("recetas")}
          alt="Vista de recetas saludables"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </section>

      <section className="panel filter-panel">
        <div className="panel-header">
          <h2>Buscar y filtrar</h2>
        </div>

        <div className="filter-grid filter-grid-wide">
          <label>
            Buscar receta
            <input
              type="search"
              value={search}
              placeholder="Avena, tomate, rapido..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            Ingrediente
            <input
              type="search"
              value={ingredientFilter}
              placeholder="Tomate, garbanzos..."
              onChange={(event) => setIngredientFilter(event.target.value)}
            />
          </label>

          <label>
            Franja
            <select value={mealTypeFilter} onChange={(event) => setMealTypeFilter(event.target.value as typeof mealTypeFilter)}>
              {allMealTypes.map((option) => (
                <option key={option} value={option}>
                  {option === "todas" ? "Todas" : mealLabels[option]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Dificultad
            <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value as typeof difficultyFilter)}>
              {allDifficulties.map((option) => (
                <option key={option} value={option}>
                  {option === "todas" ? "Todas" : option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Dieta
            <select value={dietFilter} onChange={(event) => setDietFilter(event.target.value)}>
              <option value="todas">Todas</option>
              <option value="vegetariano">Vegetariano</option>
              <option value="vegano">Vegano</option>
              <option value="sin_gluten">Sin gluten</option>
            </select>
          </label>

          <label>
            Tiempo maximo
            <input
              type="range"
              min={5}
              max={15}
              step={5}
              value={maxMinutes}
              onChange={(event) => setMaxMinutes(Number(event.target.value))}
            />
            <small>{maxMinutes} minutos</small>
          </label>
        </div>
      </section>

      <section className="panel recipe-detail-panel">
        <div className="recipe-detail-top">
          <img
            className="recipe-detail-image"
            src={getRecipeIllustration(selectedRecipe)}
            alt={`Vista principal de ${selectedRecipe.title}`}
            loading="eager"
            decoding="async"
          />

          <div className="recipe-detail-content">
            <div className="recipe-card-header">
              <div>
                <span className="meal-type">{mealLabels[selectedRecipe.mealType]}</span>
                <h2>{selectedRecipe.title}</h2>
              </div>
              <span className="recipe-time">{selectedRecipe.preparationMinutes} min</span>
            </div>

            <p className="hero-copy">{selectedRecipe.summary}</p>

            <div className="tag-list">
              {selectedRecipe.tags.map((tag) => (
                <span key={`${selectedRecipe.id}-${tag}`} className="chip chip-static">
                  {tag}
                </span>
              ))}
            </div>

            <div className="recipe-overview-grid">
              <article className="recipe-overview-card">
                <span>Dificultad</span>
                <strong>{selectedRecipe.difficulty}</strong>
              </article>
              <article className="recipe-overview-card">
                <span>Cocina</span>
                <strong>{selectedRecipe.cuisine}</strong>
              </article>
              <article className="recipe-overview-card">
                <span>Raciones</span>
                <strong>{selectedRecipe.servings}</strong>
              </article>
              <article className="recipe-overview-card">
                <span>Precio</span>
                <strong>{selectedRecipe.budget.costPerServing} EUR</strong>
              </article>
            </div>

            <div className="recipe-budget-grid">
              <article className="budget-pill">
                <strong>{formatNumber(selectedRecipe.budget.costPerServing)} EUR</strong>
                <span>por racion</span>
              </article>
              <article className="budget-pill">
                <strong>{selectedRecipe.ingredients.length}</strong>
                <span>ingredientes</span>
              </article>
              <article className="budget-pill">
                <strong>{selectedRecipe.steps.length}</strong>
                <span>pasos</span>
              </article>
            </div>
          </div>
        </div>

        <div className="recipe-tools-grid">
          <section className="tool-card">
            <h3>Ingredientes</h3>
            <label>
              Raciones
              <input
                type="number"
                min={1}
                max={8}
                value={servings}
                onChange={(event) => setServings(Math.max(1, Number(event.target.value) || 1))}
              />
            </label>

            <ul className="ingredient-list">
              {selectedRecipe.ingredients.map((ingredient) => (
                <li key={`${selectedRecipe.id}-${ingredient.foodId}`}>
                  <span>{foodMap[ingredient.foodId].name}</span>
                  <strong>{Math.round(ingredient.grams * servings)} g</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="tool-card">
            <h3>Nutricion</h3>
            <ul className="plain-list">
              <li>
                <span>Energia</span>
                <strong>{formatNumber(recipeNutrition.calories * servings / selectedRecipe.servings)} kcal</strong>
              </li>
              <li>
                <span>Proteinas</span>
                <strong>{formatNumber(recipeNutrition.protein * servings / selectedRecipe.servings)} g</strong>
              </li>
              <li>
                <span>Hidratos</span>
                <strong>{formatNumber(recipeNutrition.carbs * servings / selectedRecipe.servings)} g</strong>
              </li>
              <li>
                <span>Grasas</span>
                <strong>{formatNumber(recipeNutrition.fat * servings / selectedRecipe.servings)} g</strong>
              </li>
              <li>
                <span>Fibra</span>
                <strong>{formatNumber(recipeNutrition.fiber * servings / selectedRecipe.servings)} g</strong>
              </li>
            </ul>
          </section>

          <section className="tool-card">
            <h3>Preparacion</h3>
            <ol className="steps-list">
              {selectedRecipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Galeria</h2>
        </div>
        <div className="step-gallery-grid">
          {selectedRecipe.gallery.map((item, index) => (
            <article key={item.id} className="step-card">
              <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
              <div className="recipe-card-body">
                <strong>{item.title}</strong>
                <p className="meal-meta">{selectedRecipe.steps[index]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Video</h2>
        </div>
        {selectedRecipe.video.youtubeVideoId ? (
          <div className="action-row">
            <a
              className="primary-button button-link"
              href={youtubeWatchUrl}
              target="_blank"
              rel="noreferrer"
            >
              Ver en YouTube
            </a>
            <a
              className="secondary-button button-link"
              href={youtubeSearchUrl}
              target="_blank"
              rel="noreferrer"
            >
              Buscar video
            </a>
          </div>
        ) : (
          <p className="helper-text">Buscar: {selectedRecipe.video.searchQuery}</p>
        )}
      </section>

      <section className="recipes-grid">
        {filteredRecipes.map((recipe) => {
          const active = recipe.id === selectedRecipe.id;

          return (
            <article key={recipe.id} className={active ? "recipe-card recipe-card-active" : "recipe-card"}>
              <img
                className="recipe-image"
                src={getRecipeIllustration(recipe)}
                alt={`Ilustracion de ${recipe.title}`}
                loading="lazy"
                decoding="async"
              />

              <div className="recipe-card-body">
                <div className="recipe-card-header">
                  <div>
                    <span className="meal-type">{mealLabels[recipe.mealType]}</span>
                    <h2>{recipe.title}</h2>
                  </div>
                  <span className="recipe-time">{recipe.preparationMinutes} min</span>
                </div>

                <p className="meal-meta">
                  {recipe.cuisine} · {recipe.difficulty} · {formatNumber(recipe.budget.costPerServing)} EUR
                </p>

                <div className="tag-list">
                  {recipe.tags.map((tag) => (
                    <span key={`${recipe.id}-${tag}`} className="chip chip-static">
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="primary-button" onClick={() => setSelectedRecipeId(recipe.id)}>
                  Ver detalle
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}