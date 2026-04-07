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
  const [checkoutComplete, setCheckoutComplete] = useState(false);
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
          <h1>Carrito, preparacion de pedido y checkout del plan mensual</h1>
          <p className="hero-copy">
            Convierte la lista agrupada por secciones en un carrito flexible, ajusta envases y prepara la compra final
            sin salir de la app.
          </p>
          <div className="info-inline">
            <span>{flatItems.length} referencias</span>
            <span>{plan.shoppingList.length} grupos</span>
            <span>{formatNumber(plan.totalEstimatedCost)} EUR estimados</span>
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

      <section className="shopping-two-column">
        <div className="shopping-column">
          <section className="panel">
            <div className="panel-header">
              <h2>Catalogo de compra</h2>
            </div>

            <div className="shopping-catalog">
              {plan.shoppingList.map((group) => (
                <article key={`${group.chain}-${group.section}`} className="shopping-group">
                  <h3>
                    {group.chain} · {group.section}
                  </h3>
                  <ul className="shopping-product-list">
                    {group.items.map((item) => (
                      <li key={`${group.chain}-${item.foodId}`} className="shopping-product-item">
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
          </section>
        </div>

        <div className="shopping-column sticky-column">
          <section className="panel">
            <div className="panel-header">
              <h2>Carrito</h2>
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
