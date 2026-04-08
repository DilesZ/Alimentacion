import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../app/usePageMeta";
import { usePlanner } from "../app/PlannerProvider";
import { foodMap, mealLabels } from "../data/catalog";
import { getPageIllustration } from "../lib/media";
import { formatNumber, percentage } from "../lib/nutrition";
import { DayPlan } from "../types";

const mealIcons: Record<string, string> = {
  desayuno: "🌅",
  comida: "☀️",
  merienda: "🟠",
  cena: "🌙"
};

export default function CalendarPage() {
  const { plan } = usePlanner();
  const [calendarDays, setCalendarDays] = useState<DayPlan[]>(plan.days);
  const [weekIndex, setWeekIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  usePageMeta({
    title: "Calendario | Planificador Nutricional Saludable",
    description: "Planificacion semanal con calendario de comidas.",
    keywords: "calendario de comidas, meal planner, planificacion semanal, menu semanal",
    preloadImage: getPageIllustration("calendario")
  });

  useEffect(() => {
    setCalendarDays(plan.days);
    setWeekIndex(0);
  }, [plan.days]);

  const weekCount = Math.ceil(calendarDays.length / 7);
  const visibleWeek = useMemo(() => calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7), [calendarDays, weekIndex]);

  const selectedDayData = selectedDay ? calendarDays.find(d => d.day === selectedDay) : null;

  const weekCalories = visibleWeek.reduce((sum, day) => sum + day.totals.calories, 0);
  const weekProtein = visibleWeek.reduce((sum, day) => sum + day.totals.protein, 0);

  return (
    <div className="page-grid">
      {/* HERO */}
      <section className="hero-section calendar-hero">
        <div className="hero-content">
          <h1>Calendario</h1>
          <p className="hero-subtitle">
            {plan.days.length} días · {weekCount} semanas
          </p>
        </div>
      </section>

      {/* SELECCION DE SEMANA */}
      <section className="week-tabs-container">
        <div className="week-nav">
          <button 
            className="nav-btn" 
            onClick={() => setWeekIndex(v => Math.max(0, v - 1))}
            disabled={weekIndex === 0}
          >
            ◀
          </button>
          
          <div className="week-pills">
            {Array.from({ length: weekCount }, (_, i) => (
              <button
                key={i}
                className={`week-pill ${weekIndex === i ? "active" : ""}`}
                onClick={() => setWeekIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            className="nav-btn" 
            onClick={() => setWeekIndex(v => Math.min(weekCount - 1, v + 1))}
            disabled={weekIndex === weekCount - 1}
          >
            ▶
          </button>
        </div>
      </section>

      {/* RESUMEN DE LA SEMANA */}
      <section className="week-summary">
        <div className="summary-card">
          <span className="summary-icon">🔥</span>
          <div className="summary-content">
            <span className="summary-value">{formatNumber(weekCalories / 7)}</span>
            <span className="summary-label">kcal/día</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">🥩</span>
          <div className="summary-content">
            <span className="summary-value">{formatNumber(weekProtein / 7)}</span>
            <span className="summary-label">g proteína/día</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">📅</span>
          <div className="summary-content">
            <span className="summary-value">Semana {weekIndex + 1}</span>
            <span className="summary-label">Días {visibleWeek[0]?.day} - {visibleWeek[visibleWeek.length - 1]?.day}</span>
          </div>
        </div>
      </section>

      {/* VISTA DE CALENDARIO */}
      <section className="calendar-grid-view">
        {visibleWeek.map((day) => {
          const energyPct = percentage(day.totals.calories, plan.dailyTarget.calories);
          const isSelected = selectedDay === day.day;

          return (
            <div 
              key={day.day} 
              className={`day-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedDay(isSelected ? null : day.day)}
            >
              <div className="day-header">
                <span className="day-num">Día {day.day}</span>
                <span className={`energy-badge ${energyPct >= 90 ? "good" : energyPct >= 70 ? "ok" : "low"}`}>
                  {Math.round(energyPct)}%
                </span>
              </div>

              <div className="day-meals-compact">
                {day.meals.map((meal) => (
                  <div key={meal.mealType} className="meal-row-compact">
                    <span className="meal-icon">{mealIcons[meal.mealType]}</span>
                    <span className="meal-name">{meal.recipe.title.split(" ")[0]}</span>
                    <span className="meal-cal">{formatNumber(meal.nutrients.calories)}</span>
                  </div>
                ))}
              </div>

              <div className="day-totals">
                <span>🔥 {formatNumber(day.totals.calories)} kcal</span>
                <span>🥩 {formatNumber(day.totals.protein)}g</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* DETALLE DEL DÍA SELECCIONADO */}
      {selectedDayData && (
        <section className="day-detail panel">
          <div className="panel-header">
            <h2>📋 Detalle del Día {selectedDayData.day}</h2>
            <button className="close-btn" onClick={() => setSelectedDay(null)}>✕</button>
          </div>

          <div className="day-detail-content">
            {selectedDayData.meals.map((meal) => (
              <div key={meal.mealType} className="detail-meal">
                <div className="detail-meal-header">
                  <span className="detail-meal-icon">{mealIcons[meal.mealType]}</span>
                  <div>
                    <h3>{mealLabels[meal.mealType]}</h3>
                    <span className="detail-time">⏱️ {meal.recipe.preparationMinutes} min</span>
                  </div>
                </div>

                <h4>{meal.recipe.title}</h4>

                <div className="detail-nutrients">
                  <span>🔥 {formatNumber(meal.nutrients.calories)} kcal</span>
                  <span>🥩 {formatNumber(meal.nutrients.protein)}g</span>
                  <span>🥗 {formatNumber(meal.nutrients.fiber)}g fibra</span>
                </div>

                <div className="detail-ingredients">
                  <strong>Ingredientes:</strong>
                  <div className="ing-tags">
                    {meal.scaledIngredients.slice(0, 5).map((ing) => (
                      <span key={ing.foodId} className="ing-tag">
                        {foodMap[ing.foodId]?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}