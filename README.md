# Yuridik platforma — frontend

Bank yuridik departamenti uchun ishlarni boshqarish platformasi. Kod `arch.md` qoidalariga amal qiladi: FSD qatlamlari, `local-agro-ui`, TanStack Query, Redux faqat `auth`/`user` uchun, i18n uz/ru.

## Ishga tushirish

```bash
npm install
npm run start:dev      # http://localhost:3000
npm run checkup        # typecheck + test + build
```

## Fake backend

`VITE_USE_MOCK=true` (`.env.development`) bo'lsa, axios so'rovlarini `src/mock/` dagi soxta server qabul qiladi. U FSD qatlamlaridan tashqarida turadi va `main.tsx` da faqat shu flag yoqilganda dinamik yuklanadi.

- Ma'lumotlar deterministik seed orqali yaratiladi: 236 ta murojaat, 42 ta sud ishi, 10 ta qonunchilik o'zgarishi, 12 ta xatar, 12 ta maslahat, audit yozuvlari. Keyin `localStorage` da saqlanadi.
- Foydalanuvchi menyusidagi **«Demo ma'lumotlarni tiklash»** bazani boshlang'ich holatga qaytaradi.
- Barcha ma'lumotlar, jumladan huquqiy javob va hujjat raqamlari, soxta. Ular faqat namoyish uchun.

Haqiqiy backend tayyor bo'lgach, `VITE_USE_MOCK=false` va `VITE_API_HOST` qo'yiladi. API kontrakti `entities/*/model/*.api.ts` va `*.types.ts` da belgilangan. Envelope: `{ success, message, data }`, paginatsiya: `{ data, totalCount }`, `page` 0 dan boshlanadi. `src/mock/handlers/` backend uchun ishlaydigan spetsifikatsiya vazifasini ham bajaradi: ko'rinish huquqlari, workflow o'tishlari, statistika.

## Demo hisoblar (parol: `demo`)

| Login | Rol | Nimani ko'radi |
|---|---|---|
| `rustam.x` | Rahbar, departament direktori | Hammasi va audit jurnali; murakkab ishlarda 2-viza |
| `feruza.s` | Rahbar, bo'lim boshlig'i | Hammasi; kelishuv zanjirida 1-viza |
| `dilnoza.k`, `nodira.a` | Yurist | Maxfiy bo'lmagan ishlar va o'ziga biriktirilgan maxfiy ishlar |
| `aziz.m` | Bosh ofis xodimi | O'z ishlari, xulosalar reestri, qonunchilik |
| `anvar.s` | Filial xodimi | Faqat o'z filiali ishlari va maslahatlar bazasi |

## Asosiy jarayon

`Yangi` → (rahbar biriktiradi) `Yuristga biriktirildi` → `Ko'rib chiqilmoqda` ⇄ `Hujjatlar to'liq emas` (muddat to'xtaydi va keyin uzaytiriladi) → (xulosa) `Kelishuvda` → (bo'lim boshlig'i → direktor vizasi) `Yakunlandi`. Qaytarish va rad etish ham mumkin. «Kelishildi» belgisi ERI hisoblanmaydi, bu interfeysda ko'rsatiladi. AI qoralama yurist tekshiruvidan o'tishi shart.

## Modullar

Rahbariyat paneli · Murojaatlar (yagona oyna) · Huquqiy xulosalar reestri · Sud ishlari · Qonunchilik o'zgarishlari · Huquqiy xatarlar · Maslahatlar bazasi · Audit jurnali.

Hali qilinmagan (ТЗ 2–3-bosqich): korporativ qarorlar va topshiriqlar reestri, namunaviy hujjatlar, versiyalarni solishtirish, EHAT/ERI integratsiyasi, haqiqiy AI qidiruv.
