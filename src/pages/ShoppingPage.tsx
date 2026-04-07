import { useMemo, useState } from "react";
import { usePageMeta } from "../app/usePageMeta";
import { usePlanner } from "../app/PlannerProvider";
import { getPageIllustration } from "../lib/media";
import { formatNumber } from "../lib/nutrition";
import { ShoppingListItem } from "../types";

type CartState = Record<string, number>;

export default function ShoppingPage() {
  const { plan } = usePlanner();
  const [cart, setCart] = useState<CartState>({});
  const budgetTargetPerPerson = 250;

  usePageMeta({
    title: "Compras | Planificador Nutricional Saludable",
    description: "Lista de la compra del plan mensual organizada por secciones y supermercados.",
    keywords: "lista de la compra, compra mensual, mercadona, consum, alimentacion saludable",
    preloadImage: getPageIllustration("compras")
  });

  const flatItems = useMemo(
    () =>
      plan.shoppingList.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          groupLabel: `${group.chain} · ${group.section}`
        }))
      ),
    [plan.shoppingList]
  );

  const cartItems = useMemo(
    () =>
      flatItems
        .filter((item) => (cart[item.foodId] ?? 0) > 0)
        .map((item) => ({
          ...item,
          selectedPacks: cart[item.foodId]
        })),
    [cart, flatItems]
  );

  const cartTotal = cartItems.reduce((sum, item) => sum + item.selectedPacks * (item.estimatedCost / item.packsNeeded), 0);
  const perPersonTotal = plan.input.people > 0 ? plan.totalEstimatedCost / plan.input.people : plan.totalEstimatedCost;
  const budgetOk = perPersonTotal <= budgetTargetPerPerson;

  const updateCart = (item: ShoppingListItem, delta: number) => {
    setCart((current) => {
      const nextValue = Math.max(0, (current[item.foodId] ?? 0) + delta);
      return { ...current, [item.foodId]: nextValue };
    });
  };

  return (
    <div className="page-grid shopping-layout">
      <section className="page-hero panel">
        <div>
          <p className="eyebrow">Lista de compra</p>
          <h1>Compra mensual organizada</h1>
          <p className="hero-copy">
            Lista de la compra basada en el plan generado. Organizada por supermercados y secciones para facilitar la compra en Mercadona o Consum de Paiporta.
          </p>
          <div className="info-inline">
            <span>{flatItems.length} referencias</span>
            <span>{formatNumber(plan.totalEstimatedCost)} EUR</span>
            <span>{plan.input.people} personas</span>
          </div>
        </div>
        <img
          className="hero-image"
          src={getPageIllustration("compras")}
          alt="Ilustracion de la compra mensual"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </section>

      <section className="summary-grid">
        <article className="stat-card">
          <span>Total mensual</span>
          <strong>{formatNumber(plan.totalEstimatedCost)} EUR</strong>
          <small>Coste estimado del plan</small>
        </article>
        <article className="stat-card">
          <span>Por persona</span>
          <strong>{formatNumber(perPersonTotal)} EUR</strong>
          <small>{budgetOk ? "Dentro del objetivo" : "Por encima del objetivo"}</small>
        </article>
        <article className="stat-card">
          <span>Grupos</span>
          <strong>{plan.shoppingList.length}</strong>
          <small>Por supermercado y seccion</small>
        </article>
        <article className="stat-card">
          <span>Semanas</span>
          <strong>{plan.weeklyShopping.length}</strong>
          <small>Division semanal</small>
        </article>
      </section>

      <section className="shopping-two-column">
        <div className="shopping-column">
          <section className="panel">
            <div className="panel-header">
              <h2>Compra por semanas</h2>
            </div>
            <div className="stack-list">
              {plan.weeklyShopping.map((week) => (
                <article key={`week-${week.week}`} className="stack-card">
                  <strong>
                    Semana {week.week} · Dias {week.startDay}-{week.endDay}
                  </strong>
                  <span>{formatNumber(week.estimatedCost)} EUR</span>
                  <span>Ingredientes clave: {week.reuseHighlights.join(", ")}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Catalogo completo</h2>
            </div>

            <div className="shopping-catalog">
              {plan.weeklyShopping.map((week) => (
                <article key={`catalog-week-${week.week}`} className="stack-card">
                  <h3>
                    Semana {week.week} · {formatNumber(week.estimatedCost)} EUR
                  </h3>
                  <div className="shopping-catalog">
                    {week.shoppingList.map((group) => (
                      <article key={`week-${week.week}-${group.chain}-${group.section}`} className="shopping-group">
                        <h3>
                          {group.chain} · {group.section}
                        </h3>
                        <ul className="shopping-product-list">
                          {group.items.map((item) => (
                            <li key={`week-${week.week}-${group.chain}-${item.foodId}`} className="shopping-product-item">
                              <div>
                                <strong>{item.productName}</strong>
                                <span>{formatNumber(item.gramsNeeded)} g · {item.packsNeeded} envases</span>
                                <span>{formatNumber(item.estimatedCost)} EUR · {item.availability}</span>
                                <span>Alternativas: {item.alternatives.join(", ") || "Sin alternativa"}</span>
                              </div>
                              <div className="cart-controls">
                                <button className="secondary-button" onClick={() => updateCart(item, -1)}>
                                  -
                                </button>
                                <strong>{cart[item.foodId] ?? 0}</strong>
                                <button className="secondary-button" onClick={() => updateCart(item, 1)}>
                                  +
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="shopping-column sticky-column">
          <section className="panel">
            <div className="panel-header">
              <h2>Resumen</h2>
            </div>

            {cartItems.length === 0 ? (
              <p className="helper-text">Usa los controles +/- para seleccionar productos.</p>
            ) : (
              <div className="cart-summary">
                {cartItems.map((item) => (
                  <article key={`cart-${item.foodId}`} className="cart-line">
                    <div>
                      <strong>{item.productName}</strong>
                      <span>{item.groupLabel}</span>
                      <span>{item.selectedPacks} envases</span>
                    </div>
                    <strong>{formatNumber(item.selectedPacks * (item.estimatedCost / item.packsNeeded))} EUR</strong>
                  </article>
                ))}
              </div>
            )}

            <div className="checkout-total">
              <span>Total seleccionado</span>
              <strong>{formatNumber(cartTotal)} EUR</strong>
            </div>

            <div className={budgetOk ? "checkout-success" : "budget-warning"}>
              <strong>{budgetOk ? "Dentro de presupuesto" : "Presupuesto ajustado"}</strong>
              <p>
                {budgetOk
                  ? `El plan queda en ${formatNumber(perPersonTotal)} EUR por persona.`
                  : `El plan sube a ${formatNumber(perPersonTotal)} EUR por persona.`}
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}