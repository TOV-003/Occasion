import { UseAuth } from "../context/UseAuth";
import { Ticket, Users, MapPin, CalendarDays, ChevronRight } from "lucide-react";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate, useLoaderData, NavLink, Link } from "react-router-dom";
import type { Profile, Tickets, Event, CollectiveMember, CollectiveWithRelations } from "../interfaces";

export default function Dashboard() {
    const { user } = UseAuth();
    const { Profile, Tickets, Events, Collectives, Attending, CollectiveList } = useLoaderData() as {
        Profile: Profile;
        Tickets: Tickets[];
        Events: Event[];
        Collectives: CollectiveMember[];
        Attending: Event[];
        CollectiveList: CollectiveWithRelations[];
    };
    const navigate = useNavigate();
    const [view, setView] = useState<'attending' | 'hosting' | 'collectives' | 'history'>('attending');
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
    const pastTickets = Tickets.filter(ticket => {
        const event = Attending.find(e => e.id === ticket.event_id);
        return event && event.event_dates?.some(d => new Date(d.date).toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10));
    });
    const currentTickets = Tickets.filter(ticket => {
        const event = Attending.find(e => e.id === ticket.event_id);
        return event && event.event_dates?.some(d => new Date(d.date).toISOString().slice(0, 10) > new Date().toISOString().slice(0, 10));
    });
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const setAttendingView = () => {
        setView('attending');
    };
    const setHostingView = () => {
        setView('hosting');
    };
    const setCollectivesView = () => {
        setView('collectives');
    };
    const setHistoryView = () => {
        setView('history');
    };

    return (
        <Layout>
            <main className="flex flex-col gap-4 items-center px-4 py-8 lg:px-8 lg:py-12 lg:max-w-6xl lg:mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-20 w-full">
                    <img src={Profile.avatar_url} alt="Profile Avatar" className="rounded-full w-32 h-32" />
                    <div className="flex flex-col gap-4 items-center  md:items-start">
                        <h1 className="text-3xl font-semibold">{Profile.full_name}</h1>
                        <p className="text-sm font-light text-inputaccent text-center md:text-start">{Profile.bio}</p>
                    </div>
                    <NavLink to="/settings" className="flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg border border-inputaccent/30 text-sm text-gray-700 hover:bg-accent hover:text-white hover:border-accent transition-colors">Edit Profile</NavLink>
                </div>
                <div className="grid grid-cols-2 md:flex md:flex-row gap-4 items-center justify-between w-full px-4 md:px-10 lg:px-32">
                    <div className="flex items-center gap-2 w-full bg-inputaccent/20 rounded-xl px-4 py-2">
                        <Ticket color="var(--color-accent-dark)" size={24} />
                        <div className="flex flex-col items-">
                            <h1 className="text-lg text-accent-dark font-medium">{currentTickets.length}</h1>
                            <h2 className="text-sm font-light text-inputaccent">Tickets</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full bg-inputaccent/20 rounded-xl px-4 py-2">
                        <Ticket color="var(--color-accent-dark)" size={24} />
                        <div className="flex flex-col items-">
                            <h1 className="text-lg text-accent-dark font-medium">{Collectives.length}</h1>
                            <h2 className="text-sm font-light text-inputaccent">Collectives</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full bg-inputaccent/20 rounded-xl px-4 py-2">
                        <Ticket color="var(--color-accent-dark)" size={24} />
                        <div className="flex flex-col items-">
                            <h1 className="text-lg text-accent-dark font-medium">{Events.length}</h1>
                            <h2 className="text-sm font-light text-inputaccent">Events Hosted</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full bg-inputaccent/20 rounded-xl px-4 py-2">
                        <Ticket color="var(--color-accent-dark)" size={24} />
                        <div className="flex flex-col items-">
                            <h1 className="text-lg text-accent-dark font-medium">{pastTickets.length}</h1>
                            <h2 className="text-sm font-light text-inputaccent">Past Events</h2>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center px-4 md:px-12 lg:px-20 w-full lg:max-w-6xl">
                    <hr className="border-inputaccent/50" />
                    <div className="flex items-center gap-4 w-full px-4 lg:px-10">
                        <button className={`${view === 'attending' ? "py-4 border-b-2 border-accent" : "py-4 "} cursor-pointer`} onClick={setAttendingView}>Attending</button>
                        <button className={`${view === 'hosting' ? "py-4 border-b-2 border-accent" : "py-4 "} cursor-pointer`} onClick={setHostingView}>Hosting</button>
                        <button className={`${view === 'collectives' ? "py-4 border-b-2 border-accent" : "py-4 "} cursor-pointer`} onClick={setCollectivesView}>Collectives</button>
                        <button className={`${view === 'history' ? "py-4 border-b-2 border-accent" : "py-4 "} cursor-pointer`} onClick={setHistoryView}>History</button>
                    </div>
                    <hr className="border-inputaccent/50 w-screen overflow-x-hidden" />
                </div>
                <div className="flex flex-col gap-1 items-center px-4 md:px-12 lg:px-20 w-full">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-2xl">
                            {{
                                attending: 'Your Tickets',
                                hosting: 'Events you\'re organising',
                                collectives: 'Your Collectives',
                                history: 'Past events you attended',
                            }[view] || 'Dashboard'}
                        </h1>

                        {view === 'attending' && (
                            <Link to="/" className="text-accent underline underline-offset-4 text-sm font-light hover:opacity-80 transition-opacity">
                                Browse Events →
                            </Link>
                        )}

                        {view === 'hosting' && (
                            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors cursor-pointer">
                                + New Event
                            </button>
                        )}

                        {view === 'collectives' && (
                            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors cursor-pointer">
                                + New Collective
                            </button>
                        )}

                        {view === 'history' && (
                            <span className="text-sm text-gray-400"></span>
                        )}
                    </div>
                    {view === 'attending' && (
                        <div className="flex flex-col gap-4 items-center w-full">
                            {currentTickets.length > 0 ? (
                                currentTickets.map(ticket => {
                                    const event = Attending.find(e => e.id === ticket.event_id);

                                    return (
                                        <div key={ticket.id} className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 items-start sm:items-center w-full bg-inputaccent/20 rounded-xl p-3 sm:p-2 transition-transform duration-300 hover:scale-100 sm:hover:scale-105">
                                            <div className="flex items-center gap-3 w-full">
                                                <Link to={`/event/${event?.id}`} className="shrink-0" onClick={() => toast.loading("Loading Event...", { duration: 1500 })}>
                                                    {event?.banner_url && (
                                                        <img
                                                            src={event.banner_url}
                                                            alt={event.title}
                                                            className="w-16 sm:w-24 aspect-square rounded-lg object-cover"
                                                        />
                                                    )}
                                                </Link>
                                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                    <h2 className="font-light text-base sm:text-lg truncate">{event?.title}</h2>
                                                    <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-600">
                                                        <span className="truncate max-w-30 sm:max-w-none">{event?.location}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {event?.event_dates?.map((dateObj, index) => (
                                                                <span key={index} className="text-xs sm:text-sm whitespace-nowrap">
                                                                    {new Date(dateObj.date).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                    {index < event.event_dates.length - 1 && <span className="mx-0.5">•</span>}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`self-start sm:self-center rounded-lg px-2 py-1 font-semibold text-xs sm:text-sm opacity-70 ${ticket.status === 'approved'
                                                ? 'bg-green-200 text-green-700'
                                                : ticket.status === 'pending'
                                                    ? 'bg-red-100 text-red-700'
                                                    : ''
                                                }`}>
                                                {ticket.status === 'approved' && 'Attending'}
                                                {ticket.status === 'pending' && 'Pending'}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 w-full bg-inputaccent/10 rounded-xl p-8 sm:p-12 text-center">
                                    <div className="text-5xl sm:text-6xl mb-2">🎟️</div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">No tickets yet</h3>
                                    <p className="text-sm sm:text-base text-gray-500 max-w-sm">
                                        You haven't purchased any tickets yet. Discover amazing events and start your journey!
                                    </p>
                                    <Link
                                        to="/"
                                        className="mt-2 inline-flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                                    >
                                        Browse Events
                                        <span className="text-lg">→</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                    {view === 'hosting' && (
                        Events.length > 0 ? (
                            Events.map(ev => (
                                <Link to={`/event/${ev.id}`} key={ev.id} className="group rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent" onClick={() => toast.loading("Loading Event...", { duration: 1500 })}>
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
                                        <h2 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">{ev.title}</h2>
                                        <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                            <MapPin size={15} />
                                            <span>{ev.location}, {ev.city}</span>
                                        </p>
                                        <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                            <CalendarDays size={15} />
                                            {ev?.event_dates?.map((dateObj, index) => (
                                                <span key={index} className="text-xs sm:text-sm whitespace-nowrap">
                                                    {new Date(dateObj.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                    {index < ev.event_dates.length - 1 && <span className="mx-0.5">•</span>}
                                                </span>
                                            ))}
                                        </p>
                                        {(() => {
                                            const registered = Tickets.filter(
                                                (ticket) => ticket.event_id === ev.id && ticket.status === "approved"
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
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 w-full bg-inputaccent/10 rounded-xl p-8 sm:p-12 text-center">
                                <div className="text-5xl sm:text-6xl mb-2">📅</div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">No events hosted yet</h3>
                                <p className="text-sm sm:text-base text-gray-500 max-w-sm">
                                    You haven't created any events yet. Start hosting and share your experiences!
                                </p>
                                <button className="mt-2 inline-flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors cursor-pointer">
                                    Create Event
                                    <span className="text-lg">+</span>
                                </button>
                            </div>
                        )
                    )}
                    {view === 'collectives' && (
                        CollectiveList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 place-items-center w-full px-4 lg:px-10">
                                {CollectiveList.map(collective => (
                                    <Link
                                        to={`/collective/${collective.id}`}
                                        key={collective.id}
                                        className="group relative rounded-xl w-full overflow-hidden border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent"
                                        onClick={() => toast.loading("Loading Collective...", { duration: 1500 })}
                                    >
                                        <div className="flex flex-col gap-2 p-4">
                                            <div className="flex items-center justify-center p-6 bg-accent/10 rounded-lg h-14 w-14 aspect-square">
                                                <span className="text-3xl font-light text-accent">
                                                    {collective.name[0]}
                                                </span>
                                            </div>
                                            <h2 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">
                                                {collective.name}
                                            </h2>
                                            <p className="text-sm font-light text-inputaccent">
                                                {collective.description}
                                            </p>
                                            <div className="flex gap-2">
                                                <p className="text-sm font-light text-inputaccent flex items-center gap-2">
                                                    <Users size={15} />
                                                    <span>{collective.collective_members?.length || 0}</span> Members
                                                </p>
                                                <p className="text-sm font-light text-inputaccent flex items-center gap-2">
                                                    <Users size={15} />
                                                    <span>{collective.collective_followers?.length || 0}</span> Followers
                                                </p>
                                            </div>
                                            <div className="absolute top-4 right-4 group-hover:scale-140 transition-transform duration-300">
                                                <ChevronRight color="var(--color-inputaccent)" size={15} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 w-full bg-inputaccent/10 rounded-xl p-8 sm:p-12 text-center">
                                <div className="text-5xl sm:text-6xl mb-2">🏛️</div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">No collectives yet</h3>
                                <p className="text-sm sm:text-base text-gray-500 max-w-sm">
                                    You haven't joined or created any collectives yet. Start your own community!
                                </p>
                                <button className="mt-2 inline-flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                                    Create Collective
                                    <span className="text-lg">+</span>
                                </button>
                            </div>
                        )
                    )}
                    {view === 'history' && (
                        <div className="flex flex-col gap-4 items-center w-full">
                            {pastTickets.length > 0 ? (
                                pastTickets.map(ticket => {
                                    const event = Attending.find(e => e.id === ticket.event_id);
                                    return (
                                        <div key={ticket.id} className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 items-start sm:items-center w-full bg-inputaccent/20 rounded-xl p-3 sm:p-2">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="shrink-0" onClick={() => toast.loading("Loading Event...", { duration: 1500 })}>
                                                    {event?.banner_url && (
                                                        <img
                                                            src={event.banner_url}
                                                            alt={event.title}
                                                            className="w-16 sm:w-24 aspect-square rounded-lg object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                    <h2 className="font-light text-base sm:text-lg truncate">{event?.title}</h2>
                                                    <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-600">
                                                        <span className="truncate max-w-30 sm:max-w-none">{event?.location}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {event?.event_dates?.map((dateObj, index) => (
                                                                <span key={index} className="text-xs sm:text-sm whitespace-nowrap">
                                                                    {new Date(dateObj.date).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                    {index < event.event_dates.length - 1 && <span className="mx-0.5">•</span>}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`self-start sm:self-center rounded-lg px-2 py-1 font-semibold text-xs sm:text-sm opacity-70 bg-gray-400 text-gray-800`}>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 w-full bg-inputaccent/10 rounded-xl p-8 sm:p-12 text-center">
                                    <div className="text-5xl sm:text-6xl mb-2">📆</div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">No past events</h3>
                                    <p className="text-sm sm:text-base text-gray-500 max-w-sm">
                                        You haven't attended any events yet. Your history will appear here once you've been to an event.
                                    </p>
                                    <Link
                                        to="/"
                                        className="mt-2 inline-flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                                    >
                                        Browse Events
                                        <span className="text-lg">→</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main >
        </Layout >
    )
}