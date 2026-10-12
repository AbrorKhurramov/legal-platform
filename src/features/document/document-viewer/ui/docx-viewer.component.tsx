import { useEffect, useRef, useState } from "react";

import { Skeleton } from "local-agro-ui";

const SAFE_LINK = /^(https?:|mailto:|#)/i;
const PAGE_GUTTER_PX = 16;

/** A document from outside the bank can carry script links; anything but web, mail and in-page anchors is dropped. */
const neutralizeLinks = (root: HTMLElement) =>
  root.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href")?.trim() ?? "";
    if (!SAFE_LINK.test(href)) link.removeAttribute("href");
    else if (!href.startsWith("#")) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

interface IDocxViewerProps {
  data: ArrayBuffer;
  onError(): void;
}

export const DocxViewer = (props: IDocxViewerProps) => {
  const { data, onError } = props;
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    const viewport = viewportRef.current;
    const container = containerRef.current;
    if (!viewport || !container) return;
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    setIsRendering(true);

    import("docx-preview")
      .then(({ renderAsync }) =>
        renderAsync(data.slice(0), container, undefined, {
          className: "docx",
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          // Alt chunks are raw HTML embedded in the file and would be rendered in an iframe.
          renderAltChunks: false,
          renderComments: false,
          renderChanges: false,
        }),
      )
      .then(() => {
        if (cancelled) return;
        neutralizeLinks(container);
        // The library's stylesheet is unlayered, so it beats Tailwind classes; inline styles win.
        const wrapper = container.querySelector<HTMLElement>(".docx-wrapper");
        if (wrapper) Object.assign(wrapper.style, { background: "transparent", padding: `${PAGE_GUTTER_PX}px` });
        // Pages keep their real A4 layout and are zoomed out to fit the column instead of reflowing.
        const pageWidth = container.querySelector<HTMLElement>("section.docx")?.offsetWidth;
        if (pageWidth) {
          observer = new ResizeObserver(() => {
            container.style.zoom = String(Math.min(1, viewport.clientWidth / (pageWidth + PAGE_GUTTER_PX * 2)));
          });
          observer.observe(viewport);
        }
        setIsRendering(false);
      })
      .catch(() => !cancelled && onError());

    return () => {
      cancelled = true;
      observer?.disconnect();
      container.style.zoom = "";
      container.replaceChildren();
    };
  }, [data, onError]);

  return (
    <div ref={viewportRef} className="relative h-full overflow-auto bg-greyscale-100">
      {isRendering && <Skeleton className="absolute inset-4 h-auto rounded-lg" />}
      <div ref={containerRef} />
    </div>
  );
};
