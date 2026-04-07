import { useMemo, useState } from "react";
import { usePageMeta } from "../app/usePageMeta";
import { foodMap, mealLabels, recipes } from "../data/catalog";
import { getPageIllustration, getRecipeIllustration } from "../lib/media";
import { formatNumber } from "../lib/nutrition";

const allDifficulties = ["todas", "facil", "media"] as const;
const allMealTypes = ["todas", "desayuno", "media_manana", "comida", "merienda", "cena"] as const;

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState<(typeof allMealTypes)[number]>("todas");
  const [difficultyFilter, setDifficultyFilter] = useState<(typeof allDifficulties)[number]>("todas");
  const [maxMinutes, setMaxMinutes] = useState(30);
  const [dietFilter, setDietFilter] = useState("todas");

  usePageMeta({
    title: "Recetas | Planificador Nutricional Saludable",
    description:
      "Consulta y filtra las recetas del planificador por tipo de comida, dificultad, tiempo y preferencias alimentarias.",
    keywords: "recetas saludables, filtros de recetas, desayuno, comida, cena, planificador nutricional",
    preloadImage: getPageIllustration("recetas")
  });

  const cuisines = useMemo(() => Array.from(new Set(recipes.map((recipe) => recipe.cuisine))).sort(), []);

  const filteredRecipes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return recipes.filter((recipe) => {
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

      if (!searchValue) {
        return true;
      }

      const haystack = `${recipe.title} ${recipe.cuisine} ${recipe.tags.join(" ")} ${recipe.steps.join(" ")}`.toLowerCase();
      return haystack.includes(searchValue);
    });
  }, [dietFilter, difficultyFilter, maxMinutes, mealTypeFilter, search]);

  return (
    <div className="page-grid">
      <section className="page-hero panel">
        <div>
          <p className="eyebrow">Biblioteca de recetas</p>
          <h1>Busca, filtra y revisa cada receta antes de planificar</h1>
          <p className="hero-copy">
            Usa filtros por franja del día, dificultad, tiempo y etiqueta alimentaria para localizar rápido la receta
            adecuada.
          </p>
          <div className="info-inline">
            <span>{recipes.length} recetas cargadas</span>
            <span>{cuisines.length} estilos culinarios</span>
            <span>{filteredRecipes.length} visibles ahora</span>
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
          <h2>Busqueda y filtros</h2>
        </div>

        <div className="filter-grid">
          <label>
            Buscar receta
            <input
              type="search"
              value={search}
              placeholder="Avena, quinoa, vegano, rapido..."
              onChange={(event) => setSearch(event.target.value)}
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
            Etiqueta alimentaria
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
              max={45}
              step={5}
              value={maxMinutes}
              onChange={(event) => setMaxMinutes(Number(event.target.value))}
            />
            <small>{maxMinutes} minutos</small>
          </label>
        </div>
      </section>

      <section className="recipes-grid">
        {filteredRecipes.map((recipe) => (
          <article key={recipe.id} className="recipe-card">
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
                Cocina {recipe.cuisine} · Dificultad {recipe.difficulty}
              </p>

              <div className="tag-list">
                {recipe.tags.map((tag) => (
                  <span key={`${recipe.id}-${tag}`} className="chip chip-static">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="recipe-columns">
                <div>
                  <h3>Ingredientes</h3>
                  <ul>
                    {recipe.ingredients.map((ingredient) => (
                      <li key={`${recipe.id}-${ingredient.foodId}`}>
                        {foodMap[ingredient.foodId].name}: {formatNumber(ingredient.grams)} g
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3>Preparacion</h3>
                  <ol>
                    {recipe.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
