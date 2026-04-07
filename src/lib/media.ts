import { Recipe } from "../types";

const colors: Record<string, [string, string]> = {
  desayuno: ["#0f766e", "#2dd4bf"],
  media_manana: ["#2563eb", "#60a5fa"],
  comida: ["#ea580c", "#fb923c"],
  merienda: ["#7c3aed", "#a78bfa"],
  cena: ["#1d4ed8", "#38bdf8"],
  compras: ["#0f766e", "#14b8a6"],
  recetas: ["#9333ea", "#c084fc"],
  calendario: ["#ea580c", "#fdba74"],
    inicio: ["#0f766e", "#38bdf8"],
    dashboard: ["#4f46e5", "#22c55e"]
};

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const buildIllustration = (title: string, subtitle: string, accentKey: string) => {
  const [primary, secondary] = colors[accentKey] ?? colors.inicio;

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${secondary}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="720" rx="40" fill="url(#bg)" />
      <circle cx="1020" cy="120" r="84" fill="rgba(255,255,255,0.18)" />
      <circle cx="180" cy="600" r="120" fill="rgba(255,255,255,0.12)" />
      <rect x="90" y="108" width="1020" height="504" rx="32" fill="rgba(255,255,255,0.14)" />
      <text x="120" y="250" font-size="72" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${title}</text>
      <text x="120" y="332" font-size="34" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.92)">${subtitle}</text>
      <text x="120" y="560" font-size="26" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.85)">Planificador Nutricional Saludable</text>
    </svg>
  `);
};

export const getPageIllustration = (page: "inicio" | "recetas" | "calendario" | "compras" | "dashboard") =>
  ({
    inicio: buildIllustration("Planifica tu mes", "Resumen nutricional, recetas y compras en un solo flujo.", "inicio"),
    recetas: buildIllustration("Biblioteca de recetas", "Busqueda rapida, filtros y detalle nutricional.", "recetas"),
    calendario: buildIllustration("Calendario semanal", "Reorganiza tus comidas con arrastrar y soltar.", "calendario"),
    compras: buildIllustration("Compra inteligente", "Carrito, secciones y checkout del plan mensual.", "compras"),
    dashboard: buildIllustration("Tu dashboard", "Favoritos, descargas e historial personal en local.", "dashboard")
  })[page];

export const getRecipeIllustration = (recipe: Recipe) =>
  buildIllustration(recipe.title, `${recipe.cuisine} · ${recipe.preparationMinutes} min`, recipe.mealType);
