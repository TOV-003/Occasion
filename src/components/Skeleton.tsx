import { Search, CalendarDays } from "lucide-react";

interface SkeletonProps {
    variant?:
    | "home"
    | "events"
    | "collectives"
    | "dashboard"
    | "event"
    | "collective"
    | "profile"
    | "settings"
    | "manageCollective";
}

export default function Skeleton({ variant = "home" }: SkeletonProps) {
    if (variant === "dashboard") {
        return (
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
                        </div>
                    </div>
                    <div className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-inputaccent/20 bg-white p-4">
                            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                            <div className="mt-3 h-8 w-16 rounded bg-gray-200 animate-pulse" />
                            <div className="mt-2 h-3 w-24 rounded bg-gray-200 animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4 rounded-2xl border border-inputaccent/20 bg-white p-6">
                        <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 rounded-xl border border-inputaccent/10 p-3">
                                <div className="h-16 w-16 rounded-lg bg-gray-200 animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                                    <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
                                </div>
                                <div className="h-7 w-20 rounded bg-gray-200 animate-pulse" />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 rounded-2xl border border-inputaccent/20 bg-white p-6">
                        <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                                    <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (variant === "event" || variant === "collective") {
        return (
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="h-5 w-36 rounded bg-gray-200 animate-pulse" />
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="aspect-square w-full rounded-2xl bg-gray-200 animate-pulse" />
                        <div className="space-y-3 rounded-2xl border border-inputaccent/20 bg-white p-6">
                            <div className="h-8 w-2/3 rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 rounded-xl border border-inputaccent/20 bg-white p-4 animate-pulse" />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-inputaccent/20 bg-white p-6">
                            <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
                            <div className="mt-4 space-y-3">
                                <div className="h-10 rounded bg-gray-200 animate-pulse" />
                                <div className="h-10 rounded bg-gray-200 animate-pulse" />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-inputaccent/20 bg-white p-6">
                            <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
                            <div className="mt-4 space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                                        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (variant === "profile") {
        return (
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="rounded-2xl border border-inputaccent/20 bg-white p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
                                <div className="h-4 w-56 rounded bg-gray-200 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                            <div className="mt-3 h-8 w-16 rounded bg-gray-200 animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-inputaccent/20 bg-white p-5">
                            <div className="mb-4 h-6 w-32 rounded bg-gray-200 animate-pulse" />
                            <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />
                        </div>
                    ))}
                </div>
            </main>
        );
    }

    if (variant === "settings") {
        return (
            <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 lg:px-8 lg:py-12">
                <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
                <div className="h-32 w-32 rounded-full bg-gray-200 animate-pulse" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                        <div className="h-12 w-full rounded-lg border border-inputaccent/20 bg-white animate-pulse" />
                    </div>
                ))}
                <div className="flex gap-4">
                    <div className="h-10 w-32 rounded-md bg-gray-200 animate-pulse" />
                    <div className="h-10 w-28 rounded-md bg-gray-200 animate-pulse" />
                    <div className="h-10 w-36 rounded-md bg-gray-200 animate-pulse" />
                </div>
            </main>
        );
    }

    if (variant === "manageCollective") {
        return (
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="h-5 w-36 rounded bg-gray-200 animate-pulse" />
                <div className="rounded-2xl border border-inputaccent/20 bg-white p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-xl bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
                                <div className="h-4 w-52 rounded bg-gray-200 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-9 w-28 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                                <div className="mt-3 h-8 w-16 rounded bg-gray-200 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-inputaccent/20 bg-white p-6">
                    <div className="mb-4 flex gap-2">
                        <div className="h-10 flex-1 rounded-md bg-gray-200 animate-pulse" />
                        <div className="h-10 flex-1 rounded-md bg-gray-200 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-xl border border-inputaccent/20 bg-white p-4">
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="h-28 w-full rounded-lg bg-gray-200 animate-pulse sm:w-40" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 w-2/3 rounded bg-gray-200 animate-pulse" />
                                        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                                        <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
                                        <div className="h-10 w-40 rounded-lg bg-gray-200 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (variant === "events" || variant === "collectives") {
        return (
            <main className="flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:mx-auto lg:px-8 lg:py-12">
                <div className="flex flex-col items-center justify-end w-full lg:items-start">
                    <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-2 h-5 w-80 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-6 w-full max-w-2xl">
                        <div className="h-11 w-full rounded-lg border border-inputaccent/20 bg-inputbg/30 animate-pulse" />
                    </div>
                </div>

                <div className="w-full rounded-2xl border border-inputaccent/20 bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
                        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-xl border border-inputaccent/20 bg-white p-4">
                                <div className="h-40 w-full rounded-lg bg-gray-200 animate-pulse" />
                                <div className="mt-4 h-5 w-2/3 rounded bg-gray-200 animate-pulse" />
                                <div className="mt-3 h-4 w-full rounded bg-gray-200 animate-pulse" />
                                <div className="mt-2 h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
                            </div>
                        ))}
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