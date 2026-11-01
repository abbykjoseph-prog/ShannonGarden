# Shannon Boudreau Gardens

Marketing site for Shannon Boudreau Gardens: garden design and care in Toronto and the GTA.
Next.js 14 (App Router), TypeScript and Tailwind. Hosted on Vercel.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Editing the content

Nearly all copy and business facts live in **`lib/site.ts`**:

- `site`: name, phone, email, `yearsProfessional`, `education`, response time, the "last updated" date for the legal pages
- `gtaRegions`: the service area (also drives the footer and the postal code checker on /contact)
- `approach`, `services`, `principles`, `contactSteps`: page copy
- `projects`: the Work page. Each has a `plan` that the before/after drawings are generated from.
  To use real photos instead, add `photos: { before: "/work/x-before.jpg", after: "/work/x-after.jpg" }`
  and put the files in `public/work/`.
- `testimonials`: the plant-tag quotes, each tied to a project by `project`
- `monthlyTasks`: the "This month in a Toronto garden" calendar (zone 5b to 6a), one entry per month

Search the code for `TODO` and `PLACEHOLDER` to find everything that still needs confirming.

## Contact form

The form posts to `app/api/contact/route.ts`, which sends the message by email through
[Resend](https://resend.com). Set these environment variables in Vercel (Project → Settings → Environment Variables):

| Variable | Required | What it is |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | API key from Resend |
| `CONTACT_TO` | yes | Where enquiries go (comma-separate for several) |
| `CONTACT_FROM` | no | Sender, e.g. `Shannon Boudreau Gardens <hello@yourdomain.ca>`. Must be on a domain verified in Resend. Defaults to Resend's test sender. |

If the variables aren't set, the API returns 503 and the form tells the visitor their message was **not** sent and
gives them the email address and phone number instead. It never shows a fake success.

## Privacy

The site sets no cookies and loads no analytics, trackers or third-party scripts. Fonts are self-hosted through
`@fontsource`. The first-visit privacy note remembers its dismissal in `localStorage`, not a cookie. If you add
analytics, a map or video embed later, update the privacy note, `/privacy`, and this section.

## Logo

`npm run logo` regenerates the web logos from the originals in the repo root (`Garden Logo Long.png` and
`square logo.png`, which are never modified): `public/logo-long.png`, `public/logo-long-light.png`,
`public/monogram.png`, `public/monogram-light.png`, `app/apple-icon.png` and `app/opengraph-image.png`.

## Before launch: placeholders to replace

- [ ] **Second degree field**: `site.education.secondField` in `lib/site.ts` (currently "TODO confirm")
- [ ] **Years of professional experience**: `site.yearsProfessional` ("3+" or "3-4")
- [ ] **Phone and email**: `site.phone`, `site.phoneHref`, `site.email`
- [ ] **Domain**: `site.url`
- [ ] **Response time and season note**: `site.responseTime`, `site.seasonNote`
- [ ] **Service area**: `gtaRegions` (and the postal code rules in `lib/postal.ts` if it changes)
- [ ] **Testimonials**: every quote and first name in `testimonials` is a placeholder. Replace with real client quotes, with permission.
- [ ] **Projects**: the four projects and their planting plans are illustrative placeholders
- [ ] **Photos**: project photos (see `photos` above) and the portrait on /about (`app/about/page.tsx`)
- [ ] **Privacy policy and terms**: `app/privacy/page.tsx` and `app/terms/page.tsx` are drafts. Have Shannon review them (and confirm the email retention period). They are not legal advice.
- [ ] **Contact form**: set the Resend environment variables above
