import { useMemo, useState } from "react";
import { foodMap } from "../data/catalog";
import { usePageMeta } from "../app/usePageMeta";
import { usePlanner } from "../app/PlannerProvider";
import { useUserPreferences } from "../app/UserPreferencesProvider";
import { getPageIllustration } from "../lib/media";
import { formatNumber } from "../lib/nutrition";
import { ShoppingListItem } from "../types";

type CartState = Record<string, number>;

export default function ShoppingPage() {
  const { plan } = usePlanner();
  const { clearManualShoppingList, manualShoppingList, removeManualShoppingItem } = useUserPreferences();
  const [cart, setCart] = useState<CartState>({});
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const budgetTargetPerPerson = 250;
  const [checkoutData, setCheckoutData] = useState({
    customerName: "",
    email: "",
    address: "",
    notes: ""
  });

  usePageMeta({
    title: "Compras | Planificador Nutricional Saludable",
    description:
      "Gestiona la lista de la compra del plan mensual con carrito, resumen por secciones y checkout final.",
    keywords: "lista de la compra, carrito, checkout, compra saludable, mercadona, consum",
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

  const manualItems = useMemo(() => {
    return Object.entries(manualShoppingList).map(([foodId, gramsNeeded]) => {
      const food = foodMap[foodId];
      const chosenProduct = [...food.supermarkets].sort(
        (left, right) => left.price / left.packSizeGrams - right.price / right.packSizeGrams
      )[0];
      const packsNeeded = Math.max(1, Math.ceil(gramsNeeded / chosenProduct.packSizeGrams));
      const estimatedCost = Math.round(packsNeeded * chosenProduct.price * 100) / 100;

      return {
        foodId,
        productName: food.name,
        chain: chosenProduct.chain,
        section: chosenProduct.section,
        gramsNeeded,
        packsNeeded,
        estimatedCost,
        availability: chosenProduct.availability,
        alternatives: food.alternativeIds.map((id) => foodMap[id]?.name).filter(Boolean)
      } satisfies ShoppingListItem;
    });
  }, [manualShoppingList]);

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
  const manualShoppingTotal = manualItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const combinedEstimatedTotal = plan.totalEstimatedCost + manualShoppingTotal;
  const perPersonTotal = plan.input.people > 0 ? combinedEstimatedTotal / plan.input.people : combinedEstimatedTotal;
  const budgetOk = perPersonTotal <= budgetTargetPerPerson;

  const updateCart = (item: ShoppingListItem, delta: number) => {
    setCart((current) => {
      const nextValue = Math.max(0, (current[item.foodId] ?? 0) + delta);
      return { ...current, [item.foodId]: nextValue };
    });
  };

  const handleCheckout = () => {
    if (!checkoutData.customerName || !checkoutData.email || !checkoutData.address || cartItems.length === 0) {
      return;
    }

    setCheckoutComplete(true);
  };

  return (
    <div className="page-grid shopping-layout">
      <section className="page-hero panel">
        <div>
          <p className="eyebrow">Gestion de compras</p>
          <h1>Compra mensual organizada por semanas</h1>
          <p className="hero-copy">
            Combina la compra del plan con ingredientes añadidos desde recetas, controla el presupuesto por persona y
            reutiliza ingredientes clave para reducir desperdicio durante todo el mes.
          </p>
          <div className="info-inline">
            <span>{flatItems.length} referencias</span>
            <span>{manualItems.length} extras desde recetas</span>
            <span>{formatNumber(combinedEstimatedTotal)} EUR estimados</span>
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
          <span>Total plan mensual</span>
          <strong>{formatNumber(plan.totalEstimatedCost)} EUR</strong>
          <small>{plan.shoppingList.length} grupos organizados</small>
        </article>
        <article className="stat-card">
          <span>Lista inteligente</span>
          <strong>{formatNumber(manualShoppingTotal)} EUR</strong>
          <small>Ingredientes enviados desde recetas</small>
        </article>
        <article className="stat-card">
          <span>Coste por persona</span>
          <strong>{formatNumber(perPersonTotal)} EUR</strong>
          <small>{budgetOk ? "Dentro del objetivo de 250 EUR" : "Requiere ajuste"}</small>
        </article>
        <article className="stat-card">
          <span>Objetivo mensual</span>
          <strong>{formatNumber(budgetTargetPerPerson)} EUR</strong>
          <small>Presupuesto maximo mensual por persona</small>
        </article>
      </section>

      <section className="shopping-two-column">
        <div className="shopping-column">
          <section className="panel">
            <div className="panel-header">
              <h2>Compra semanal detallada</h2>
            </div>
            <div className="stack-list">
              {plan.weeklyShopping.map((week) => (
                <article key={`week-${week.week}`} className="stack-card">
                  <strong>
                    Semana {week.week} · Dias {week.startDay}-{week.endDay}
                  </strong>
                  <span>{formatNumber(week.estimatedCost)} EUR estimados</span>
                  <span>Ingredientes clave: {week.reuseHighlights.join(", ")}</span>
                  <span>{week.wasteTips[0]}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Lista inteligente desde recetas</h2>
              {manualItems.length > 0 ? (
                <button className="secondary-button" onClick={clearManualShoppingList}>
                  Vaciar lista
                </button>
              ) : null}
            </div>

            {manualItems.length === 0 ? (
              <p className="helper-text">
                Añade ingredientes desde la vista de recetas para generar una compra rapida centrada en platos
                favoritos o descargados.
              </p>
            ) : (
              <div className="stack-list">
                {manualItems.map((item) => (
                  <article key={`manual-${item.foodId}`} className="stack-card">
                    <div className="shopping-product-item">
                      <div>
                        <strong>{item.productName}</strong>
                        <span>{formatNumber(item.gramsNeeded)} g recomendados</span>
                        <span>
                          {item.chain} · {item.section} · {formatNumber(item.estimatedCost)} EUR
                        </span>
                        <span>Alternativas: {item.alternatives.join(", ") || "Sin alternativa"}</span>
                      </div>
                      <button className="secondary-button" onClick={() => removeManualShoppingItem(item.foodId)}>
                        Quitar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Catalogo de compra</h2>
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
                                <span>{formatNumber(item.gramsNeeded)} g · {item.packsNeeded} envases base</span>
                                <span>{formatNumber(item.estimatedCost)} EUR estimados · disponibilidad {item.availability}</span>
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
              <h2>Carrito y presupuesto</h2>
            </div>

            {cartItems.length === 0 ? (
              <p className="helper-text">Anade productos desde el catalogo para preparar la compra o el pedido final.</p>
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
              <span>Total carrito</span>
              <strong>{formatNumber(cartTotal)} EUR</strong>
            </div>

            <div className={budgetOk ? "checkout-success" : "budget-warning"}>
              <strong>{budgetOk ? "Presupuesto controlado" : "Presupuesto ajustado"}</strong>
              <p>
                {budgetOk
                  ? `La compra combinada queda en ${formatNumber(perPersonTotal)} EUR por persona.`
                  : `La compra combinada sube a ${formatNumber(perPersonTotal)} EUR por persona; conviene sustituir productos o reducir extras.`}
              </p>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Checkout</h2>
            </div>

            <div className="checkout-form">
              <label>
                Nombre
                <input
                  type="text"
                  value={checkoutData.customerName}
                  onChange={(event) => setCheckoutData((current) => ({ ...current, customerName: event.target.value }))}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={checkoutData.email}
                  onChange={(event) => setCheckoutData((current) => ({ ...current, email: event.target.value }))}
                />
              </label>

              <label>
                Direccion de entrega
                <textarea
                  value={checkoutData.address}
                  onChange={(event) => setCheckoutData((current) => ({ ...current, address: event.target.value }))}
                />
              </label>

              <label>
                Notas
                <textarea
                  value={checkoutData.notes}
                  onChange={(event) => setCheckoutData((current) => ({ ...current, notes: event.target.value }))}
                />
              </label>

              <button className="primary-button" onClick={handleCheckout}>
                Finalizar checkout
              </button>

              {checkoutComplete ? (
                <div className="checkout-success">
                  <strong>Pedido preparado</strong>
                  <p>
                    Checkout completado para {checkoutData.customerName}. Se ha generado un resumen listo para procesar
                    manualmente en tienda o reparto.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
