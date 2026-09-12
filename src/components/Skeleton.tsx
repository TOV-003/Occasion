import type { HTMLAttributes } from "react";
import { Search, CalendarDays } from "lucide-react";

type SkeletonTone = "gray" | "light" | "white" | "input" | "transparent";

const SKELETON_TONE_CLASS: Record<SkeletonTone, string> = {
    gray: "bg-gray-200",
    light: "bg-gray-300",
    white: "bg-white",
    input: "bg-inputbg/30",
    transparent: "bg-transparent",
};

interface SkeletonBoxProps extends HTMLAttributes<HTMLDivElement> {
    tone?: SkeletonTone;
}

function SkeletonBox({ tone = "gray", className = "", ...rest }: SkeletonBoxProps) {
    return <div {...rest} className={`${SKELETON_TONE_CLASS[tone]} animate-pulse ${className}`.trim()} />;
}

interface SkeletonProps {
    variant?: "home" | "events" | "collectives" | "dashboard" | "event" | "collective" | "profile" | "settings" | "manageCollective";
}
export default function Skeleton({ variant = "home" }: SkeletonProps) {
    if (variant === "dashboard") {
        return (<main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <SkeletonBox className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                            <SkeletonBox className="h-8 w-48 rounded" />
                            <SkeletonBox className="h-4 w-64 rounded" />
                        </div>
                    </div>
                    <SkeletonBox className="h-10 w-28 rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[...Array(4)].map(function (_, i) {
                return (<div key={i} className="rounded-xl border border-inputaccent/20 bg-transparent p-4">
                            <SkeletonBox className="h-4 w-20 rounded" />
                            <SkeletonBox className="mt-3 h-8 w-16 rounded" />
                            <SkeletonBox className="mt-2 h-3 w-24 rounded" />
                        </div>);
            })}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4 rounded-2xl border border-inputaccent/20 bg-transparent p-6">
                        <SkeletonBox className="h-6 w-32 rounded" />
                        {[...Array(4)].map(function (_, i) {
                return (<div key={i} className="flex items-center gap-4 rounded-xl border border-inputaccent/10 p-3">
                                <SkeletonBox className="h-16 w-16 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <SkeletonBox className="h-4 w-3/4 rounded" />
                                    <SkeletonBox className="h-3 w-1/2 rounded" />
                                </div>
                                <SkeletonBox className="h-7 w-20 rounded" />
                            </div>);
            })}
                    </div>

                    <div className="space-y-4 rounded-2xl border border-inputaccent/20 bg-transparent p-6">
                        <SkeletonBox className="h-6 w-32 rounded" />
                        {[...Array(4)].map(function (_, i) {
                return (<div key={i} className="flex items-center gap-3">
                                <SkeletonBox className="h-9 w-9 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <SkeletonBox className="h-4 w-3/4 rounded" />
                                    <SkeletonBox className="h-3 w-1/2 rounded" />
                                </div>
                            </div>);
            })}
                    </div>
                </div>
            </main>);
    }
    if (variant === "event" || variant === "collective") {
        return (<main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <SkeletonBox className="h-5 w-36 rounded" />
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <SkeletonBox className="aspect-square w-full rounded-2xl" />
                        <div className="space-y-3 rounded-2xl border border-inputaccent/20 bg-transparent p-6">
                            <SkeletonBox className="h-8 w-2/3 rounded" />
                            <SkeletonBox className="h-4 w-full rounded" />
                            <SkeletonBox className="h-4 w-5/6 rounded" />
                            <SkeletonBox className="h-4 w-3/4 rounded" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {[...Array(4)].map(function (_, i) {
                return (<SkeletonBox key={i} tone="transparent" className="h-20 rounded-xl border border-inputaccent/20 p-4" />);
            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-inputaccent/20 bg-transparent p-6">
                            <SkeletonBox className="h-6 w-24 rounded" />
                            <div className="mt-4 space-y-3">
                                <SkeletonBox className="h-10 rounded" />
                                <SkeletonBox className="h-10 rounded" />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-inputaccent/20 bg-transparent p-6">
                            <SkeletonBox className="h-6 w-24 rounded" />
                            <div className="mt-4 space-y-3">
                                {[...Array(4)].map(function (_, i) {
                return (<div key={i} className="flex items-center gap-3">
                                        <SkeletonBox className="h-8 w-8 rounded-full" />
                                        <SkeletonBox className="h-4 w-24 rounded" />
                                    </div>);
            })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>);
    }
    if (variant === "profile") {
        return (<main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="rounded-2xl border border-inputaccent/20 bg-transparent p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <SkeletonBox className="h-20 w-20 rounded-full" />
                            <div className="space-y-2">
                                <SkeletonBox className="h-8 w-48 rounded" />
                                <SkeletonBox className="h-4 w-56 rounded" />
                            </div>
                        </div>
                        <SkeletonBox className="h-10 w-32 rounded-lg" />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {[...Array(3)].map(function (_, i) {
                return (<div key={i} className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                            <SkeletonBox className="h-4 w-20 rounded" />
                            <SkeletonBox className="mt-3 h-8 w-16 rounded" />
                        </div>);
            })}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {[...Array(4)].map(function (_, i) {
                return (<div key={i} className="rounded-2xl border border-inputaccent/20 bg-transparent p-5">
                            <SkeletonBox className="mb-4 h-6 w-32 rounded" />
                            <SkeletonBox className="h-32 rounded-xl" />
                        </div>);
            })}
                </div>
            </main>);
    }
    if (variant === "settings") {
        return (<main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 lg:px-8 lg:py-12">
                <SkeletonBox className="h-8 w-48 rounded" />
                <SkeletonBox className="h-32 w-32 rounded-full" />
                {[...Array(3)].map(function (_, i) {
                return (<div key={i} className="space-y-2">
                        <SkeletonBox className="h-4 w-20 rounded" />
                        <SkeletonBox tone="white" className="h-12 w-full rounded-lg border border-inputaccent/20" />
                    </div>);
            })}
                <div className="flex gap-4">
                    <SkeletonBox className="h-10 w-32 rounded-md" />
                    <SkeletonBox className="h-10 w-28 rounded-md" />
                    <SkeletonBox className="h-10 w-36 rounded-md" />
                </div>
            </main>);
    }
    if (variant === "manageCollective") {
        return (<main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <SkeletonBox className="h-5 w-36 rounded" />
                <div className="rounded-2xl border border-inputaccent/20 bg-white p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <SkeletonBox className="h-14 w-14 rounded-xl" />
                            <div className="space-y-2">
                                <SkeletonBox className="h-6 w-40 rounded" />
                                <SkeletonBox className="h-4 w-52 rounded" />
                            </div>
                        </div>
                        <SkeletonBox className="h-9 w-28 rounded-full" />
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {[...Array(3)].map(function (_, i) {
                return (<div key={i} className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <SkeletonBox className="h-4 w-20 rounded" />
                                <SkeletonBox className="mt-3 h-8 w-16 rounded" />
                            </div>);
            })}
                    </div>
                </div>

                <div className="rounded-2xl border border-inputaccent/20 bg-transparent p-6">
                    <div className="mb-4 flex gap-2">
                        <SkeletonBox className="h-10 flex-1 rounded-md" />
                        <SkeletonBox className="h-10 flex-1 rounded-md" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map(function (_, i) {
                return (<div key={i} className="rounded-xl border border-inputaccent/20 bg-transparent p-4">
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <SkeletonBox className="h-28 w-full rounded-lg sm:w-40" />
                                    <div className="flex-1 space-y-3">
                                        <SkeletonBox className="h-5 w-2/3 rounded" />
                                        <SkeletonBox className="h-4 w-full rounded" />
                                        <SkeletonBox className="h-4 w-5/6 rounded" />
                                        <SkeletonBox className="h-10 w-40 rounded-lg" />
                                    </div>
                                </div>
                            </div>);
            })}
                    </div>
                </div>
            </main>);
    }
    if (variant === "events" || variant === "collectives") {
        return (<main className="flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:mx-auto lg:px-8 lg:py-12">
                <div className="flex flex-col items-center justify-end w-full lg:items-start">
                    <SkeletonBox className="h-8 w-48 rounded" />
                    <SkeletonBox className="mt-2 h-5 w-80 rounded" />
                    <div className="mt-6 w-full max-w-2xl">
                        <SkeletonBox tone="input" className="h-11 w-full rounded-lg border border-inputaccent/20" />
                    </div>
                </div>

                <div className="w-full rounded-2xl border border-inputaccent/20 bg-transparent p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <SkeletonBox className="h-6 w-32 rounded" />
                        <SkeletonBox className="h-4 w-24 rounded" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {[...Array(6)].map(function (_, i) {
                return (<div key={i} className="rounded-xl border border-inputaccent/20 bg-transparent p-4">
                                <SkeletonBox className="h-40 w-full rounded-lg" />
                                <SkeletonBox className="mt-4 h-5 w-2/3 rounded" />
                                <SkeletonBox className="mt-3 h-4 w-full rounded" />
                                <SkeletonBox className="mt-2 h-4 w-5/6 rounded" />
                            </div>);
            })}
                    </div>
                </div>
            </main>);
    }
    return (<main className="flex flex-col gap-16 items-center lg:items-start px-4 py-8 lg:px-16 lg:py-16 lg:max-w-6xl lg:mx-auto">
            <div className="flex flex-col items-center lg:items-start justify-end w-full">
                <SkeletonBox className="h-8 w-64 rounded" />
                <SkeletonBox className="h-5 w-96 rounded mt-2" />

                <div className="mt-6 flex flex-wrap gap-2 max-w-2xl justify-center w-full">
                    <div className="relative flex-1 min-w-45">
                        <Search color="var(--color-inputaccent)" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                        <SkeletonBox tone="input" className="w-full border-inputaccent pl-9 pr-4 py-3 rounded-lg border h-11" />
                    </div>

                    <div className="relative">
                        <CalendarDays color="var(--color-inputaccent)" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"/>
                        <SkeletonBox tone="input" className="border-inputaccent pl-9 pr-4 py-3 rounded-lg border h-11 w-40" />
                    </div>
                </div>

                <div className="flex w-fit flex-wrap justify-center gap-2 mt-4">
                    {[...Array(7)].map(function (_, i) {
            return (<SkeletonBox key={i} className="h-7 w-16 rounded-2xl" />);
        })}
                </div>
            </div>

            <hr className="border-b-1/2 w-screen self-center border-inputaccent/50"/>

            <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                <SkeletonBox className="h-7 w-32 rounded" />
                <SkeletonBox className="rounded-xl relative w-full h-fit aspect-square shadow-lg shadow-accent-dark/20">
                    <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10">
                        <SkeletonBox tone="light" className="h-6 w-20 rounded-full" />
                        <SkeletonBox tone="light" className="h-8 w-48 rounded mt-2" />
                        <SkeletonBox tone="light" className="h-5 w-32 rounded mt-1" />
                    </div>
                </SkeletonBox>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                <SkeletonBox className="h-7 w-40 rounded" />
                <div className="flex flex-wrap gap-6 w-full justify-center">
                    {[...Array(6)].map(function (_, i) {
            return (<div key={i} className="rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-transparent">
                            <SkeletonBox className="relative w-full aspect-square" />
                            <div className="flex flex-col gap-2 p-4">
                                <SkeletonBox className="h-5 w-16 rounded-full" />
                                <SkeletonBox className="h-6 w-3/4 rounded" />
                                <SkeletonBox className="h-4 w-1/2 rounded" />
                                <SkeletonBox className="h-4 w-2/3 rounded" />
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <SkeletonBox className="h-4 w-1/3 rounded" />
                                    <div className="w-full h-1.5 rounded-full bg-inputaccent/15 overflow-hidden">
                                        <SkeletonBox tone="light" className="h-full rounded-full w-3/4" />
                                    </div>
                                </div>
                            </div>
                        </div>);
        })}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                <div className="flex items-center w-full justify-between">
                    <SkeletonBox className="h-7 w-32 rounded" />
                    <SkeletonBox className="h-4 w-40 rounded" />
                </div>
                <div className="flex flex-wrap gap-6 w-full justify-center">
                    {[...Array(4)].map(function (_, i) {
            return (<div key={i} className="rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-transparent">
                            <div className="flex flex-col gap-2 p-4">
                                <SkeletonBox className="flex items-center justify-center p-6 rounded-lg h-14 w-14 aspect-square" />
                                <SkeletonBox className="h-6 w-3/4 rounded" />
                                <SkeletonBox className="h-4 w-full rounded" />
                                <div className="flex gap-2">
                                    <SkeletonBox className="h-4 w-24 rounded" />
                                    <SkeletonBox className="h-4 w-24 rounded" />
                                </div>
                            </div>
                        </div>);
        })}
                </div>
            </div>
        </main>);
}
