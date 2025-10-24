This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
1. npm run build
2. npx tsc --noEmit


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


### Build results:

```

> my-static-ecommerce@0.1.0 build
> next build

   ▲ Next.js 15.5.5
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 8.4s
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000". See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
 ✓ Generating static pages (16/16)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                                 Size  First Load JS
┌ ○ /                                    12.8 kB         131 kB
├ ○ /_not-found                            995 B         103 kB
├ ○ /about                               1.76 kB         151 kB
├ ƒ /api/orders                            136 B         102 kB
├ ƒ /api/products                          136 B         102 kB
├ ƒ /api/search                            136 B         102 kB
├ ○ /cart                                3.61 kB         156 kB
├ ○ /checkout                            11.3 kB         164 kB
├ ○ /order-confirmation                  2.06 kB         155 kB
├ ƒ /product/[category]/[slug]           8.28 kB         124 kB
├ ○ /robots.txt                            136 B         102 kB
├ ○ /search                               2.9 kB         113 kB
├ ○ /shop                                1.97 kB         157 kB
└ ○ /sitemap.xml                           136 B         102 kB
+ First Load JS shared by all             102 kB
  ├ chunks/255-839588e0f3decf6f.js       45.7 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  └ other shared chunks (total)          1.93 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```