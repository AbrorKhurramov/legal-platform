import { useAppSelector } from "@/shared/hooks/use-app-selector";

export const useCurrentUser = () => useAppSelector((state) => state.user.current);
