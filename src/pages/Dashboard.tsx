import {
    CalendarDays,
    ChevronRight,
    MapPin,
    Plus,
    Ticket,
    Users,
    QrCode,
    X
} from "lucide-react";
import { UseAuth } from "../context/UseAuth";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import type {
    CollectiveMember,
    CollectiveWithRelations,
    Event,
    Profile,
    Tickets,
} from "../interfaces";
import QrCodeDisplay from "../components/QrCodeDisplay";

type DashboardView = "attending" | "hosting" | "collectives" | "history";

export default function Dashboard() {
    const { user } = UseAuth();
    const { Profile, Tickets, Events, Collectives, Attending, CollectiveList } =
        useLoaderData() as {
            Profile: Profile;
            Tickets: Tickets[];
            Events: Event[];
            Collectives: CollectiveMember[];
            Attending: Event[];
            CollectiveList: CollectiveWithRelations[];
        };
    const navigate = useNavigate();
    const [view, setView] = useState<DashboardView>("attending");
    const [showingQrFor, setShowingQrFor] = useState<string | null>(null);

    const pastTickets = Tickets.filter(function (ticket) {
        const event = Attending.find(function (attendingEvent) {
            return attendingEvent.id === ticket.event_id;
        });
        return event?.event_dates?.some(function (date) {
            return (
                new Date(date.date).toISOString().slice(0, 10) <
                new Date().toISOString().slice(0, 10)
            );
        });
    });
    const currentTickets = Tickets.filter(function (ticket) {
        const event = Attending.find(function (attendingEvent) {
            return attendingEvent.id === ticket.event_id;
        });
        return event?.event_dates?.some(function (date) {
            return (
                new Date(date.date).toISOString().slice(0, 10) >=
                new Date().toISOString().slice(0, 10)
            );
        });
    });

    useEffect(
        function () {
            if (!user) navigate("/login");
        },
        [user, navigate],
    );

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function getInitials(name: string) {
        return name
            .split(" ")
            .map(function (part) {
                return part[0];
            })
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    function renderTicketList(ticketList: Tickets[], isPast = false) {
        if (ticketList.length === 0) {
            return (
                <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-8 text-center">
                    <p className="text-lg font-semibold text-gray-900">
                        {isPast ? "No past events yet" : "No upcoming tickets yet"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {isPast
                            ? "Your attended events will appear here."
                            : "Discover an event and reserve your place."}
                    </p>
                    {!isPast && (
                        <Link
                            to="/"
                            className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark cursor-pointer"
                        >
                            Browse events
                        </Link>
                    )}
                </div>
            );
        }
        return (
            <div className="space-y-3">
                {ticketList.map(function (ticket) {
                    const event = Attending.find(function (attendingEvent) {
                        return attendingEvent.id === ticket.event_id;
                    });
                    if (!event) return null;
                    return (
                        <div
                            key={ticket.id}
                            className="group flex flex-col gap-3 rounded-xl border border-inputaccent/20 bg-white p-3 transition-colors hover:border-accent hover:bg-accent/5 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <Link
                                to={`/event/${event.id}`}
                                onClick={function () {
                                    toast.loading("Loading event...", { duration: 1200 });
                                }}
                                className="flex min-w-0 items-center gap-3"
                            >
                                <img
                                    src={event.banner_url}
                                    alt={event.title}
                                    className="h-16 w-16 rounded-lg object-cover transition-transform group-hover:scale-105 sm:h-20 sm:w-24"
                                />
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-gray-900">
                                        {event.title}
                                    </p>
                                    <p className="mt-1 flex items-center gap-1 text-sm text-inputaccent">
                                        <MapPin size={14} /> {event.location}, {event.city}
                                    </p>
                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                        <CalendarDays size={13} />{" "}
                                        {event.event_dates
                                            .map(function (date) {
                                                return formatDate(date.date);
                                            })
                                            .join(" • ")}
                                    </p>
                                </div>
                            </Link>

                            <div className="flex items-center gap-2">
                                {ticket.status === 'approved' && !isPast && (
                                    <button
                                        onClick={function(e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowingQrFor(ticket.id);
                                        }}
                                        className="p-2 rounded-lg hover:bg-gray-100 text-accent transition-colors cursor-pointer"
                                        title="View QR Code"
                                    >
                                        <QrCode size={18} />
                                    </button>
                                )}
                                <span
                                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${isPast ? "bg-gray-100 text-gray-600" : ticket.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                                >
                                    {isPast
                                        ? "Attended"
                                        : ticket.status === "approved"
                                            ? "Attending"
                                            : "Pending"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const viewContent = {
        attending: {
            title: "Your tickets",
            description: "",
            action: (
                <Link
                    to="/"
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark cursor-pointer"
                >
                    Browse events
                </Link>
            ),
        },
        hosting: {
            title: "Events you are organising",
            description: "",
            action: (
                <Link
                    to="/new-event"
                    className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark cursor-pointer"
                >
                    <Plus size={16} /> New event
                </Link>
            ),
        },
        collectives: {
            title: "Your collectives",
            description: "",
            action: (
                <Link
                    to="/new-collective"
                    className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark cursor-pointer"
                >
                    <Plus size={16} /> New collective
                </Link>
            ),
        },
        history: { title: "Past events", description: "", action: null },
    }[view];

    return (
        <Layout>
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <section className="flex flex-col gap-5 rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
                    <div className="flex min-w-0 items-center gap-4">
                        {Profile.avatar_url ? (
                            <img
                                src={Profile.avatar_url}
                                alt="Profile avatar"
                                className="h-14 w-14 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent">
                                {getInitials(Profile.full_name)}
                            </div>
                        )}
                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-bold text-gray-900 md:text-3xl">
                                {Profile.full_name}
                            </h1>
                            {Profile.bio && (
                                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                                    {Profile.bio}
                                </p>
                            )}
                        </div>
                    </div>
                    <Link
                        to="/settings"
                        className="w-fit rounded-lg border border-inputaccent/30 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-accent hover:text-accent cursor-pointer"
                    >
                        Edit profile
                    </Link>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-inputaccent/20 bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Upcoming tickets
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <Ticket size={18} className="text-accent" />
                            {currentTickets.length}
                        </p>
                    </div>
                    <div className="rounded-xl border border-inputaccent/20 bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Collectives
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <Users size={18} className="text-accent" />
                            {Collectives.length}
                        </p>
                    </div>
                    <div className="rounded-xl border border-inputaccent/20 bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Events hosted
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <CalendarDays size={18} className="text-accent" />
                            {Events.length}
                        </p>
                    </div>
                    <div className="rounded-xl border border-inputaccent/20 bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Past events
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <Ticket size={18} className="text-accent" />
                            {pastTickets.length}
                        </p>
                    </div>
                </section>

                <section className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-6 flex flex-wrap gap-2 border-b border-inputaccent/20 pb-3">
                        {(
                            [
                                "attending",
                                "hosting",
                                "collectives",
                                "history",
                            ] as DashboardView[]
                        ).map(function (tab) {
                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={function () {
                                        setView(tab);
                                    }}
                                    className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${view === tab ? "bg-accent text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                >
                                    {tab === "history" ? "History" : tab}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {viewContent.title}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {viewContent.description}
                            </p>
                        </div>
                        {viewContent.action}
                    </div>
                    {view === "attending" && renderTicketList(currentTickets)}
                    {view === "history" && renderTicketList(pastTickets, true)}
                    {view === "hosting" &&
                        (Events.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {Events.map(function (event) {
                                    const registered = Tickets.filter(function (ticket) {
                                        return (
                                            ticket.event_id === event.id &&
                                            ticket.status === "approved"
                                        );
                                    }).length;
                                    return (
                                        <Link
                                            to={`/manage-event/${event.id}`}
                                            key={event.id}
                                            className="group overflow-hidden rounded-xl border border-inputaccent/20 bg-white transition-all hover:border-accent hover:shadow-md cursor-pointer"
                                        >
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={event.banner_url}
                                                    alt={event.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                                                    {event.category}
                                                </span>
                                                <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-accent">
                                                    {event.title}
                                                </h3>
                                                <p className="mt-2 flex items-center gap-1 text-sm text-inputaccent">
                                                    <MapPin size={14} />
                                                    {event.location}, {event.city}
                                                </p>
                                                <p className="mt-2 flex items-center gap-1 text-sm text-inputaccent">
                                                    <Users size={14} />
                                                    {registered}
                                                    {event.max_attendees
                                                        ? ` / ${event.max_attendees}`
                                                        : ""}{" "}
                                                    approved
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-8 text-center">
                                <p className="font-semibold text-gray-900">
                                    No events hosted yet
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Create your first event and bring people together.
                                </p>
                            </div>
                        ))}
                    {view === "collectives" &&
                        (CollectiveList.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {CollectiveList.map(function (collective) {
                                    return (
                                        <Link
                                            to={`/collective/${collective.id}`}
                                            key={collective.id}
                                            className="group relative rounded-xl border border-inputaccent/20 bg-white p-4 transition-all hover:border-accent hover:shadow-md cursor-pointer"
                                        >
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">
                                                {collective.name.charAt(0).toUpperCase()}
                                            </div>
                                            <h3 className="mt-4 pr-6 font-semibold text-gray-900 group-hover:text-accent">
                                                {collective.name}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-sm text-inputaccent">
                                                {collective.description}
                                            </p>
                                            <p className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                                <Users size={14} />
                                                {collective.collective_members?.length || 0} members
                                            </p>
                                            <ChevronRight
                                                size={18}
                                                className="absolute right-4 top-4 text-inputaccent transition-transform group-hover:translate-x-1"
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-8 text-center">
                                <p className="font-semibold text-gray-900">
                                    No collectives yet
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Join a community or create one of your own.
                                </p>
                            </div>
                        ))}
                </section>
            </main>
            {showingQrFor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Ticket QR Code</h3>
                            <button
                                onClick={() => setShowingQrFor(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <QrCodeDisplay ticketId={showingQrFor} />
                        <button
                            onClick={() => setShowingQrFor(null)}
                            className="mt-4 w-full py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
}
