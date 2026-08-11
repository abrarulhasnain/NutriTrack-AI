import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 pb-10">
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-4 w-32 mb-6" />

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex justify-center mb-6">
        <Skeleton className="h-40 w-40 rounded-full" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-24 rounded-full mx-auto" />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  )
}
