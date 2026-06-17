import { Search, CalendarDays, MapPin, Users, ChevronRight } from "lucide-react";
import { useLoaderData, Link } from 'react-router-dom'
import { useState, useMemo } from 'react';
import Layout from '../Layout';
import Fuse from 'fuse.js';
import Skeleton from '../components/Skeleton';
import type { Event, EventDate, Tickets, CollectiveWithRelations } from '../interfaces';

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filter, setFilter] = useState('');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [randomNumber] = useState(() => Math.floor(Math.random() * 0) + 0);
    const { featuredEvents, allEvents, eventDates, tickets, collectives } = useLoaderData();
    console.log(featuredEvents);
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

    const fuse = useMemo(() => new Fuse(allEvents, {
        keys: ['title', 'city', 'location'],
        threshold: 0.3,
    }), [allEvents]);

    const results = useMemo(() => {
        const events = query.trim()
            ? fuse.search(query).map(result => result.item)
            : allEvents;

        return events.sort((a: Event, b: Event) => {
            const getEarliest = (ev: Event) => {
                if (!ev.event_dates || ev.event_dates.length === 0) {
                    return '9999-12-31';
                }
                return ev.event_dates.map(d => d.date).sort()[0];
            };
            setLoading(false);
            return getEarliest(a).localeCompare(getEarliest(b));
        });
    }, [query, fuse, allEvents]);

    const showCategory = (category: string) => {
        setSelectedCategory(category);
        setFilter(category);
    }

    const showAll = () => {
        setSelectedCategory('All');
        setFilter('');
    }

    if (loading) {
        return <Skeleton variant="home" />;
    }

    return (
        <Layout>
            <main className="flex flex-col gap-16 items-center lg:items-start  px-4 py-8 lg:px-64 lg:py-16">
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
                                placeholder="Search events,cities,locations..."
                                className="w-full bg-inputbg/30 border-inputaccent pl-9 pr-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-ring placeholder:text-muted-foreground"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
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
                    </div>
                    <div className="flex w-fit flex-wrap justify-center gap-2 mt-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={
                                    () => {
                                        if (cat === 'All') {
                                            showAll();
                                            return;
                                        }
                                        showCategory(cat);
                                    }}
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
                {filter === '' && query === '' &&
                    <Link to={`/event/${featuredEvents[randomNumber].event_id}`} className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                        <h2 className="text-xl">Featured</h2>
                        <div className=" rounded-xl relative w-full h-fit aspect-square shadow-lg shadow-accent-dark/20">
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                                <img
                                    src={featuredEvents[randomNumber].event_banner_url}
                                    alt="featured event"
                                    fetchPriority="high"
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
                    </Link>
                }
                <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                    <h2 className="text-xl">All {filter || ""} Events</h2>
                    <div className="flex flex-wrap gap-6 w-full justify-center">
                        {!filter && results.slice(0, 10).map((ev: Event) => (
                            <Link to={`/event/${ev.id}`} key={ev.id} className="group rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent">
                                <div className="relative w-full aspect-square overflow-hidden">
                                    <img
                                        src={ev.banner_url}
                                        alt={ev.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex relative flex-col gap-2 p-4">
                                    <div className={`
                                        rounded-full px-3 py-1 text-xs font-medium w-fit
                                            ${categoryStyles[ev.category]
                                            ? `${categoryStyles[ev.category].bg} ${categoryStyles[ev.category].text}`
                                            : `${categoryStyles.All.bg} ${categoryStyles.All.text}`
                                        }
                                        `}>
                                        {ev.category}
                                    </div>
                                    <h2 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">{ev.title}</h2>
                                    <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                        <MapPin size={15} />
                                        <span>{ev.location}, {ev.city}</span>
                                    </p>
                                    <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                        <CalendarDays size={15} />
                                        {
                                            eventDates
                                                .filter((date: EventDate) => date.event_id === ev.id)
                                                .map((date: EventDate, index: number, array: EventDate[]) => (
                                                    <span key={date.id}>
                                                        {new Date(date.date).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            timeZone: 'UTC',
                                                        })}
                                                        {index < array.length - 1 && ' / '}
                                                    </span>
                                                ))
                                        }
                                    </p>
                                    {(() => {
                                        const registered = tickets.filter(
                                            (ticket: Tickets) => ticket.event_id === ev.id && ticket.status === "approved"
                                        ).length;
                                        const maxAttendees = ev.max_attendees || 0;
                                        const percentage = maxAttendees
                                            ? Math.min((registered / maxAttendees) * 100, 100)
                                            : 0;

                                        return (
                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-sm font-light text-inputaccent flex flex-row items-center gap-2">
                                                    <Users size={15} />
                                                    <span>{registered} / {ev.max_attendees}</span>
                                                    {
                                                        registered === ev.max_attendees &&
                                                        <span className="text-xs bg-red-200 rounded-xl font-bold py-1 px-4 text-red-700">Full</span>
                                                    }
                                                </p>
                                                <div className="w-full h-1.5 rounded-full bg-inputaccent/15 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-accent transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </Link>
                        ))}
                        {filter && results.filter((ev: Event) => ev.category === filter).slice(0, 10).map((ev: Event) => (
                            <Link to={`/event/${ev.id}`} key={ev.id} className="group rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent">
                                <div className="relative w-full aspect-square overflow-hidden">
                                    <img
                                        src={ev.banner_url}
                                        alt={ev.title}
                                        loading="lazy"
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
                                    <h2 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">{ev.title}</h2>
                                    <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                        <MapPin size={15} />
                                        <span>{ev.location}, {ev.city}</span>
                                    </p>
                                    <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                        <CalendarDays size={15} />
                                        {
                                            eventDates
                                                .filter((date: EventDate) => date.event_id === ev.id)
                                                .map((date: EventDate, index: number, array: EventDate[]) => (
                                                    <span key={date.id}>
                                                        {new Date(date.date).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            timeZone: 'UTC',
                                                        })}
                                                        {index < array.length - 1 && ' / '}
                                                    </span>
                                                ))
                                        }
                                    </p>
                                    {(() => {
                                        const registered = tickets.filter(
                                            (ticket: Tickets) => ticket.event_id === ev.id && ticket.status === "approved"
                                        ).length;
                                        const maxAttendees = ev.max_attendees || 0;
                                        const percentage = maxAttendees
                                            ? Math.min((registered / maxAttendees) * 100, 100)
                                            : 0;

                                        return (
                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-sm font-light text-inputaccent flex flex-row items-center gap-2">
                                                    <Users size={15} />
                                                    <span>{registered} / {ev.max_attendees}</span>
                                                </p>
                                                <div className="w-full h-1.5 rounded-full bg-inputaccent/15 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-accent transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
                <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                    <div className="flex items-center w-full justify-between">
                        <h2 className="text-xl">Collectives</h2>
                        <p className="text-sm text-inputaccent">Groups & Organisations</p>
                    </div>
                    <div className="flex flex-wrap gap-6 w-full justify-center">
                        {
                            collectives.map((collective: CollectiveWithRelations) => (
                                <div key={collective.id} className="group relative rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent">
                                    <div className="flex flex-col gap-2 p-4">
                                        <div className="flex items-center justify-center p-6 bg-accent/10 rounded-lg h-14 w-14 aspect-sqaure">
                                            <span className="text-3xl font-light text-accent">{collective.name[0]}</span>
                                        </div>
                                        <h2 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">{collective.name}</h2>
                                        <p className="text-sm font-light text-inputaccent flex flex-row gap-2">{collective.description}</p>
                                        <div className="flex gap-2">
                                            <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                                <Users size={15} />
                                                <span>{collective.collective_members.length}</span>
                                                Members
                                            </p>
                                            <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                                <Users size={15} />
                                                <span>{collective.collective_followers.length}</span>
                                                Followers
                                            </p>
                                        </div>
                                        <div className="absolute top-4 right-4 group-hover:scale-140 transition-transform duration-300">
                                            <ChevronRight color="var(--color-inputaccent)" size={15} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </main>
        </Layout>
    )
}