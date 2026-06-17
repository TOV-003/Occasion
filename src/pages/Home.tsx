import { Search, CalendarDays, MapPin, ChevronDown } from "lucide-react";
import { useLoaderData } from 'react-router-dom'
import { useState } from 'react';
import Layout from '../Layout';
import type { Event } from '../interfaces';
export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [randomNumber] = useState(() => Math.floor(Math.random() * 0) + 0);
    const { featuredEvents, allEvents } = useLoaderData();
    console.log(featuredEvents);
    console.log("All events: ", allEvents);
    const categories = ['All', 'Nightlife', 'Festival', 'Arts', 'Sports', 'Food', 'Business', 'Education', 'Social', 'Family', 'Wellness'];
    const categoryStyles: Record<string, { bg: string; text: string }> = {
        All: { bg: 'bg-gray-200', text: 'text-gray-800' },
        Nightlife: { bg: 'bg-purple-200', text: 'text-purple-800' },
        Festival: { bg: 'bg-yellow-300', text: 'text-yellow-900' },
        Arts: { bg: 'bg-pink-200', text: 'text-pink-800' },
        Sports: { bg: 'bg-blue-200', text: 'text-blue-800' },
        Food: { bg: 'bg-orange-200', text: 'text-orange-800' },
        Business: { bg: 'bg-indigo-200', text: 'text-indigo-800' },
        Education: { bg: 'bg-green-200', text: 'text-green-800' },
        Social: { bg: 'bg-rose-200', text: 'text-rose-800' },
        Family: { bg: 'bg-teal-200', text: 'text-teal-800' },
        Wellness: { bg: 'bg-emerald-200', text: 'text-emerald-800' },
    };
    return (
        <Layout>
            <main className="flex flex-col gap-16 items-center lg:items-start  px-4 py-8 lg:px-16 lg:py-16">
                <div className="flex flex-col items-center lg:items-start justify-end ">
                    <h1 className="text-2xl">So, What's the <span className="text-accent">Occasion</span>?</h1>
                    <p className="text-md font-light text-inputaccent">
                        Curated events from collectives and independent organisers across the city.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 max-w-2xl justify-center">
                        <div className="relative flex-1 min-w-45">
                            <Search
                                color="var(--color-inputaccent)"
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="text"
                                placeholder="Search events…"
                                className="w-full bg-inputbg/30 border-inputaccent pl-9 pr-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-ring placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="relative">
                            <CalendarDays
                                color="var(--color-inputaccent)"
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />
                            <input
                                type="date"
                                className="bg-inputbg/30 border-inputaccent pl-9 pr-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-ring text-muted-foreground appearance-none"
                            />
                        </div>

                        <div className="relative">
                            <MapPin
                                color="var(--color-inputaccent)"
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />
                            <select
                                className="bg-inputbg/30 border-inputaccent pl-9 pr-8 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-ring text-muted-foreground appearance-none cursor-pointer"
                            >
                                <option value="">All cities</option>
                                <option value="lagos">Lagos</option>
                                <option value="abuja">Abuja</option>
                                <option value="port-harcourt">Port Harcourt</option>
                            </select>
                            <ChevronDown
                                size={13}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />
                        </div>
                    </div>
                    <div className="flex w-fit flex-wrap justify-center gap-2 mt-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={
                                    selectedCategory === cat
                                        ? 'bg-accent text-white px-2 py-0.5 rounded-2xl border border-accent-dark text-sm cursor-pointer'
                                        : ' text-inputaccent px-2 py-0.5 rounded-2xl border border-inputaccent text-sm cursor-pointer font-light'
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <hr className="border-b-1/2 w-screen self-center border-inputaccent/50" />
                <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                    <h2 className="text-xl">Featured</h2>
                    <div className=" rounded-xl relative w-full h-fit aspect-square shadow-lg shadow-accent-dark/20">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                            <img
                                src={featuredEvents[randomNumber].event_banner_url}
                                alt="featured event"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent via-60% to-black pointer-events-none" />
                        </div>
                        <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10 text-white">
                            <div className={`
                                rounded-full px-3 py-1 text-xs font-medium w-fit mt-1
                                    ${categoryStyles[featuredEvents[randomNumber].event_category]
                                    ? `${categoryStyles[featuredEvents[randomNumber].event_category].bg} ${categoryStyles[featuredEvents[randomNumber].event_category].text}`
                                    : `${categoryStyles.All.bg} ${categoryStyles.All.text}`
                                }
                                `}>
                                {featuredEvents[randomNumber].event_category}
                            </div>
                            <h2 className="text-2xl font-bold">{featuredEvents[randomNumber].event_title}</h2>
                            <p className="text-sm text-white">
                                {featuredEvents[randomNumber].event_date}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                    <h2 className="text-xl">All Events</h2>
                    <div className="flex flex-wrap gap-6 w-full justify-center">
                        {allEvents.slice(0, 10).map((ev: Event) => (
                            <div className="group rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent">
                                <div className="relative w-full aspect-square overflow-hidden">
                                    <img
                                        src={ev.banner_url}
                                        alt={ev.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 p-4">
                                    <div className={`
                                        rounded-full px-3 py-1 text-xs font-medium w-fit
                                            ${categoryStyles[ev.category]
                                            ? `${categoryStyles[ev.category].bg} ${categoryStyles[ev.category].text}`
                                            : `${categoryStyles.All.bg} ${categoryStyles.All.text}`
                                        }
                                        `}>
                                        {ev.category}
                                    </div>
                                    <h2 className="text-lg font-semibold">{ev.title}</h2>
                                    <p className="text-sm font-light text-inputaccent">
                                        {ev.location}, {ev.city}
                                    </p>
                                    <p className="text-sm font-light text-inputaccent">
                                        {ev.created_at}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        </Layout>
    )
}
