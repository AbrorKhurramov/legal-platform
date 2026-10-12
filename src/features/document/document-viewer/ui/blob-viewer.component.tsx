import { useEffect, useState } from "react";

import { ViewerKind } from "../common/document-viewer.const";

interface IBlobViewerProps {
  kind: ViewerKind.PDF | ViewerKind.IMAGE;
  data: ArrayBuffer;
  contentType: string;
  title: string;
}

/** PDF and images go to the browser's own viewer through an object URL; nothing is parsed here. */
export const BlobViewer = (props: IBlobViewerProps) => {
  const { kind, data, contentType, title } = props;
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(new Blob([data], { type: contentType }));
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [data, contentType]);

  if (!url) return null;

  if (kind === ViewerKind.IMAGE) {
    return (
      <div className="flex h-full items-start justify-center overflow-auto bg-greyscale-100 p-4">
        <img src={url} alt={title} className="max-w-full rounded shadow-sm" />
      </div>
    );
  }

  return <iframe src={url} title={title} className="size-full border-0 bg-greyscale-100" />;
};
