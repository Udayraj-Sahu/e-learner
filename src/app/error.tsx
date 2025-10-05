// app/error.tsx
"use client";
export default function GlobalError({ error }: { error: unknown }) {
  console.error(error);
  return (
    <html>
      <body className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-gray-600">Please try again.</p>
      </body>
    </html>
  );
}
