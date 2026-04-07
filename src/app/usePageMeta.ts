import { useEffect } from "react";

type PageMetaConfig = {
  title: string;
  description: string;
  keywords: string;
  preloadImage?: string;
};

const ensureMeta = (selector: string, create: () => HTMLMetaElement) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = create();
    document.head.appendChild(element);
  }

  return element;
};

const ensureLink = (selector: string, create: () => HTMLLinkElement) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = create();
    document.head.appendChild(element);
  }

  return element;
};

export function usePageMeta({ title, description, keywords, preloadImage }: PageMetaConfig) {
  useEffect(() => {
    document.title = title;

    const descriptionMeta = ensureMeta('meta[name="description"]', () => {
      const meta = document.createElement("meta");
      meta.name = "description";
      return meta;
    });
    descriptionMeta.content = description;

    const keywordsMeta = ensureMeta('meta[name="keywords"]', () => {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      return meta;
    });
    keywordsMeta.content = keywords;

    const ogTitle = ensureMeta('meta[property="og:title"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      return meta;
    });
    ogTitle.content = title;

    const ogDescription = ensureMeta('meta[property="og:description"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:description");
      return meta;
    });
    ogDescription.content = description;

    const canonical = ensureLink('link[rel="canonical"]', () => {
      const link = document.createElement("link");
      link.rel = "canonical";
      return link;
    });
    canonical.href = `${window.location.origin}${window.location.pathname}`;

    const preloadLink = ensureLink('link[data-critical-image="true"]', () => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.dataset.criticalImage = "true";
      return link;
    });
    preloadLink.href = preloadImage ?? "";

    return () => {
      if (!preloadImage) {
        preloadLink.removeAttribute("href");
      }
    };
  }, [description, keywords, preloadImage, title]);
}
