import { Search, CalendarDays } from "lucide-react";

interface SkeletonProps {
    variant?: "home" | "dashboard";
}

export default function Skeleton({ variant = "home" }: SkeletonProps) {
    if (variant === "dashboard") {
        return (
            <main className="flex flex-col gap-8 px-4 py-8 lg:px-8 lg:py-8 lg:max-w-6xl lg:mx-auto">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 border border-inputaccent/20">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-8 w-20 bg-gray-200 rounded mt-2 animate-pulse" />
                            <div className="h-3 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-inputaccent/20 p-6">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                        <div className="mt-4 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 w-1/2 bg-gray-200 rounded mt-1 animate-pulse" />
                                    </div>
                                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-inputaccent/20 p-6">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="mt-4 space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 w-1/3 bg-gray-200 rounded mt-1 animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col gap-16 items-center lg:items-start px-4 py-8 lg:px-16 lg:py-16 lg:max-w-6xl lg:mx-auto">
            <div className="flex flex-col items-center lg:items-start justify-end w-full">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-96 bg-gray-200 rounded mt-2 animate-pulse" />

                <div className="mt-6 flex flex-wrap gap-2 max-w-2xl justify-center w-full">
                    <div className="relative flex-1 min-w-45">
                        <Search
                            color="var(--color-inputaccent)"
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <div className="w-full bg-inputbg/30 border-inputaccent pl-9 pr-4 py-3 rounded-lg border h-11 animate-pulse" />
                    </div>

                    <div className="relative">
                        <CalendarDays
                            color="var(--color-inputaccent)"
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <div className="bg-inputbg/30 border-inputaccent pl-9 pr-4 py-3 rounded-lg border h-11 w-40 animate-pulse" />
                    </div>
                </div>

                <div className="flex w-fit flex-wrap justify-center gap-2 mt-4">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-7 w-16 bg-gray-200 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>

            <hr className="border-b-1/2 w-screen self-center border-inputaccent/50" />

            <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="rounded-xl relative w-full h-fit aspect-square shadow-lg shadow-accent-dark/20 bg-gray-200 animate-pulse">
                    <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10">
                        <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse" />
                        <div className="h-8 w-48 bg-gray-300 rounded mt-2 animate-pulse" />
                        <div className="h-5 w-32 bg-gray-300 rounded mt-1 animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="flex flex-wrap gap-6 w-full justify-center">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-white">
                            <div className="relative w-full aspect-square bg-gray-200 animate-pulse" />
                            <div className="flex flex-col gap-2 p-4">
                                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-full h-1.5 rounded-full bg-inputaccent/15 overflow-hidden">
                                        <div className="h-full rounded-full bg-gray-300 w-3/4 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                <div className="flex items-center w-full justify-between">
                    <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-6 w-full justify-center">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-white">
                            <div className="flex flex-col gap-2 p-4">
                                <div className="flex items-center justify-center p-6 bg-gray-200 rounded-lg h-14 w-14 aspect-square animate-pulse" />
                                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}