import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../app/usePageMeta";
import { useUserPreferences } from "../app/UserPreferencesProvider";
import { foodMap, mealLabels, recipes } from "../data/catalog";
import { getPageIllustration, getRecipeIllustration } from "../lib/media";
import { formatNumber } from "../lib/nutrition";
import { RecipeVideoMetadata, UnitSystem } from "../types";

const allDifficulties = ["todas", "facil", "media"] as const;
const allMealTypes = ["todas", "desayuno", "media_manana", "comida", "merienda", "cena"] as const;

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const round = (value: number) => Math.round(value * 10) / 10;
const getYoutubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
const getYoutubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
const getYoutubeThumbnailUrl = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
const actionLabels = {
  embed: "desde el reproductor integrado",
  youtube: "abriendo YouTube",
  search: "desde la busqueda manual"
} as const;

const formatIngredientAmount = (grams: number, servings: number, unitSystem: UnitSystem) => {
  const scaled = grams * servings;
  if (unitSystem === "imperial") {
    return `${formatNumber(round(scaled / 28.35))} oz`;
  }

  return `${formatNumber(round(scaled))} g`;
};

const notifyTimerCompleted = async (title: string) => {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission === "granted") {
    new Notification("Temporizador completado", {
      body: `${title} ya esta listo para revisar o emplatar.`
    });
  }
};

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [ingredientFilter, setIngredientFilter] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState<(typeof allMealTypes)[number]>("todas");
  const [difficultyFilter, setDifficultyFilter] = useState<(typeof allDifficulties)[number]>("todas");
  const [maxMinutes, setMaxMinutes] = useState(30);
  const [dietFilter, setDietFilter] = useState("todas");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyDownloaded, setOnlyDownloaded] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0].id);
  const [servings, setServings] = useState(1);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoValidationState, setVideoValidationState] = useState<"idle" | "checking" | "ready" | "fallback">("idle");
  const [videoRestartKey, setVideoRestartKey] = useState(0);
  const [videoMetadata, setVideoMetadata] = useState<RecipeVideoMetadata | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(recipes[0].preparationMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const {
    addComment,
    addRecipeIngredientsToShopping,
    comments,
    downloadedRecipes,
    favorites,
    markRecipeViewed,
    rateRecipe,
    recipeRatings,
    toggleDownloadedRecipe,
    toggleFavorite,
    unitSystem,
    setUnitSystem,
    markRecipeVideoInteraction,
    videoWatchHistory
  } = useUserPreferences();

  usePageMeta({
    title: "Recetas | Planificador Nutricional Saludable",
    description:
      "Consulta, filtra y personaliza recetas con favoritos, porciones, unidades, comentarios, temporizador y soporte offline.",
    keywords:
      "recetas saludables, filtros de ingredientes, estrellas, temporizador de cocina, comentarios, modo offline",
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

      if (onlyFavorites && !favorites.includes(recipe.id)) {
        return false;
      }

      if (onlyDownloaded && !downloadedRecipes.includes(recipe.id)) {
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
  }, [
    dietFilter,
    difficultyFilter,
    downloadedRecipes,
    favorites,
    ingredientFilter,
    maxMinutes,
    mealTypeFilter,
    onlyDownloaded,
    onlyFavorites,
    search
  ]);

  const selectedRecipe = useMemo(
    () => filteredRecipes.find((recipe) => recipe.id === selectedRecipeId) ?? filteredRecipes[0] ?? recipes[0],
    [filteredRecipes, selectedRecipeId]
  );

  const recipeComments = useMemo(
    () => comments.filter((comment) => comment.recipeId === selectedRecipe.id),
    [comments, selectedRecipe.id]
  );
  const youtubeWatchUrl = selectedRecipe.video.youtubeVideoId
    ? getYoutubeWatchUrl(selectedRecipe.video.youtubeVideoId)
    : undefined;
  const youtubeSearchUrl = getYoutubeSearchUrl(selectedRecipe.video.searchQuery);
  const videoWatchEntry = videoWatchHistory[selectedRecipe.id];

  const recipeOverallRating = useMemo(() => {
    const localRatings = recipeComments.map((comment) => comment.rating);
    const directRating = recipeRatings[selectedRecipe.id];
    if (directRating) {
      localRatings.push(directRating);
    }

    const totalBase = selectedRecipe.averageRating * selectedRecipe.ratingsCount;
    const totalLocal = localRatings.reduce((sum, rating) => sum + rating, 0);
    const totalCount = selectedRecipe.ratingsCount + localRatings.length;

    return round((totalBase + totalLocal) / totalCount);
  }, [recipeComments, recipeRatings, selectedRecipe]);

  useEffect(() => {
    if (!filteredRecipes.some((recipe) => recipe.id === selectedRecipeId) && filteredRecipes[0]) {
      setSelectedRecipeId(filteredRecipes[0].id);
    }
  }, [filteredRecipes, selectedRecipeId]);

  useEffect(() => {
    setServings(selectedRecipe.servings);
    setTimerSeconds(selectedRecipe.preparationMinutes * 60);
    setTimerRunning(false);
    setVideoVisible(false);
    setVideoRestartKey(0);
    setVideoMetadata(null);
    setCommentDraft("");
    setCommentRating(recipeRatings[selectedRecipe.id] ?? 5);
    markRecipeViewed(selectedRecipe.id);
  }, [markRecipeViewed, recipeRatings, selectedRecipe]);

  useEffect(() => {
    let cancelled = false;
    const videoId = selectedRecipe.video.youtubeVideoId;

    if (!videoId) {
      setVideoValidationState("fallback");
      return () => {
        cancelled = true;
      };
    }

    setVideoValidationState("checking");

    fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
      .then(async (response) => {
        if (!cancelled) {
          if (response.ok) {
            const payload = (await response.json()) as {
              title?: string;
              author_name?: string;
              provider_name?: string;
              thumbnail_url?: string;
            };

            setVideoMetadata({
              title: payload.title ?? selectedRecipe.title,
              authorName: payload.author_name ?? "Canal no disponible",
              providerName: payload.provider_name ?? "YouTube",
              thumbnailUrl: payload.thumbnail_url ?? getYoutubeThumbnailUrl(videoId)
            });
            setVideoValidationState("ready");
          } else {
            setVideoValidationState("fallback");
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVideoMetadata(null);
          setVideoValidationState("fallback");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedRecipe.id, selectedRecipe.video.youtubeVideoId]);

  useEffect(() => {
    if (!timerRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          setTimerRunning(false);
          void notifyTimerCompleted(selectedRecipe.title);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [selectedRecipe.title, timerRunning]);

  const handleCommentSubmit = () => {
    addComment(selectedRecipe.id, commentDraft, commentRating);
    rateRecipe(selectedRecipe.id, commentRating);
    setCommentDraft("");
  };

  const handleTimerStart = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    setTimerRunning(true);
  };

  return (
    <div className="page-grid">
      <section className="page-hero panel">
        <div>
          <p className="eyebrow">Biblioteca de recetas</p>
          <h1>Busca, personaliza y cocina recetas simples con apoyo visual</h1>
          <p className="hero-copy">
            Filtra por ingredientes, tiempo y dificultad; ajusta porciones, cambia unidades, guarda favoritas y usa
            temporizador con notificaciones.
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
          <div className="unit-toggle">
            <button
              className={unitSystem === "metric" ? "chip chip-active" : "chip"}
              onClick={() => setUnitSystem("metric")}
            >
              Metricas
            </button>
            <button
              className={unitSystem === "imperial" ? "chip chip-active" : "chip"}
              onClick={() => setUnitSystem("imperial")}
            >
              Imperiales
            </button>
          </div>
        </div>

        <div className="filter-grid filter-grid-wide">
          <label>
            Buscar receta
            <input
              type="search"
              value={search}
              placeholder="Avena, quinoa, rapido, economica..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            Ingrediente
            <input
              type="search"
              value={ingredientFilter}
              placeholder="Tomate, garbanzos, pollo..."
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
              max={30}
              step={5}
              value={maxMinutes}
              onChange={(event) => setMaxMinutes(Number(event.target.value))}
            />
            <small>{maxMinutes} minutos</small>
          </label>
        </div>

        <div className="toggle-grid">
          <label className="check-row">
            <input type="checkbox" checked={onlyFavorites} onChange={(event) => setOnlyFavorites(event.target.checked)} />
            Solo favoritas
          </label>
          <label className="check-row">
            <input type="checkbox" checked={onlyDownloaded} onChange={(event) => setOnlyDownloaded(event.target.checked)} />
            Solo descargadas
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

            <div className="recipe-rating-row">
              <strong>{formatNumber(recipeOverallRating)} / 5</strong>
              <span>{selectedRecipe.ratingsCount + recipeComments.length} valoraciones visibles</span>
              <div className="star-row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={`${selectedRecipe.id}-rating-${value}`}
                    className={value <= (recipeRatings[selectedRecipe.id] ?? 0) ? "star-button active-star" : "star-button"}
                    onClick={() => {
                      setCommentRating(value);
                      rateRecipe(selectedRecipe.id, value);
                    }}
                    aria-label={`Valorar con ${value} estrellas`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="action-row">
              <button className="primary-button" onClick={() => toggleFavorite(selectedRecipe.id)}>
                {favorites.includes(selectedRecipe.id) ? "Quitar de favoritas" : "Guardar en favoritas"}
              </button>
              <button className="secondary-button" onClick={() => toggleDownloadedRecipe(selectedRecipe.id)}>
                {downloadedRecipes.includes(selectedRecipe.id) ? "Quitar descarga" : "Descargar offline"}
              </button>
              <button className="secondary-button" onClick={() => addRecipeIngredientsToShopping(selectedRecipe, servings)}>
                Anadir a compra
              </button>
            </div>

            <div className="recipe-budget-grid">
              <article className="budget-pill">
                <strong>{formatNumber(selectedRecipe.budget.costPerServing)} EUR</strong>
                <span>Coste por racion</span>
              </article>
              <article className="budget-pill">
                <strong>{selectedRecipe.ingredients.length} ingredientes</strong>
                <span>Maximo permitido: 8</span>
              </article>
              <article className="budget-pill">
                <strong>{selectedRecipe.steps.length} pasos</strong>
                <span>Maximo permitido: 6</span>
              </article>
            </div>
          </div>
        </div>

        <div className="recipe-tools-grid">
          <section className="tool-card">
            <h3>Porciones y unidades</h3>
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
                  <strong>{formatIngredientAmount(ingredient.grams, servings, unitSystem)}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="tool-card">
            <h3>Temporizador</h3>
            <div className="timer-display">{formatDuration(timerSeconds)}</div>
            <div className="action-row">
              <button className="primary-button" onClick={() => void handleTimerStart()}>
                Iniciar
              </button>
              <button className="secondary-button" onClick={() => setTimerRunning(false)}>
                Pausar
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(selectedRecipe.preparationMinutes * 60);
                }}
              >
                Reiniciar
              </button>
            </div>
            <small className="helper-text">Lanza una notificacion del navegador cuando el tiempo llega a cero.</small>
          </section>

          <section className="tool-card">
            <h3>Alternativas economicas</h3>
            {selectedRecipe.budget.expensiveAlternatives.length === 0 ? (
              <p className="helper-text">Esta receta ya usa ingredientes comunes y ajustados a presupuesto.</p>
            ) : (
              <ul className="plain-list">
                {selectedRecipe.budget.expensiveAlternatives.map((alternative) => (
                  <li key={`${selectedRecipe.id}-${alternative}`}>{alternative}</li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Galeria por pasos</h2>
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
          <h2>Video y accesibilidad</h2>
          <div className="action-row">
            <button
              className="primary-button"
              onClick={() => {
                markRecipeVideoInteraction(selectedRecipe.id, "embed");
                setVideoVisible(true);
                setVideoRestartKey((value) => value + 1);
              }}
              disabled={videoValidationState !== "ready"}
            >
              Reproducir video
            </button>
            <button className="secondary-button" onClick={() => setVideoRestartKey((value) => value + 1)} disabled={!videoVisible}>
              Reiniciar video
            </button>
            <button className="secondary-button" onClick={() => setVideoVisible(false)} disabled={!videoVisible}>
              Ocultar video
            </button>
            {youtubeWatchUrl ? (
              <a
                className="secondary-button button-link"
                href={youtubeWatchUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => markRecipeVideoInteraction(selectedRecipe.id, "youtube")}
              >
                Ver en YouTube
              </a>
            ) : (
              <a
                className="secondary-button button-link"
                href={youtubeSearchUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => markRecipeVideoInteraction(selectedRecipe.id, "search")}
              >
                Buscar en YouTube
              </a>
            )}
          </div>
        </div>

        <div className="video-meta-row">
          <span className={videoValidationState === "ready" ? "video-status ready-status" : "video-status"}>
            {videoValidationState === "ready" ? "Video validado" : "Fallback activo"}
          </span>
          <span className="video-search-hint">{selectedRecipe.video.searchQuery}</span>
        </div>

        {videoMetadata ? (
          <div className="video-info-card">
            <img
              className="video-info-mini-thumbnail"
              src={videoMetadata.thumbnailUrl}
              alt="Miniatura del video"
              loading="lazy"
            />
            <div className="video-info-copy">
              <strong>{videoMetadata.title}</strong>
              <span>
                {videoMetadata.authorName} · {videoMetadata.providerName}
              </span>
              {videoWatchEntry ? (
                <small>
                  Ultimo visionado {new Date(videoWatchEntry.lastViewedAt).toLocaleString("es-ES")} · {videoWatchEntry.playCount} interacciones ·{" "}
                  {actionLabels[videoWatchEntry.lastAction]}
                </small>
              ) : (
                <small>Aun no has interactuado con el video de esta receta.</small>
              )}
            </div>
          </div>
        ) : null}

        {videoValidationState === "checking" ? <p className="helper-text">Validando disponibilidad del video...</p> : null}

        {videoVisible && videoValidationState === "ready" && selectedRecipe.video.youtubeVideoId ? (
          <div className="video-frame-shell">
            <iframe
              key={`${selectedRecipe.id}-${videoRestartKey}`}
              className="video-frame"
              title={`Video de ${selectedRecipe.title}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              src={`https://www.youtube-nocookie.com/embed/${selectedRecipe.video.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
            />
          </div>
        ) : videoValidationState === "ready" && selectedRecipe.video.youtubeVideoId ? (
          <div
            className="video-thumbnail-card"
            onClick={() => {
              markRecipeVideoInteraction(selectedRecipe.id, "embed");
              setVideoVisible(true);
              setVideoRestartKey((value) => value + 1);
            }}
          >
            <img
              className="video-thumbnail-image"
              src={videoMetadata?.thumbnailUrl ?? getYoutubeThumbnailUrl(selectedRecipe.video.youtubeVideoId)}
              alt={`Miniatura del video de ${selectedRecipe.title}`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="video-thumbnail-copy">
              <strong>Vista previa del video</strong>
              <p className="helper-text">Pulsa para reproducir el video de YouTube ahora.</p>
            </div>
          </div>
        ) : (
          <div className="video-fallback-card">
            <img
              className="recipe-image"
              src={selectedRecipe.video.fallbackImage}
              alt={`Fallback de video para ${selectedRecipe.title}`}
              loading="lazy"
              decoding="async"
            />
            <p className="helper-text">
              {videoValidationState === "fallback"
                ? "No se ha validado un video disponible para esta receta. Se mantiene el apoyo visual con imagen y transcripcion."
                : "Pulsa reproducir para cargar el video de YouTube solo cuando lo necesites."}
            </p>
            <a
              className="secondary-button button-link"
              href={youtubeSearchUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => markRecipeVideoInteraction(selectedRecipe.id, "search")}
            >
              Abrir busqueda manual
            </a>
          </div>
        )}

        <div className="transcript-box">
          <h3>Transcripcion automatica</h3>
          <ol>
            {selectedRecipe.video.transcript.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Comentarios y valoraciones</h2>
        </div>
        <div className="comment-layout">
          <div className="comment-form">
            <label>
              Tu comentario
              <textarea
                value={commentDraft}
                placeholder="Cuenta si la receta te resulto facil, economica o si hiciste algun cambio."
                onChange={(event) => setCommentDraft(event.target.value)}
              />
            </label>
            <label>
              Puntuacion
              <select value={commentRating} onChange={(event) => setCommentRating(Number(event.target.value))}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} estrellas
                  </option>
                ))}
              </select>
            </label>
            <button className="primary-button" onClick={handleCommentSubmit}>
              Publicar comentario
            </button>
          </div>

          <div className="comment-list">
            {recipeComments.length === 0 ? (
              <p className="helper-text">Aun no hay comentarios locales para esta receta.</p>
            ) : (
              recipeComments.map((comment) => (
                <article key={comment.id} className="comment-card">
                  <div className="recipe-card-header">
                    <strong>{comment.userName}</strong>
                    <span>{comment.rating} / 5</span>
                  </div>
                  <p>{comment.comment}</p>
                  <small>{new Date(comment.createdAt).toLocaleString("es-ES")}</small>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="recipes-grid">
        {filteredRecipes.map((recipe) => {
          const isFavorite = favorites.includes(recipe.id);
          const isDownloaded = downloadedRecipes.includes(recipe.id);
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
                  Cocina {recipe.cuisine} · Dificultad {recipe.difficulty} · {formatNumber(recipe.budget.costPerServing)} EUR
                </p>

                <div className="tag-list">
                  {recipe.tags.map((tag) => (
                    <span key={`${recipe.id}-${tag}`} className="chip chip-static">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="recipe-card-footer">
                  <span>{isFavorite ? "Favorita" : "Sin guardar"}</span>
                  <span>{isDownloaded ? "Disponible offline" : "Solo online"}</span>
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
