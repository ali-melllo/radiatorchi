"use client";

/** Last-resort boundary. It sits outside the i18n provider, so it shows both languages. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", background: "#090a0d", color: "#eef0f3" }}>
        <h1>مشکلی پیش آمد / Something went wrong</h1>
        <p>صفحه بارگذاری نشد. دوباره تلاش کنید. / The page failed to load. Please try again.</p>
        <button
          onClick={reset}
          style={{ background: "#f01420", color: "#fff", border: 0, padding: "0.75rem 1.5rem", fontWeight: 700, cursor: "pointer" }}
        >
          تلاش دوباره / Try again
        </button>
      </body>
    </html>
  );
}
