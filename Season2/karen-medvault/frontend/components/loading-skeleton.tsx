import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FileListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upload Card Skeleton */}
      <Card className="p-8 border-2 border-dashed border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </Card>

      {/* File List Skeleton */}
      <FileListSkeleton />
    </div>
  )
}

export function AccessControlSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="p-6">
          <Skeleton className="h-5 w-24 mb-4" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-12" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
