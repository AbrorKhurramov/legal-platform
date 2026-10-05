import { useParams } from "react-router";

import { MatterDetailSwitch } from "@/widgets/matter/matter-detail-switch/matter-detail-switch.entry";

export const MatterDetailPage = () => {
  const { matterId = "" } = useParams();

  return <MatterDetailSwitch key={matterId} matterId={matterId} />;
};
