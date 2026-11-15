export default function Loading() {
  return (
    <div className="container-x py-14" aria-busy="true">
      <div className="h-10 w-1/3 animate-pulse bg-surface-2" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-80 animate-pulse bg-surface-2" />
        ))}
      </div>
    </div>
  );
}
