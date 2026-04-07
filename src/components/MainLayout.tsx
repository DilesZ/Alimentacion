import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/recetas", label: "Recetas" },
  { to: "/calendario", label: "Calendario" },
  { to: "/compras", label: "Compras" }
];

const breadcrumbMap: Record<string, string> = {
  "": "Inicio",
  dashboard: "Dashboard",
  recetas: "Recetas",
  calendario: "Calendario",
  compras: "Compras"
};

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const crumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [{ label: "Inicio", to: "/" }];
    }

    return [{ label: "Inicio", to: "/" }].concat(
      segments.map((segment, index) => ({
        label: breadcrumbMap[segment] ?? segment,
        to: `/${segments.slice(0, index + 1).join("/")}`
      }))
    );
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">PS</span>
          <span>
            <strong>Planificador Saludable</strong>
            <small>Paiporta · nutricion y compra</small>
          </span>
        </Link>

        <button
          className="hamburger-button"
          type="button"
          aria-label="Abrir menu principal"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={mobileMenuOpen ? "main-nav nav-open" : "main-nav"}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={crumb.to} className="breadcrumb-item">
              {index < crumbs.length - 1 ? <Link to={crumb.to}>{crumb.label}</Link> : <strong>{crumb.label}</strong>}
              {index < crumbs.length - 1 ? <span>/</span> : null}
            </span>
          ))}
        </nav>

        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
