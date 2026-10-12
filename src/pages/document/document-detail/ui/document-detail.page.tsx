import { useParams } from "react-router";

import { DocumentDetail } from "@/widgets/document/document-detail/document-detail.entry";

export const DocumentDetailPage = () => {
  const { fileId = "" } = useParams();

  return <DocumentDetail key={fileId} fileId={fileId} />;
};
