import CandleChart from "@/app/components/candlechart";

export default function Page() {
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Charts</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2 flex h-full w-full items-center justify-center rounded-md bg-gray-50 p-4 text-sm font-medium">
          Chart 1
        </div>
        <div className="col-span-2 flex h-full w-full items-center justify-center rounded-md bg-gray-50 p-4 text-sm font-medium">
          Chart 2
        </div>
      </div>
    </main>
  );
}
