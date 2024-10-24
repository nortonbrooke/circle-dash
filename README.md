This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies:

```bash
npm install
```

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

src/\
-app/\
--components/\
---Modal.tsx\
---PaymentForm.tsx\
--constants.ts\
--page.tsx\
--page.module.tsx\
--global.css

### PaymentForm

This component handles the payment submission process. It allows users to select a sender and receiver, input an amount, choose a currency, and add an optional memo.

### Modal

This component provides a modal dialog for user interaction and is used for the rendering the PaymentForm.

### Constants

This file defines the following types supported by the application

- Currency: list of currencies
- Payment: structure of a payment data
- User: structure of user data

### Page

This file contains the main logic for the application's page, including state management and data fetching. It renders the payments list and payment creation components. The payments are fetched from the backend server every second and are displayed in descending order of creation time. The search bar allows filtering payments by any payment field.

## Backend Server

The app interacts with the backend server (presumably running on `http://localhost:8080`) to fetch user data and payments, and submit payment information. The server is expected to return JSON responses, which the app processes to update the UI.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
