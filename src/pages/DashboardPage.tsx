import { Link } from "react-router-dom";
import { usePlanner } from "../app/PlannerProvider";
import { useUserPreferences } from "../app/UserPreferencesProvider";
import { usePageMeta } from "../app/usePageMeta";
import { mealLabels, recipes } from "../data/catalog";
import { getPageIllustration, getRecipeIllustration } from "../lib/media";
import { formatNumber } from "../lib/nutrition";

export default function DashboardPage() {
  const { plan } = usePlanner();
  const { downloadedRecipes, favoriteCount, favorites, history } = useUserPreferences();
  const budgetTargetPerPerson = 250;

  usePageMeta({
    title: "Dashboard | Planificador Nutricional Saludable",
    description:
      "Panel local con favoritos, historial, recetas descargadas y control de presupuesto.",
    keywords: "dashboard recetas, favoritos, historial, recetas descargadas, presupuesto por persona",
    preloadImage: getPageIllustration("dashboard")
  });

  const favoriteRecipes = recipes.filter((recipe) => favorites.includes(recipe.id));
  const downloaded = recipes.filter((recipe) => downloadedRecipes.includes(recipe.id));
  const recentHistory = history
    .map((entry) => ({
      entry,
      recipe: recipes.find((recipe) => recipe.id === entry.recipeId)
    }))
    .filter((item): item is { entry: (typeof history)[number]; recipe: (typeof recipes)[number] } => Boolean(item.recipe))
    .slice(0, 6);

  const monthlyCostPerPerson = plan.input.people > 0 ? plan.totalEstimatedCost / plan.input.people : plan.totalEstimatedCost;
  const budgetDifference = budgetTargetPerPerson - monthlyCostPerPerson;
  const budgetOnTrack = monthlyCostPerPerson <= budgetTargetPerPerson;

  return (
    <div className="page-grid">
      <section className="page-hero panel">
        <div>
          <p className="eyebrow">Dashboard local</p>
          <h1>Tu espacio con favoritos, historial y recetas offline</h1>
          <p className="hero-copy">
            La actividad se guarda en el navegador para que puedas retomar recetas, descargas y seguimiento sin pasos extra.
          </p>
          <div className="info-inline">
            <span>{favoriteCount} favoritas</span>
            <span>{downloaded.length} descargadas</span>
            <span>{history.length} vistas recientes</span>
          </div>
        </div>
        <img
          className="hero-image"
          src={getPageIllustration("dashboard")}
          alt="Panel local de recetas y actividad"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </section>

      <section className="summary-grid">
        <article className="stat-card">
          <span>Presupuesto por persona</span>
          <strong>{formatNumber(monthlyCostPerPerson)} EUR</strong>
          <small>{budgetOnTrack ? "Dentro del objetivo de 250 EUR" : "Por encima del objetivo mensual"}</small>
        </article>
        <article className="stat-card">
          <span>Margen restante</span>
          <strong>{formatNumber(Math.abs(budgetDifference))} EUR</strong>
          <small>{budgetOnTrack ? "Todavia disponible" : "Ajuste recomendado en compras"}</small>
        </article>
        <article className="stat-card">
          <span>Historial reciente</span>
          <strong>{history.length}</strong>
          <small>Recetas vistas recientemente</small>
        </article>
        <article className="stat-card">
          <span>Recetas descargadas</span>
          <strong>{downloaded.length}</strong>
          <small>Listas para consultar tambien offline</small>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Acciones rapidas</h2>
        </div>
        <div className="quick-actions-grid">
          <Link className="quick-action-card" to="/recetas">
            <strong>Explorar recetas</strong>
            <span>Filtra, guarda y descarga para offline.</span>
          </Link>
          <Link className="quick-action-card" to="/compras">
            <strong>Revisar compra</strong>
            <span>Combina la compra mensual con tu lista inteligente.</span>
          </Link>
          <Link className="quick-action-card" to="/">
            <strong>Volver al resumen</strong>
            <span>Consulta nutricion global, coste y cobertura diaria.</span>
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Recetas favoritas</h2>
        </div>
        {favoriteRecipes.length === 0 ? (
          <p className="helper-text">Marca favoritas desde la biblioteca para construir tu panel personalizado.</p>
        ) : (
          <div className="mini-recipe-grid">
            {favoriteRecipes.map((recipe) => (
              <article key={recipe.id} className="mini-recipe-card">
                <img className="recipe-image" src={getRecipeIllustration(recipe)} alt={recipe.title} loading="lazy" decoding="async" />
                <div className="recipe-card-body">
                  <span className="meal-type">{mealLabels[recipe.mealType]}</span>
                  <h3>{recipe.title}</h3>
                  <p className="meal-meta">
                    {recipe.preparationMinutes} min · {formatNumber(recipe.budget.costPerServing)} EUR por racion
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Descargadas</h2>
          </div>
          {downloaded.length === 0 ? (
            <p className="helper-text">Aun no has descargado recetas para modo offline.</p>
          ) : (
            <div className="stack-list">
              {downloaded.map((recipe) => (
                <article key={recipe.id} className="stack-card">
                  <strong>{recipe.title}</strong>
                  <span>{recipe.summary}</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Historial</h2>
          </div>
          {recentHistory.length === 0 ? (
            <p className="helper-text">El historial se llenara cuando abras recetas en detalle.</p>
          ) : (
            <div className="stack-list">
              {recentHistory.map(({ entry, recipe }) => (
                <article key={`${entry.recipeId}-${entry.viewedAt}`} className="stack-card">
                  <strong>{recipe.title}</strong>
                  <span>{new Date(entry.viewedAt).toLocaleString("es-ES")}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
