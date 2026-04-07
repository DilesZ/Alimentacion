import { useEffect, useMemo, useState } from "react";
import { usePageMeta } from "../app/usePageMeta";
import { usePlanner } from "../app/PlannerProvider";
import { mealLabels } from "../data/catalog";
import { getPageIllustration } from "../lib/media";
import { formatNumber, percentage } from "../lib/nutrition";
import { DayPlan, MealType } from "../types";

type DragPayload = {
  dayNumber: number;
  mealType: MealType;
};

export default function CalendarPage() {
  const { plan } = usePlanner();
  const [calendarDays, setCalendarDays] = useState<DayPlan[]>(plan.days);
  const [weekIndex, setWeekIndex] = useState(0);
  const [dragPayload, setDragPayload] = useState<DragPayload | null>(null);
  const mealOrder = useMemo<MealType[]>(() => plan.days[0]?.meals.map((meal) => meal.mealType) ?? [], [plan.days]);

  usePageMeta({
    title: "Calendario | Planificador Nutricional Saludable",
    description:
      "Planificacion semanal con calendario de comidas, reorganizacion por semanas y arrastrar y soltar entre dias.",
    keywords: "calendario de comidas, meal planner, planificacion semanal, drag and drop, menu semanal",
    preloadImage: getPageIllustration("calendario")
  });

  useEffect(() => {
    setCalendarDays(plan.days);
    setWeekIndex(0);
  }, [plan.days]);

  const weekCount = Math.ceil(calendarDays.length / 7);
  const visibleWeek = useMemo(() => calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7), [calendarDays, weekIndex]);

  const swapMeals = (source: DragPayload, target: DragPayload) => {
    if (source.dayNumber === target.dayNumber || source.mealType !== target.mealType) {
      return;
    }

    setCalendarDays((current) =>
      current.map((day) => {
        if (day.day !== source.dayNumber && day.day !== target.dayNumber) {
          return day;
        }

        const nextMeals = day.meals.map((meal) => ({ ...meal, notes: [...meal.notes], scaledIngredients: [...meal.scaledIngredients] }));

        if (day.day === source.dayNumber) {
          const sourceMealIndex = nextMeals.findIndex((meal) => meal.mealType === source.mealType);
          const targetDay = current.find((item) => item.day === target.dayNumber)!;
          const replacement = targetDay.meals.find((meal) => meal.mealType === target.mealType)!;
          nextMeals[sourceMealIndex] = { ...replacement, notes: [...replacement.notes], scaledIngredients: [...replacement.scaledIngredients] };
        }

        if (day.day === target.dayNumber) {
          const targetMealIndex = nextMeals.findIndex((meal) => meal.mealType === target.mealType);
          const sourceDay = current.find((item) => item.day === source.dayNumber)!;
          const replacement = sourceDay.meals.find((meal) => meal.mealType === source.mealType)!;
          nextMeals[targetMealIndex] = { ...replacement, notes: [...replacement.notes], scaledIngredients: [...replacement.scaledIngredients] };
        }

        return { ...day, meals: nextMeals };
      })
    );
  };

  return (
    <div className="page-grid">
      <section className="page-hero panel">
        <div>
          <p className="eyebrow">Calendario de comidas</p>
          <h1>Planificacion semanal de desayunos, comidas y cenas</h1>
          <p className="hero-copy">
            Reorganiza el plan mensual por semanas para equilibrar repeticiones, aprovechar compras y mantener variedad sin regenerar todo el mes.
          </p>
          <div className="info-inline">
            <span>{weekCount} semanas visibles</span>
            <span>{plan.days.length} días planificados</span>
            <span>{mealOrder.length} bloques diarios</span>
          </div>
        </div>
        <img
          className="hero-image"
          src={getPageIllustration("calendario")}
          alt="Ilustracion del calendario de comidas"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Vista semanal</h2>
          <div className="week-controls">
            <button className="secondary-button" onClick={() => setWeekIndex((value) => Math.max(0, value - 1))}>
              Semana anterior
            </button>
            <strong>
              Semana {weekIndex + 1} de {weekCount}
            </strong>
            <button
              className="secondary-button"
              onClick={() => setWeekIndex((value) => Math.min(weekCount - 1, value + 1))}
            >
              Semana siguiente
            </button>
          </div>
        </div>

        <p className="helper-text">
          Arrastra una tarjeta y suéltala sobre otra del mismo bloque horario para intercambiar ambas comidas entre
          días.
        </p>

        <div className="weekly-board">
          {visibleWeek.map((day) => (
            <article key={day.day} className="week-day-column">
              <header className="week-day-header">
                <strong>Dia {day.day}</strong>
                <span>{percentage(day.totals.calories, plan.dailyTarget.calories)}% energia</span>
                <span>{formatNumber(day.totals.protein)} g proteina</span>
              </header>

              <div className="week-meals">
                {mealOrder.map((mealType) => {
                  const meal = day.meals.find((item) => item.mealType === mealType)!;
                  const isDragging =
                    dragPayload?.dayNumber === day.day && dragPayload.mealType === mealType;

                  return (
                    <section
                      key={`${day.day}-${mealType}`}
                      className={isDragging ? "week-slot week-slot-dragging" : "week-slot"}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (dragPayload) {
                          swapMeals(dragPayload, { dayNumber: day.day, mealType });
                          setDragPayload(null);
                        }
                      }}
                    >
                      <span className="meal-type">{mealLabels[mealType]}</span>
                      <article
                        className="draggable-meal"
                        draggable
                        onDragStart={() => setDragPayload({ dayNumber: day.day, mealType })}
                        onDragEnd={() => setDragPayload(null)}
                      >
                        <strong>{meal.recipe.title}</strong>
                        <small>{meal.recipe.preparationMinutes} min</small>
                        <p>{formatNumber(meal.nutrients.calories)} kcal</p>
                        <div className="tag-list">
                          {meal.recipe.tags.slice(0, 3).map((tag) => (
                            <span key={`${meal.recipe.id}-${tag}`} className="chip chip-static">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    </section>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
