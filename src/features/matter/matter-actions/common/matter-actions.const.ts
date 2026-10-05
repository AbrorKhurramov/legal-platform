import { MatterAction } from "@/entities/matter/matter.entry";

export const ACTIONS_WITH_REQUIRED_COMMENT: MatterAction[] = [MatterAction.REQUEST_DOCS, MatterAction.RETURN, MatterAction.REJECT];

export const DESTRUCTIVE_ACTIONS: MatterAction[] = [MatterAction.REJECT];

export const AI_DRAFT_TEMPLATE = (title: string) =>
  `Loyiha: ${title}\n\n1. Hujjat amaldagi qonunchilik hujjatlari va bankning ichki talablariga asosan muvofiq.\n2. Tomonlarning javobgarligi va nizolarni hal etish tartibi bandlarini aniqlashtirish tavsiya etiladi.\n3. Bank siri va shaxsga doir ma'lumotlarga oid majburiyatlar shartnomada aks ettirilishi lozim.\n\nXulosa: e'tirozlar inobatga olingan holda loyihani imzolash mumkin.`;
