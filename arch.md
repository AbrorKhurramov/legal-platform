# Архитектура и правила разработки

Это инструкция для агентов и разработчиков: как писать код в этом проекте — архитектура, паттерны, стиль. Всё описанное ниже выведено из существующего кода. **Новый код обязан следовать этим правилам, а не привносить свои.** Перед использованием любого компонента — сначала найди, как он уже используется в проекте, и повтори этот паттерн.

---

## 1. Стек

- **React 19** + **TypeScript** + **Vite** (`@vitejs/plugin-react-swc`)
- **local-agro-ui** — основная UI-библиотека (Button, Drawer, Table, Select, Tag, TabsSwitcher, …)
- **MUI v7** — только точечно; иконки из MUI напрямую запрещены eslint-правилом
- **TailwindCSS v4** — вся стилизация; `tailwind-merge` для условных классов
- **TanStack Query v5** — все серверные данные
- **Redux Toolkit** — только `auth` и `user` слайсы
- **react-hook-form 7**, **react-router 7**, **i18next** (ru/uz), **axios**, **dayjs**

## 2. FSD-слои и правило импортов

```
app/  →  pages/  →  widgets/  →  features/  →  entities/  →  shared/
```

- Импортировать можно только **вниз** по иерархии.
- Через границу среза импортируем **только из `*.entry.ts`** (баррель — публичный API среза). Внутри среза — относительные импорты.
- Alias `@` = `src/`. Порядок импортов фиксирован prettier-плагином: `react` → сторонние → `@/app` → `@/pages` → `@/shared` → `@/features` → `@/widgets` → `@/entities` → относительные, каждая группа отделена пустой строкой (prettier расставит сам).

Роль слоёв:

| Слой | Ответственность |
|---|---|
| `app` | Провайдеры, роутер, guards, layouts, i18n, глобальные стили |
| `pages` | Тонкие композиции: `h1` + виджет. Никакой логики |
| `widgets` | Композиция features/entities: свитчеры табов, таблицы-обёртки, детальные блоки |
| `features` | Пользовательские действия: таблица с actions, drawer, форма, модалка |
| `entities` | Домен: API-класс, DTO-типы, константы/enum'ы, мапперы, презентационные карточки + скелетоны |
| `shared` | Без привязки к домену: api-инстанс, hooks, ui-примитивы, utils, const |

## 3. Структура среза и нейминг файлов

Всё — **kebab-case** с суффиксом по назначению: `*.component.tsx`, `*.page.tsx`, `*.entry.ts`, `*.api.ts`, `*.types.ts`, `*.const.ts`, `*.mapper.ts`, `*.slice.ts`, `*-skeleton.component.tsx`.

```
entities/product/
  common/                       # view-типы и UI-конфиги (не серверные)
    product.view.types.ts
    status.config.ts
  model/
    product.api.ts              # класс Api + singleton + QueryKeyBootstrap
    product.types.ts            # DTO и request-типы
    product.const.ts            # const enum'ы, Record-конфиги, option-массивы
    product.mapper.ts           # чистые функции DTO → options/view
  ui/
    credit-card/
      credit-card.component.tsx
      credit-card-skeleton.component.tsx
  product.entry.ts

features/product/k-one/
  ui/k-one.component.tsx
  k-one.entry.ts

widgets/product/k-index-switch/
  common/
    k-index-switch.const.ts     # Record<enum, Component>, фабрика tab items
    k-index-switch.types.ts     # enum'ы виджета
  ui/k-index-switch.component.tsx
  k-index-switch.entry.ts

pages/product/k-index/
  ui/k-index.page.tsx
  k-index.entry.ts
```

Feature-срезы группируются по домену: `features/<domain>/<feature-name>/`. Тесты — в `__tests__/` рядом с кодом.

## 4. API-слой

### 4.1 Класс Api для entity

Каждый entity объявляет класс с `public readonly key` (имя микросервиса), `createScopedApi(prefix)` и arrow-методами, возвращающими `response.data`:

```ts
class ProductApi {
  public readonly key = "product-service";

  private readonly scopedApi = createScopedApi("product-service");

  getCardIndexOne = async (params: CardIndexRequestParams) => {
    const response = await this.scopedApi.get<TPageableEndpointDTO<K1ListItemDTO[]>>("/k1-info/list", { params });
    return response.data;
  };

  actionCardIndexOne = async (id: number, body: K1ActionRequestBody) => {
    const response = await this.scopedApi.post<void>(`/k1-info/action/${id}`, body);
    return response.data;
  };
}

export const productApi = new ProductApi();
export const productApiQueryKeys = new QueryKeyBootstrap(productApi);
```

Правила:

- Методы называются по действию: `get*`, `create*`, `add*`, `push*`, `action*`. Всегда `async` arrow-функции, всегда две строки: запрос → `return response.data`.
- Дженерик — тип DTO ответа. Пагинация — `TPageableEndpointDTO<T[]>` из `@/shared/api/api-types`.
- `api` (RequestWithToast) сам показывает тосты. Чтобы отключить — последний аргумент `false` (пример: `this.scopedApi.get(url, { params }, false)`).
- Никаких fetch/axios вне этого слоя. Компоненты не знают про URL'ы.

### 4.2 QueryClient и провайдер

`QueryClient` создаётся один раз в `app/providers/query/common/query.config.ts` — новых клиентов в фичах не создаём:

```ts
import { QueryClient } from "@tanstack/react-query";

const STALE_TIME = 60 * 1000; // 1 minute
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: STALE_TIME, refetchOnWindowFocus: true } },
});
```

Провайдер — тонкая обёртка над `QueryClientProvider` (`app/providers/query/ui/query-provider.tsx`), наружу отдаётся через `query.entry.ts`:

```tsx
import { type ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "../common/query.config";

interface IQueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = (props: IQueryProviderProps) => {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};
```

```ts
// app/providers/query/query.entry.ts
export { QueryProvider } from "./ui/query-provider";
```

Порядок провайдеров в `app/app.component.tsx` фиксирован: `StoreProvider` → `QueryProvider` → (`Toaster`, `RouterProvider`, `ReactQueryDevtools`).

- Глобальные дефолты (`staleTime`, `refetchOnWindowFocus`) заданы здесь; в конкретном `useQuery` их переопределяем только при реальной необходимости.
- Внутри компонентов клиент берём хуком `const queryClient = useQueryClient()`, а не прямым импортом `queryClient` из конфига. Прямой импорт — только вне React (loader'ы, утилиты).

### 4.3 Query keys

`QueryKeyBootstrap` живёт в `shared/lib/query-lib.ts` и строит ключи из `key` Api-класса:

```ts
type EmptyObject = Record<string, unknown>;
export type QueryListKey<K extends EmptyObject = { key: string }> = K;

export class QueryKeyBootstrap<T extends QueryListKey> {
  constructor(private readonly serviceClass: T) {}

  getKey(key: Exclude<keyof T, "key">, ...dynamic: Array<unknown>) {
    return [this.serviceClass.key, key, ...dynamic];
  }

  getRootKey() {
    return [this.serviceClass.key];
  }
}
```

Ключи не пишутся руками — только через `QueryKeyBootstrap`:

```ts
queryKey: productApiQueryKeys.getKey("getCardIndexOne", { page, perPage })
// → ["product-service", "getCardIndexOne", { page, perPage }]
```

Имя ключа = имя метода Api-класса (типобезопасно). Инвалидация — по префиксу без динамики:

```ts
queryClient.invalidateQueries({ queryKey: productApiQueryKeys.getKey("getCardIndexOne") });
```

`getRootKey()` даёт корневой ключ микросервиса (`["product-service"]`) — им инвалидируем сразу все запросы entity.

### 4.4 Использование в компонентах

```tsx
const { data, isFetching } = useQuery({
  queryFn: () => productApi.getCardIndexOne({ page: page - 1, size: perPage }),
  queryKey: productApiQueryKeys.getKey("getCardIndexOne", { page, perPage }),
});

const { mutate: sendAction } = useMutation({
  mutationFn: (params: IPendingAction) => productApi.actionCardIndexOne(params.id, { action: params.action }),
  mutationKey: productApiQueryKeys.getKey("actionCardIndexOne"),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: productApiQueryKeys.getKey("getCardIndexOne") });
    // закрыть модалки, сбросить локальный стейт
  },
});
```

- Порядок полей: сначала `queryFn`, затем `queryKey`, затем опции (`enabled: !!id`).
- Для загрузки используем `isFetching` (не `isLoading`).
- Условные запросы — через `enabled`, а не через условный рендер хука.
- Мутация сама инвалидирует всё, что могла изменить (список + деталь + агрегаты).
- `@tanstack/query/exhaustive-deps` — error в eslint: все переменные из `queryFn` должны попасть в `queryKey`.

## 5. Типы и константы

- **DTO** — типы серверных ответов, суффикс `DTO`: `ProductCreditDTO`, `K1DetailDTO`. Живут в `model/*.types.ts`. И `type`, и `interface` допустимы; исторически часть с префиксом `I` (`ICreditScoringResultDTO`) — для новых DTO префикс не обязателен, суффикс `DTO` обязателен.
- **Request-типы** — `*RequestBody`, `*RequestParams`, `*Query`.
- **View-модели** — то, что нужно UI, а не серверу: `common/*.view.types.ts`, суффикс `ViewModel`. Преобразование DTO → view-модель делается в компоненте-контейнере или в `model/*.mapper.ts` (чистые функции `mapXToY`).
- **Props-интерфейсы** — `I<Component>Props`, объявляются над компонентом в том же файле. Колбэки — методным синтаксисом: `onAccept?(id: number): void;`.
- **Enum'ы бэкенда** — `const enum` со строковыми значениями 1:1 с сервером, в `model/*.const.ts`:

  ```ts
  export const enum K1Action {
    ACCEPT = "ACCEPT",
    REJECT = "REJECT",
    PAY = "PAY",
  }
  ```

- **Конфиги статусов** — `Record<Enum, config>` вместо switch/if:

  ```ts
  export const serviceCreditGraphStatus: Record<ServiceCreditGraphStatus, { icon: IconNameTypes; background: string }> = {
    [ServiceCreditGraphStatus.PAYED]: { icon: "check", background: "bg-main-green-500" },
    [ServiceCreditGraphStatus.UNPAID]: { icon: "remove", background: "bg-warning-500" },
  };
  ```

- **Списки для Select** — массивы `SelectOptionType<T>[]` из local-agro-ui, суффикс `Option`.
- `any` не используем. Неизвестный ответ — `unknown`.

## 6. Компоненты

### 6.1 Общий стиль

- Только функциональные компоненты, **именованный export**, никаких `default export` (кроме случаев, где требует библиотека).
- Пропсы принимаем как `props` и деструктурируем первой строкой тела:

  ```tsx
  export const KOneDrawer = (props: IKOneDrawerProps) => {
    const { cardIndexId, onAccept, onReject, onPay } = props;
    ...
  };
  ```

  Редко используемые поля можно оставить на `props.isOpen`.
- Порядок внутри компонента: хуки (`useTranslation`, `useQueryClient`) → `useState`/`useRef` → производные/`useQuery`/`useMutation` → обработчики → `return`.
- Обработчики — стрелочные `const handleX = () => {}` или инлайн для однострочных. Тогглеры — через prev-state: `setIsOpen((prevState) => !prevState)`.
- React 19: ref передаётся обычным пропом (`ref?: RefObject<...>`), без `forwardRef`.
- **useEffect — минимизировать.** Не строить цепочки эффектов; императивную работу делать в одном эффекте или в обработчиках событий. Данные — только через TanStack Query, не через effect+setState.
- Комментарии — почти не пишем. Допустим маркер `//*` для навигационных пометок (`//* App Layout`).

### 6.2 Loading-состояния

У каждой карточки/детали есть парный скелетон `*-skeleton.component.tsx`. Переключение — через `ActivityCondition`:

```tsx
<ActivityCondition condition={isFetching} fallback={<CardIndexDetailSkeleton />}>
  <CardIndexDetailContent data={viewModel} />
</ActivityCondition>
```

### 6.3 Модалки и drawer'ы

Два паттерна:

1. **Императивный ref** — для confirm-модалок и фильтров: компонент принимает `ref: RefObject<BaseModalHandlers>` (или свой `*Handlers`-тип), внутри `useImperativeHandle` с `openModal/closeModal/modalState`. Вызов: `confirmModalRef.current?.openModal()`.
2. **Контролируемый state** — для drawer'ов с данными: `isOpen` + id в `useState`, условный маунт:

   ```tsx
   {isOpenDrawer && cardIndexId && (
     <KOneDrawer cardIndexId={cardIndexId} isOpen={isOpenDrawer} onClose={toggleDrawer} ... />
   )}
   ```

Props drawer-фичи наследуют библиотечные: `interface IKOneDrawerProps extends Omit<IDrawerProps, "title" | "className" | "children" | "footer">`.

Паттерн «действие с подтверждением»: `pendingAction` в state → `confirmModalRef.current?.openModal()` → в `onSubmit` модалки выполняем мутацию, в `onSuccess/onError` закрываем и сбрасываем `pendingAction`.

### 6.4 Таблицы

`Table` + `createColumnHelper<RowDTO>` из local-agro-ui. `columnHelper` — на уровне модуля, колонки — фабрикой под компонентом, принимающей обработчики:

```tsx
const columnHelper = createColumnHelper<K1ListItemDTO>();

const getCardIndexOneColumns = (handlers: IColumnHandlers) => {
  const { t } = useTranslation(["common", "servicesCardIndex"]);
  return [
    columnHelper.accessor("documentNumber", { header: t("documentNumber", { ns: "common" }) }),
    columnHelper.display({
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => <CardIndexActionButtons ... onAccept={() => handlers.onAccept(row.original.id)} />,
    }),
  ];
};
```

Пагинация — серверная: `page`/`perPage` в `useState`, в запрос уходит `{ page: page - 1, size: perPage }`, в `Table` — `isPagination`, `pagesSyncQuery`, `page/setPage`, `perPage/setPerPage`, `totalCount={data?.totalCount || 0}`.

В ячейках-кнопках событие останавливаем обёрткой:

```tsx
const stop = (handler: () => void) => (event: React.MouseEvent) => {
  event.stopPropagation();
  handler();
};
```

### 6.5 Свитчеры табов (виджеты)

Активный таб живёт в URL (`useSearchParams`), компоненты — в `Record`:

```ts
export const CARD_INDEX_SWITCHER_COMPONENTS: Record<SwitcherCardIndexNames, () => JSX.Element> = {
  [SwitcherCardIndexNames.CardIndexOne]: KOne,
  [SwitcherCardIndexNames.CardIndexTwo]: KTwo,
};
```

Tab items — фабрика `get*TabItems()` с `i18next.t(...)` (вне React-контекста используем `i18next.t`, внутри — `useTranslation`).

### 6.6 Формы

react-hook-form. Инпуты — из local-agro-ui, разметка формы — `<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">`, футер с кнопками Cancel/Submit, submit заблокирован по `!isValid || !isDirty`. Маски — `@maskito`.

## 7. Стилизация

- **Только Tailwind-классы** в `className`. Никаких inline-style и styled-components в фичах.
- Условные классы — `twMerge(...)` / `clsx(...)`; порядок классов сортирует prettier-plugin-tailwindcss — не сортировать вручную.
- Дизайн-токены из tailwind-конфига проекта: `text-greyscale-800`, `bg-main-green-500`, `bg-warning-500`, `text-h4`, `border-greyscale-300` — использовать их, а не произвольные hex.
- Компоненты local-agro-ui конфигурируются пропами `colorType` ("Blue" | "MainGreen" | "Error" | "Gray" | "Electro" …), `variantType` ("Filled" | "Outlined" | "Plain"), `sizeType` ("xs"…"xl"), `rounded`. Смотреть существующие использования и повторять.
- **Иконки — только `<Icon name="..." />`** из `@/shared/ui/icon/icon.entry`. Нет нужной иконки — добавить в `icon-const.ts` (и svg в `shared/assets/icons/`), затем использовать. Импорт `Icon` из MUI запрещён eslint'ом.
- SVG импортируются как компоненты через svgr: `import { ReactComponent as Logo } from "@/shared/assets/logo.svg"`.

## 8. i18n

- Два языка: `ru` и `uz`. **Любой новый ключ добавляется в оба файла** `src/app/i18n/locales/{ru,uz}/<namespace>.json`.
- Namespace = домен: `common`, `services-card-index` → ns `servicesCardIndex`, и т.д. Общие слова (`cancel`, `save`, `view`, `error`) — в `common`.
- В компонентах: `const { t } = useTranslation(["common", "servicesCardIndex"])`, обращение `t("servicesCardIndex:payerAccount")` или `t("key", { ns: "common" })`.
- Вне компонентов (константы, фабрики): `i18next.t("key", { ns: "..." })`.
- Никаких захардкоженных пользовательских строк в JSX.

## 9. Состояние

- **Серверное** — только TanStack Query. Не копировать данные запроса в useState/Redux.
- **Глобальное клиентское** — только `auth` и `user` в Redux; доступ через `useAppSelector`/`useAppDispatch` из `@/shared/hooks`. Новые Redux-слайсы не заводим без крайней необходимости.
- **Локальное UI** — `useState` в компоненте (модалки, выбранный id, pending-действие).
- **Шарящееся между заходами/ссылками** (активный таб, страница) — в URL через `useSearchParams`.

## 10. Роутинг и guards

- Все роуты — в `src/app/router/route.ts`. Страница подключается через её `*.entry.ts`.
- `handle: { crumb: "breadcrumbs.x", guard: RoleBasedGuard.<domain>["display:route"] }` — хлебные крошки и ролевые guard'ы.
- Ролевая защита компонента — HOC `withGuard`; страницы с guard'ом экспортируются как `<Name>PageWithGuard`.

## 12. Форматирование и линт

- Prettier: ширина строки **150**, двойные кавычки, точки с запятой, trailing comma. Не спорить с prettier — `npm run prettier:fix`.
- ESLint: `npm run lint` (с автофиксом). Неиспользуемые переменные — префикс `_`.
- Коммиты — Conventional Commits (`feat:`, `fix:`, `refactor:`, `translation:` …), enforced commitlint+husky.

## 13. Процесс работы (для агентов)

1. **Не делать всё разом.** Разбить задачу на шаги, расписать план, задать вопросы, и только после аппрува реализовывать.
2. **Сначала искать готовое.** Нужен компонент — проверить local-agro-ui, потом `shared/ui`, `shared/components`, потом entities. Найти существующее использование и скопировать паттерн, не изобретать свой.
3. Новую функциональность строить сверху вниз по FSD: DTO+API-метод в entity → карточки/скелетоны в entity `ui/` → фича с логикой → виджет-композиция → тонкая страница → роут → переводы ru+uz.
4. Экспортировать наружу через `*.entry.ts` только то, что реально нужно другим срезам.
5. После изменений: `npm run typecheck`, при финале — `npm run checkup`.
6. Не отходить от стиля проекта: если в соседнем файле сделано определённым образом — делать так же.

## 14. Чек-лист «новый экран» (пример: карточный индекс K1/K2)

Реальный порядок появления файлов на примере фичи card-index:

1. `entities/product/model/product.types.ts` — `K1ListItemDTO`, `K1DetailDTO`, `CardIndexRequestParams`, `K1ActionRequestBody`.
2. `entities/product/model/product.const.ts` — `const enum CardIndexStatus`, `const enum K1Action`.
3. `entities/product/common/status.config.ts` — `CardIndexStatusColor`, `CardIndexStatusTranslation` (Record-конфиги).
4. `entities/product/common/product.view.types.ts` — `CardIndexDetailViewModel`.
5. `entities/product/model/product.api.ts` — методы `getCardIndexOne`, `getCardIndexOneDetail`, `actionCardIndexOne`.
6. `entities/product/ui/card-index/` — презентационные компоненты (баннер, кнопки действий, контент детали, скелетон, статус-тег) + локальный `card-index.entry.ts`.
7. `features/product/k-one/` — таблица с пагинацией, drawer, confirm-модалка, мутация с инвалидацией.
8. `features/product/k-one-drawer/` — деталь: query по id, маппинг DTO → ViewModel, `ActivityCondition` + скелетон.
9. `widgets/product/k-index-switch/` — таб-свитчер K1/K2 через `useSearchParams`.
10. `pages/product/k-index/` — `h1` + виджет.
11. `app/router/route.ts` — роут; `shared/const/route-const.ts` — путь.
12. `app/i18n/locales/{ru,uz}/services-card-index.json` — переводы.
