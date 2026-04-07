import { useMemo, useState } from "react";
import { usePageMeta } from "../app/usePageMeta";
import { usePlanner } from "../app/PlannerProvider";
import { getPageIllustration } from "../lib/media";
import { formatNumber } from "../lib/nutrition";

type CartState = Record<string, number>;

export default function ShoppingPage() {
  const { plan } = usePlanner();
  const [cart, setCart] = useState<CartState>({});
  const [selectedWeek, setSelectedWeek] = useState(1);

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
  const budgetOk = perPersonTotal <= 250;

  const currentWeek = plan.weeklyShopping.find(w => w.week === selectedWeek) || plan.weeklyShopping[0];

  const updateCart = (item: { foodId: string; estimatedCost: number; packsNeeded: number }, delta: number) => {
    setCart((current) => {
      const nextValue = Math.max(0, (current[item.foodId] ?? 0) + delta);
      return { ...current, [item.foodId]: nextValue };
    });
  };

  const totalSelected = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="page-grid">
      {/* HERO */}
      <section className="hero-section shopping-hero">
        <div className="hero-content">
          <h1>Lista de Compras</h1>
          <p className="hero-subtitle">
            {flatItems.length} productos · {formatNumber(plan.totalEstimatedCost)}€ total
          </p>
        </div>
      </section>

      {/* RESUMEN RÁPIDO */}
      <section className="quick-stats">
        <div className="stat-card-large stat-cost">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{formatNumber(plan.totalEstimatedCost)}€</span>
            <span className="stat-label">Total mes</span>
          </div>
        </div>
        <div className="stat-card-large stat-perperson">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <span className="stat-value">{formatNumber(perPersonTotal)}€</span>
            <span className="stat-label">Por persona</span>
          </div>
          <span className={`stat-badge ${budgetOk ? "dentro" : "ajustado"}`}>
            {budgetOk ? "✅ Dentro" : "⚠️ Ajustado"}
          </span>
        </div>
        <div className="stat-card-large stat-products">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">{plan.shoppingList.length}</span>
            <span className="stat-label">grupos</span>
          </div>
        </div>
        <div className="stat-card-large stat-weeks">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">{plan.weeklyShopping.length}</span>
            <span className="stat-label">semanas</span>
          </div>
        </div>
      </section>

      {/* SELECTOR DE SEMANA */}
      <section className="week-selector panel">
        <div className="week-tabs">
          {plan.weeklyShopping.map((week) => (
            <button
              key={week.week}
              className={`week-tab ${selectedWeek === week.week ? "active" : ""}`}
              onClick={() => setSelectedWeek(week.week)}
            >
              <span className="week-num">Semana {week.week}</span>
              <span className="week-cost">{formatNumber(week.estimatedCost)}€</span>
            </button>
          ))}
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="shopping-content">
        {/* LISTA DE COMPRA POR SECCIONES */}
        <section className="shopping-list panel">
          <h2>🛒 Lista de compra - Semana {selectedWeek}</h2>
          
          {currentWeek.shoppingList.map((group) => (
            <div key={`${group.chain}-${group.section}`} className="shopping-section">
              <div className="section-header">
                <span className="section-chain">{group.chain === "Mercadona" ? "🏪" : "🏬"} {group.chain}</span>
                <span className="section-name">{group.section}</span>
              </div>
              
              <div className="section-items">
                {group.items.map((item) => {
                  const productUrl = item.chain === "Mercadona" 
                    ? `https://www.mercadona.es/catalog/search?term=${encodeURIComponent(item.productName)}`
                    : `https://www.consum.es/catalog/search?q=${encodeURIComponent(item.productName)}`;
                  
                  return (
                    <div key={item.foodId} className="shopping-item">
                      <div className="item-info">
                        <a 
                          href={productUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="item-name item-link"
                        >
                          {item.productName} ↗
                        </a>
                        <span className="item-details">
                          {formatNumber(item.gramsNeeded)}g · {item.packsNeeded} {item.packsNeeded === 1 ? "envase" : "envases"} · {formatNumber(item.estimatedCost)}€
                        </span>
                      </div>
                      <div className="item-controls">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateCart(item, -1)}
                          disabled={(cart[item.foodId] ?? 0) === 0}
                        >
                          −
                        </button>
                        <span className="qty-value">{cart[item.foodId] ?? 0}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateCart(item, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* RESUMEN LATERAL */}
        <aside className="shopping-summary panel">
          <h3>📋 Resumen</h3>
          
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="summary-label">Productos seleccionados</span>
              <span className="summary-value">{totalSelected}</span>
            </div>
            <div className="summary-stat highlight">
              <span className="summary-label">Total seleccionado</span>
              <span className="summary-value">{formatNumber(cartTotal)}€</span>
            </div>
          </div>

          {cartItems.length > 0 && (
            <div className="cart-items-list">
              <h4>En tu carrito:</h4>
              {cartItems.map((item) => (
                <div key={item.foodId} className="cart-item-line">
                  <span>{item.productName}</span>
                  <span className="cart-qty">x{item.selectedPacks}</span>
                  <span className="cart-price">{formatNumber(item.selectedPacks * (item.estimatedCost / item.packsNeeded))}€</span>
                </div>
              ))}
            </div>
          )}

          <div className="budget-indicator">
            <div className="budget-bar">
              <div 
                className="budget-fill" 
                style={{ width: `${Math.min((perPersonTotal / 250) * 100, 100)}%` }}
              />
            </div>
            <span className="budget-text">
              {perPersonTotal}€ / 250€ objetivo por persona
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}