import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/app/providers/store/store.entry";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
