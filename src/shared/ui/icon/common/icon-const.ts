import { ReactComponent as AlertIcon } from "@/shared/assets/icons/alert.svg";
import { ReactComponent as ArrowLeftIcon } from "@/shared/assets/icons/arrow-left.svg";
import { ReactComponent as BellIcon } from "@/shared/assets/icons/bell.svg";
import { ReactComponent as BookIcon } from "@/shared/assets/icons/book.svg";
import { ReactComponent as BriefcaseIcon } from "@/shared/assets/icons/briefcase.svg";
import { ReactComponent as BuildingIcon } from "@/shared/assets/icons/building.svg";
import { ReactComponent as CalendarIcon } from "@/shared/assets/icons/calendar.svg";
import { ReactComponent as CheckCircleIcon } from "@/shared/assets/icons/check-circle.svg";
import { ReactComponent as CheckIcon } from "@/shared/assets/icons/check.svg";
import { ReactComponent as ChevronDownIcon } from "@/shared/assets/icons/chevron-down.svg";
import { ReactComponent as ChevronLeftIcon } from "@/shared/assets/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "@/shared/assets/icons/chevron-right.svg";
import { ReactComponent as ClockIcon } from "@/shared/assets/icons/clock.svg";
import { ReactComponent as CloseIcon } from "@/shared/assets/icons/close.svg";
import { ReactComponent as CopyIcon } from "@/shared/assets/icons/copy.svg";
import { ReactComponent as DashboardIcon } from "@/shared/assets/icons/dashboard.svg";
import { ReactComponent as DownloadIcon } from "@/shared/assets/icons/download.svg";
import { ReactComponent as EyeIcon } from "@/shared/assets/icons/eye.svg";
import { ReactComponent as FileTextIcon } from "@/shared/assets/icons/file-text.svg";
import { ReactComponent as FileIcon } from "@/shared/assets/icons/file.svg";
import { ReactComponent as FilterIcon } from "@/shared/assets/icons/filter.svg";
import { ReactComponent as GavelIcon } from "@/shared/assets/icons/gavel.svg";
import { ReactComponent as GlobeIcon } from "@/shared/assets/icons/globe.svg";
import { ReactComponent as HistoryIcon } from "@/shared/assets/icons/history.svg";
import { ReactComponent as InfoIcon } from "@/shared/assets/icons/info.svg";
import { ReactComponent as LayersIcon } from "@/shared/assets/icons/layers.svg";
import { ReactComponent as LightbulbIcon } from "@/shared/assets/icons/lightbulb.svg";
import { ReactComponent as LockIcon } from "@/shared/assets/icons/lock.svg";
import { ReactComponent as LogoutIcon } from "@/shared/assets/icons/logout.svg";
import { ReactComponent as MenuIcon } from "@/shared/assets/icons/menu.svg";
import { ReactComponent as MessageIcon } from "@/shared/assets/icons/message.svg";
import { ReactComponent as PauseIcon } from "@/shared/assets/icons/pause.svg";
import { ReactComponent as PlusIcon } from "@/shared/assets/icons/plus.svg";
import { ReactComponent as RefreshIcon } from "@/shared/assets/icons/refresh.svg";
import { ReactComponent as ScaleIcon } from "@/shared/assets/icons/scale.svg";
import { ReactComponent as SearchIcon } from "@/shared/assets/icons/search.svg";
import { ReactComponent as SendIcon } from "@/shared/assets/icons/send.svg";
import { ReactComponent as ShieldAlertIcon } from "@/shared/assets/icons/shield-alert.svg";
import { ReactComponent as StampIcon } from "@/shared/assets/icons/stamp.svg";
import { ReactComponent as TrendingIcon } from "@/shared/assets/icons/trending.svg";
import { ReactComponent as UndoIcon } from "@/shared/assets/icons/undo.svg";
import { ReactComponent as UploadIcon } from "@/shared/assets/icons/upload.svg";
import { ReactComponent as UserIcon } from "@/shared/assets/icons/user.svg";
import { ReactComponent as UsersIcon } from "@/shared/assets/icons/users.svg";
import { ReactComponent as XCircleIcon } from "@/shared/assets/icons/x-circle.svg";

export const ICONS = {
  dashboard: DashboardIcon,
  briefcase: BriefcaseIcon,
  "file-text": FileTextIcon,
  gavel: GavelIcon,
  scale: ScaleIcon,
  book: BookIcon,
  "shield-alert": ShieldAlertIcon,
  lightbulb: LightbulbIcon,
  history: HistoryIcon,
  logout: LogoutIcon,
  user: UserIcon,
  users: UsersIcon,
  plus: PlusIcon,
  search: SearchIcon,
  filter: FilterIcon,
  close: CloseIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-left": ChevronLeftIcon,
  "arrow-left": ArrowLeftIcon,
  check: CheckIcon,
  "check-circle": CheckCircleIcon,
  "x-circle": XCircleIcon,
  clock: ClockIcon,
  alert: AlertIcon,
  upload: UploadIcon,
  download: DownloadIcon,
  file: FileIcon,
  eye: EyeIcon,
  lock: LockIcon,
  send: SendIcon,
  refresh: RefreshIcon,
  bell: BellIcon,
  building: BuildingIcon,
  calendar: CalendarIcon,
  message: MessageIcon,
  globe: GlobeIcon,
  trending: TrendingIcon,
  info: InfoIcon,
  stamp: StampIcon,
  undo: UndoIcon,
  menu: MenuIcon,
  pause: PauseIcon,
  copy: CopyIcon,
  layers: LayersIcon,
} as const;

export type IconNameTypes = keyof typeof ICONS;
