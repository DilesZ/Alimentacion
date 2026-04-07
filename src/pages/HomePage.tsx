import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { budgetStatusLabel, usePlanner } from "../app/PlannerProvider";
import { usePageMeta } from "../app/usePageMeta";
import { foodMap, mealLabels } from "../data/catalog";
import { getPageIllustration } from "../lib/media";
import { formatNumber, nutrientLabels, nutrientUnits } from "../lib/nutrition";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1"];

export default function HomePage() {
  const { allergyInput, error, formState, generatePlan, plan, setAllergyInput, setFormState } = usePlanner();
  const [selectedDay, setSelectedDay] = useState(1);

  usePageMeta({
    title: "Inicio | Planificador Nutricional Saludable",
    description: "Resumen nutricional, configuracion del plan mensual y panel principal de planificacion alimentaria saludable.",
    keywords: "planificador nutricional, menu mensual, resumen nutricional, dieta saludable, paiporta",
    preloadImage: getPageIllustration("inicio")
  });

  const currentDay = useMemo(() => plan.days.find((day) => day.day === selectedDay) ?? plan.days[0], [plan, selectedDay]);
  const monthlyPerPerson = plan.input.people > 0 ? plan.totalEstimatedCost / plan.input.people : plan.totalEstimatedCost;
  const avgCoverage = Math.round(plan.nutrientProgress.reduce((sum, item) => sum + Math.min(item.percentage, 100), 0) / plan.nutrientProgress.length);

  return (
    <div className="page-grid">
      {/* HERO - Título principal limpio */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Tu Plan de Alimentación Mensual</h1>
          <p className="hero-subtitle">
            {plan.input.days} días · {plan.input.people} personas · {formatNumber(monthlyPerPerson)}€ por persona
          </p>
        </div>
        <button className="hero-button" onClick={generatePlan}>
          Generar nuevo plan
        </button>
      </section>

      {/* RESUMEN RÁPIDO - Tarjetas grandes y visuales */}
      <section className="quick-stats">
        <div className="stat-card-large stat-cost">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{formatNumber(plan.totalEstimatedCost)}€</span>
            <span className="stat-label">Coste total</span>
          </div>
          <span className={`stat-badge ${plan.budgetStatus}`}>{budgetStatusLabel[plan.budgetStatus]}</span>
        </div>

        <div className="stat-card-large stat-nutrients">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">{avgCoverage}%</span>
            <span className="stat-label">Cobertura nutricional</span>
          </div>
          <div className="nutrient-bars">
            {plan.nutrientProgress.slice(0, 6).map((item, _idx) => (
              <div key={item.nutrient} className="mini-bar">
                <div 
                  className="mini-bar-fill" 
                  style={{ 
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: COLORS[plan.nutrientProgress.indexOf(item) % COLORS.length]
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card-large stat-energy">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-value">{formatNumber(plan.monthlyTotals.calories / plan.input.days)}</span>
            <span className="stat-label">kcal/día persona</span>
          </div>
        </div>

        <div className="stat-card-large stat-shopping">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <span className="stat-value">{plan.shoppingList.reduce((sum, group) => sum + group.items.length, 0)}</span>
            <span className="stat-label">productos</span>
          </div>
        </div>
      </section>

      {/* FORMULARIO COMPACTO */}
      <section className="panel compact-form">
        <div className="form-row">
          <div className="form-group">
            <label>Personas</label>
            <input
              type="number"
              min={1}
              max={8}
              value={formState.people}
              onChange={(event) => setFormState((current) => ({ ...current, people: Number(event.target.value) || 1 }))}
            />
          </div>

          <div className="form-group">
            <label>Días</label>
            <select
              value={formState.days}
              onChange={(event) => setFormState((current) => ({ ...current, days: Number(event.target.value) as 30 | 31 }))}
            >
              <option value={30}>30 días</option>
              <option value={31}>31 días</option>
            </select>
          </div>

          <div className="form-group">
            <label>Presupuesto/persona</label>
            <input
              type="number"
              min={80}
              step={10}
              value={formState.monthlyBudget}
              onChange={(event) => setFormState((current) => ({ ...current, monthlyBudget: Number(event.target.value) || 0 }))}
            />
          </div>

          <div className="form-group">
            <label>Alergias</label>
            <input
              type="text"
              placeholder="gluten, soja..."
              value={allergyInput}
              onChange={(event) => setAllergyInput(event.target.value)}
            />
          </div>
        </div>

        <div className="form-row tags-row">
          <label className="checkbox-chip">
            <input
              type="checkbox"
              checked={formState.restrictions.vegetarian}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  restrictions: { ...current.restrictions, vegetarian: event.target.checked, vegan: event.target.checked ? current.restrictions.vegan : false }
                }))
              }
            />
            🌱 Vegetariano
          </label>

          <label className="checkbox-chip">
            <input
              type="checkbox"
              checked={formState.restrictions.vegan}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  restrictions: { ...current.restrictions, vegan: event.target.checked, vegetarian: event.target.checked ? true : current.restrictions.vegetarian }
                }))
              }
            />
            🌿 Vegano
          </label>

          <label className="checkbox-chip">
            <input
              type="checkbox"
              checked={formState.restrictions.glutenFree}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  restrictions: { ...current.restrictions, glutenFree: event.target.checked }
                }))
              }
            />
            🚫 Sin gluten
          </label>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
      </section>

      {/* VISTA DIARIA PRINCIPAL */}
      <section className="day-view">
        <div className="day-header">
          <h2>📅 Día {selectedDay}</h2>
          <div className="day-nav">
            {plan.days.slice(0, 7).map((day) => (
              <button
                key={day.day}
                className={`day-button ${day.day === selectedDay ? "active" : ""}`}
                onClick={() => setSelectedDay(day.day)}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>

        <div className="day-content">
          <div className="meals-timeline">
            {currentDay.meals.map((meal) => (
              <div key={`${currentDay.day}-${meal.mealType}`} className="timeline-meal">
                <div className="meal-time">
                  <span className="meal-type-badge">{mealLabels[meal.mealType]}</span>
                  <span className="meal-time-label">{meal.recipe.preparationMinutes} min</span>
                </div>
                
                <div className="meal-details">
                  <h3>{meal.recipe.title}</h3>
                  <div className="meal-ingredients">
                    {meal.scaledIngredients.slice(0, 4).map((ing) => (
                      <span key={`${meal.recipe.id}-${ing.foodId}`} className="ingredient-tag">
                        {foodMap[ing.foodId].name}
                      </span>
                    ))}
                    {meal.scaledIngredients.length > 4 && (
                      <span className="ingredient-tag more">+{meal.scaledIngredients.length - 4}</span>
                    )}
                  </div>
                </div>

                <div className="meal-nutrients">
                  <div className="nutrient-pill">
                    <span>{formatNumber(meal.nutrients.calories)}</span>
                    <small>kcal</small>
                  </div>
                  <div className="nutrient-pill">
                    <span>{formatNumber(meal.nutrients.protein)}</span>
                    <small>g prot</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="day-summary-compact">
            <div className="summary-item">
              <span className="summary-icon">🔥</span>
              <span className="summary-value">{formatNumber(currentDay.totals.calories)}</span>
              <span className="summary-label">kcal</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🥩</span>
              <span className="summary-value">{formatNumber(currentDay.totals.protein)}</span>
              <span className="summary-label">proteína</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🥗</span>
              <span className="summary-value">{formatNumber(currentDay.totals.fiber)}</span>
              <span className="summary-label">fibra</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">💧</span>
              <span className="summary-value">{formatNumber(currentDay.totals.carbs)}</span>
              <span className="summary-label">carbs</span>
            </div>
          </div>
        </div>
      </section>

      {/* GRÁFICO SIMPLE DE NUTRIENTES */}
      <section className="panel">
        <div className="panel-header">
          <h2>📈 Cobertura de nutrientes</h2>
          <span className="panel-subtitle">Objetivos mensuales</span>
        </div>
        
        <div className="simple-nutrient-grid">
          {plan.nutrientProgress.map((item) => (
            <div key={item.nutrient} className="nutrient-card">
              <div className="nutrient-header">
                <span className="nutrient-name">{nutrientLabels[item.nutrient]}</span>
                <span className={`nutrient-value ${item.percentage >= 90 ? "good" : item.percentage >= 70 ? "ok" : "low"}`}>
                  {Math.round(item.percentage)}%
                </span>
              </div>
              <div className="nutrient-bar">
                <div 
                  className="nutrient-bar-fill" 
                  style={{ 
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: item.percentage >= 90 ? "#10b981" : item.percentage >= 70 ? "#f59e0b" : "#ef4444"
                  }}
                />
              </div>
              <div className="nutrient-detail">
                <span>{formatNumber(item.actual)} / {formatNumber(item.target)} {nutrientUnits[item.nutrient]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPRA Y ENLACES RÁPIDOS */}
      <section className="quick-links">
        <Link to="/compras" className="quick-link-card">
          <span className="link-icon">🛒</span>
          <div className="link-content">
            <strong>Lista de compra</strong>
            <span>{plan.shoppingList.length} grupos · {formatNumber(plan.totalEstimatedCost)}€</span>
          </div>
          <span className="link-arrow">→</span>
        </Link>

        <Link to="/recetas" className="quick-link-card">
          <span className="link-icon">📖</span>
          <div className="link-content">
            <strong>Ver recetas</strong>
            <span>Explora todas las opciones</span>
          </div>
          <span className="link-arrow">→</span>
        </Link>

        <Link to="/calendario" className="quick-link-card">
          <span className="link-icon">📅</span>
          <div className="link-content">
            <strong>Calendario semanal</strong>
            <span>Vista por semanas</span>
          </div>
          <span className="link-arrow">→</span>
        </Link>
      </section>
    </div>
  );
}