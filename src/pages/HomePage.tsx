import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { budgetStatusLabel, preferenceOptions, usePlanner } from "../app/PlannerProvider";
import { usePageMeta } from "../app/usePageMeta";
import { foodMap, mealLabels } from "../data/catalog";
import { summarizeChainSpend, summarizeDailyCoverage } from "../lib/generator";
import { getPageIllustration } from "../lib/media";
import { formatNumber, nutrientLabels, nutrientUnits, percentage } from "../lib/nutrition";

export default function HomePage() {
  const { allergyInput, error, formState, generatePlan, plan, setAllergyInput, setFormState } = usePlanner();
  const [selectedDay, setSelectedDay] = useState(1);

  usePageMeta({
    title: "Inicio | Planificador Nutricional Saludable",
    description:
      "Resumen nutricional, configuracion del plan mensual y panel principal de planificacion alimentaria saludable.",
    keywords: "planificador nutricional, menu mensual, resumen nutricional, dieta saludable, paiporta",
    preloadImage: getPageIllustration("inicio")
  });

  const currentDay = useMemo(() => plan.days.find((day) => day.day === selectedDay) ?? plan.days[0], [plan, selectedDay]);
  const coverageChart = useMemo(() => summarizeDailyCoverage(plan.days, plan.dailyTarget), [plan]);
  const chainSpend = useMemo(() => summarizeChainSpend(plan.shoppingList), [plan]);

  const dayIngredientAvailability = Array.from(
    new Map(
      currentDay.meals
        .flatMap((meal) => meal.scaledIngredients)
        .map((ingredient) => [ingredient.foodId, ingredient])
    ).values()
  ).map((ingredient) => ({
    food: foodMap[ingredient.foodId],
    grams: ingredient.grams
  }));

  return (
    <div className="page-grid">
      <section className="page-hero panel page-hero-home">
        <div>
          <p className="eyebrow">Panel principal</p>
          <h1>Plan mensual, nutricion y compra en vistas especializadas</h1>
          <p className="hero-copy">
            Configura tu plan, revisa el estado nutricional general y navega después a recetas, calendario o compras
            desde el menú principal.
          </p>
        </div>
        <img
          className="hero-image"
          src={getPageIllustration("inicio")}
          alt="Resumen visual del planificador nutricional"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </section>

      <section className="panel form-panel">
        <div className="panel-header">
          <h2>Parametros del plan</h2>
          <button className="primary-button" onClick={generatePlan}>
            Generar plan
          </button>
        </div>

        <div className="form-grid">
          <label>
            Personas
            <input
              type="number"
              min={1}
              max={8}
              value={formState.people}
              onChange={(event) => setFormState((current) => ({ ...current, people: Number(event.target.value) || 1 }))}
            />
          </label>

          <label>
            Dias del mes
            <select
              value={formState.days}
              onChange={(event) =>
                setFormState((current) => ({ ...current, days: Number(event.target.value) as 30 | 31 }))
              }
            >
              <option value={30}>30</option>
              <option value={31}>31</option>
            </select>
          </label>

          <label>
            Presupuesto maximo mensual
            <input
              type="number"
              min={80}
              step={10}
              value={formState.monthlyBudget}
              onChange={(event) =>
                setFormState((current) => ({ ...current, monthlyBudget: Number(event.target.value) || 0 }))
              }
            />
          </label>

          <label>
            Alergias separadas por comas
            <input
              type="text"
              placeholder="gluten, soja, pescado"
              value={allergyInput}
              onChange={(event) => setAllergyInput(event.target.value)}
            />
          </label>
        </div>

        <div className="toggle-grid">
          <label className="check-row">
            <input
              type="checkbox"
              checked={formState.restrictions.vegetarian}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  restrictions: {
                    ...current.restrictions,
                    vegetarian: event.target.checked,
                    vegan: event.target.checked ? current.restrictions.vegan : false
                  }
                }))
              }
            />
            Vegetariano
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={formState.restrictions.vegan}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  restrictions: {
                    ...current.restrictions,
                    vegan: event.target.checked,
                    vegetarian: event.target.checked ? true : current.restrictions.vegetarian
                  }
                }))
              }
            />
            Vegano
          </label>

          <label className="check-row">
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
            Sin gluten
          </label>
        </div>

        <div className="preference-list">
          {preferenceOptions.map((option) => {
            const selected = formState.preferences.includes(option);
            return (
              <button
                key={option}
                className={selected ? "chip chip-active" : "chip"}
                onClick={() =>
                  setFormState((current) => ({
                    ...current,
                    preferences: selected
                      ? current.preferences.filter((value) => value !== option)
                      : [...current.preferences, option]
                  }))
                }
              >
                {option}
              </button>
            );
          })}
        </div>

        {error ? <p className="error-text">{error}</p> : null}
      </section>

      <section className="summary-grid">
        <article className="stat-card">
          <span>Coste estimado</span>
          <strong>{formatNumber(plan.totalEstimatedCost)} EUR</strong>
          <small>{budgetStatusLabel[plan.budgetStatus]}</small>
        </article>
        <article className="stat-card">
          <span>Validacion mensual</span>
          <strong>
            {Math.round(
              plan.nutrientProgress.reduce((sum, item) => sum + Math.min(item.percentage, 100), 0) /
                plan.nutrientProgress.length
            )}
            %
          </strong>
          <small>Cobertura media de objetivos</small>
        </article>
        <article className="stat-card">
          <span>Energia diaria media</span>
          <strong>{formatNumber(plan.monthlyTotals.calories / plan.input.days)} kcal</strong>
          <small>{plan.input.people} personas</small>
        </article>
        <article className="stat-card">
          <span>Compra mensual</span>
          <strong>{plan.shoppingList.reduce((sum, group) => sum + group.items.length, 0)} referencias</strong>
          <small>Organizadas por supermercado y seccion</small>
        </article>
      </section>

      <section className="panel charts-panel">
        <div className="panel-header">
          <h2>Informe nutricional mensual</h2>
        </div>
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Cobertura por dia</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={coverageChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" hide />
                <YAxis domain={[60, 180]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energia" stroke="#0f766e" strokeWidth={2} />
                <Line type="monotone" dataKey="proteinas" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="micronutrientes" stroke="#ea580c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Distribucion de gasto</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={chainSpend} dataKey="cost" nameKey="chain" outerRadius={90} fill="#0f766e" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card full-width">
            <h3>Objetivos mensuales por nutriente</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={plan.nutrientProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nutrient"
                  tickFormatter={(value) => nutrientLabels[value as keyof typeof nutrientLabels]}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "percentage") {
                      return [`${formatNumber(value)} %`, "Cobertura"];
                    }

                    return [`${formatNumber(value)}`, name];
                  }}
                />
                <Legend />
                <Bar dataKey="percentage" name="Cobertura %" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Validacion de nutrientes</h2>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nutriente</th>
                <th>Objetivo mensual</th>
                <th>Planificado</th>
                <th>Cobertura</th>
              </tr>
            </thead>
            <tbody>
              {plan.nutrientProgress.map((item) => (
                <tr key={item.nutrient}>
                  <td>{nutrientLabels[item.nutrient]}</td>
                  <td>
                    {formatNumber(item.target)} {nutrientUnits[item.nutrient]}
                  </td>
                  <td>
                    {formatNumber(item.actual)} {nutrientUnits[item.nutrient]}
                  </td>
                  <td className={item.percentage >= 100 ? "success-text" : "warning-text"}>
                    {formatNumber(item.percentage)} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Resumen del dia</h2>
          <select value={selectedDay} onChange={(event) => setSelectedDay(Number(event.target.value))}>
            {plan.days.map((day) => (
              <option key={day.day} value={day.day}>
                Dia {day.day}
              </option>
            ))}
          </select>
        </div>

        <div className="calendar-grid compact-grid">
          {plan.days.map((day) => {
            const selected = day.day === selectedDay;
            const energyCoverage = percentage(day.totals.calories, plan.dailyTarget.calories);

            return (
              <button
                key={day.day}
                className={selected ? "calendar-day active-day" : "calendar-day"}
                onClick={() => setSelectedDay(day.day)}
              >
                <strong>Dia {day.day}</strong>
                <span>{energyCoverage}% energia</span>
              </button>
            );
          })}
        </div>

        <div className="day-summary">
          <article className="day-stat">
            <span>Energia</span>
            <strong>{formatNumber(currentDay.totals.calories)} kcal</strong>
          </article>
          <article className="day-stat">
            <span>Proteinas</span>
            <strong>{formatNumber(currentDay.totals.protein)} g</strong>
          </article>
          <article className="day-stat">
            <span>Fibra</span>
            <strong>{formatNumber(currentDay.totals.fiber)} g</strong>
          </article>
          <article className="day-stat">
            <span>Micronutrientes</span>
            <strong>
              {Math.round(
                plan.nutrientProgress
                  .filter((item) => item.nutrient !== "calories")
                  .reduce((sum, item) => sum + Math.min(item.percentage, 100), 0) / 14
              )}
              %
            </strong>
          </article>
        </div>

        <div className="meal-grid">
          {currentDay.meals.map((meal) => (
            <article key={`${currentDay.day}-${meal.mealType}`} className="meal-card">
              <div className="meal-card-header">
                <div>
                  <span className="meal-type">{mealLabels[meal.mealType]}</span>
                  <h3>{meal.recipe.title}</h3>
                </div>
                <span>{meal.recipe.preparationMinutes} min</span>
              </div>

              <p className="meal-meta">
                Cocina {meal.recipe.cuisine} · Dificultad {meal.recipe.difficulty}
              </p>

              <div className="meal-columns">
                <div>
                  <h4>Ingredientes</h4>
                  <ul>
                    {meal.scaledIngredients.map((ingredient) => (
                      <li key={`${meal.recipe.id}-${ingredient.foodId}`}>
                        {foodMap[ingredient.foodId].name}: {formatNumber(ingredient.grams)} g
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Preparacion</h4>
                  <ol>
                    {meal.recipe.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Disponibilidad del dia {currentDay.day}</h2>
        </div>

        <div className="availability-grid">
          {dayIngredientAvailability.map(({ food, grams }) => (
            <article key={food.id} className="availability-card">
              <h3>{food.name}</h3>
              <p>{formatNumber(grams)} g previstos para el dia seleccionado.</p>
              {food.supermarkets.map((store) => (
                <div key={`${food.id}-${store.chain}`} className="store-box">
                  <strong>{store.chain}</strong>
                  <span>{store.storeLabel}</span>
                  <span>Seccion: {store.section}</span>
                  <span>
                    Precio: {formatNumber(store.price)} EUR por {store.packSizeGrams} g
                  </span>
                  <span>Disponibilidad: {store.availability}</span>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
