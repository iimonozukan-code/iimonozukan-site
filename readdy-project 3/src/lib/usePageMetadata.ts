import { useEffect } from 'react';

type PageMetadata = {
  title: string;
  description: string;
  canonicalPath: string;
};

type ElementState = {
  element: HTMLElement;
  attribute: 'content' | 'href';
  value: string | null;
};

export function usePageMetadata({
  title,
  description,
  canonicalPath,
}: PageMetadata): void {
  useEffect(() => {
    const previousTitle = document.title;
    const states: ElementState[] = [];

    const setContent = (selector: string, value: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) return;
      states.push({
        element,
        attribute: 'content',
        value: element.getAttribute('content'),
      });
      element.setAttribute('content', value);
    };

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalOrigin = canonical?.href
      ? new URL(canonical.href).origin
      : window.location.origin;
    const canonicalUrl = new URL(canonicalPath, `${canonicalOrigin}/`).toString();

    document.title = title;
    setContent('meta[name="description"]', description);
    setContent('meta[property="og:title"]', title);
    setContent('meta[property="og:description"]', description);
    setContent('meta[property="og:url"]', canonicalUrl);
    setContent('meta[name="twitter:title"]', title);
    setContent('meta[name="twitter:description"]', description);

    if (canonical) {
      states.push({
        element: canonical,
        attribute: 'href',
        value: canonical.getAttribute('href'),
      });
      canonical.setAttribute('href', canonicalUrl);
    }

    return () => {
      document.title = previousTitle;
      states.forEach(({ element, attribute, value }) => {
        if (value == null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, value);
      });
    };
  }, [canonicalPath, description, title]);
}
