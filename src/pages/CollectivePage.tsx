import Layout from '../Layout';
import { Link, useLocation, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';
import { ChevronLeft, Users, MapPin, CalendarDays, Plus, Grid3X3, List, Calendar, BookmarkCheck, BookmarkOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { UseAuth } from '../context/UseAuth';
import type { CollectiveWithRelations, CollectiveMember, CollectiveFollower, Event, Tickets, Profile, Bookmarks } from '../interfaces';


const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function MiniCalendar({ events }: { events: Event[] }) {
    const [viewDate, setViewDate] = useState(new Date());
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const eventDays = new Set(
        events
            .filter((e) => e.event_dates && e.event_dates.length > 0)
            .flatMap((e) => e.event_dates!)
            .filter((d) => {
                const dt = new Date(d.date);
                return dt.getFullYear() === year && dt.getMonth() === month;
            })
            .map((d) => new Date(d.date).getDate())
    );

    const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
        i < firstDay ? null : i - firstDay + 1
    );

    return (
        <div className="bg-white border border-inputaccent/20 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">{MONTHS[month]} {year}</p>
                <div className="flex gap-1">
                    <button
                        onClick={() => setViewDate(new Date(year, month - 1, 1))}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors text-xs"
                    >
                        ‹
                    </button>
                    <button
                        onClick={() => setViewDate(new Date(year, month + 1, 1))}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors text-xs"
                    >
                        ›
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAYS.map((d) => (
                    <div key={d} className="text-center text-xs text-gray-400 py-1">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, i) => (
                    <div key={i} className="aspect-square flex items-center justify-center relative">
                        {day ? (
                            <div className="relative w-7 h-7 flex items-center justify-center">
                                <span
                                    className={`text-xs ${eventDays.has(day)
                                        ? "w-7 h-7 flex items-center justify-center rounded-full bg-accent text-white"
                                        : "text-gray-700"
                                        }`}
                                >
                                    {day}
                                </span>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CollectivePage() {
    const { collective, collectiveMembers, collectiveFollowers, events, tickets, memberProfiles, bookmarks } = useLoaderData() as {
        collective: CollectiveWithRelations;
        collectiveMembers: CollectiveMember[];
        collectiveFollowers: CollectiveFollower[];
        events: Event[];
        tickets: Tickets[];
        memberProfiles: Profile[];
        bookmarks: Bookmarks[];
    };

    const { user, joinCollective, leaveCollective, followCollective, unfollowCollective, AddBookmark } = UseAuth();


    const location = useLocation();
    const navigate = useNavigate();
    const fromEventId = location.state?.fromEvent as string | undefined;
    const [view, setView] = useState<"grid" | "list">("grid");
    const [showAllMembers, setShowAllMembers] = useState(false);
    const revalidator = useRevalidator();
    const memberProfileMap = new Map(memberProfiles.map((profile) => [profile.id, profile]));

    const isOwner = collective?.owner_id === user?.id;
    const isFollower = collectiveFollowers.some(el => el.user_id === user?.id);
    const isMember = collectiveMembers.some(el => el.user_id === user?.id);

    async function handleJoinLeaveCollective() {
        if (!user) {
            toast.error("Please login to join or leave a collective.");
            return;
        }
        if (isMember) {
            toast.loading("Leaving collective...", { duration: 500 });
            try {
                await leaveCollective(collective.id);
            }
            catch (error) {
                console.error("Error leaving collective:", error);
                toast.error("Failed to leave collective. Please try again.");
            }
            finally {
                revalidator.revalidate();
            }
        }
        else {
            toast.loading("Joining collective...", { duration: 500 });
            try {
                await joinCollective(collective.id);
            }
            catch (error) {
                console.error("Error joining collective:", error);
                toast.error("Failed to join collective. Please try again.");
            }
            finally {
                revalidator.revalidate();
            }
        }
    }

    async function handleFollowUnfollow() {
        if (!user) {
            toast.error("Please login to follow or unfollow a collective.");
            return;
        }
        if (isFollower) {
            toast.loading("Unfollowing collective...", { duration: 500 });
            try {
                await unfollowCollective(collective.id);
            }
            catch (error) {
                console.error("Error unfollowing collective:", error);
                toast.error("Failed to unfollow collective. Please try again.");
            }
            finally {
                revalidator.revalidate();
            }
        }
        else {
            toast.loading("Following collective...", { duration: 500 });
            try {
                await followCollective(collective.id);
            }
            catch (error) {
                console.error("Error following collective:", error);
                toast.error("Failed to follow collective. Please try again.");
            }
            finally {
                revalidator.revalidate();
            }
        }
    }

    async function handleBookMark(id: string | undefined) {
        if (!user) {
            navigate('/login');
            return;
        }

        if (id) {
            try {
                await AddBookmark(id);
            }
            catch (error) {
                console.error("Error bookmarking event:", error);
                toast.error("Failed to bookmark event. Please try again.");
            }
            finally {
                revalidator.revalidate();
            }
        }
    }

    const handleBack = () => {
        if (fromEventId) {
            navigate(`/event/${fromEventId}`);
            return;
        }

        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/collectives');
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
                <div>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-accent transition-colors mb-6"
                    >
                        <ChevronLeft size={16} />
                        {fromEventId ? 'Back to previous event' : 'Back to previous page'}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-inputaccent/20">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-2xl font-bold shrink-0">
                            {collective.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{collective.name}</h1>
                            <p className="text-gray-600 text-sm mt-0.5">{collective.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span className="flex flex-col md:flex-row items-center gap-1">
                                    <Users size={14} />
                                    {collectiveMembers.length} members
                                </span>
                                <span className="flex flex-col md:flex-row items-center gap-1">
                                    <Users size={14} />
                                    {collectiveFollowers.length} followers
                                </span>
                                <span className="flex flex-col md:flex-row items-center gap-1">
                                    <Calendar size={14} />
                                    {events.length} upcoming events
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        {(isOwner || isMember) && (
                            <button
                                type="button"
                                onClick={() => navigate('/new-event', { state: { collectiveId: collective.id } })}
                                className="flex cursor-pointer items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm hover:bg-accent-dark transition-colors shadow-sm"
                            >
                                <Plus size={16} />
                                New event
                            </button>
                        )}
                        {isOwner ? (
                            <button
                                className="px-4 py-2 rounded-lg border border-inputaccent/30 text-sm text-gray-700 hover:bg-accent hover:text-white hover:border-accent transition-colors cursor-pointer"
                                onClick={() => navigate(`/manage-collective/${collective.id}`)}
                            >
                                Manage Collective
                            </button>
                        ) : (
                            <button className="px-4 py-2 rounded-lg border border-inputaccent/30 text-sm text-gray-700 hover:bg-accent hover:text-white hover:border-accent transition-colors cursor-pointer" onClick={handleJoinLeaveCollective}>
                                {isMember ? "Leave collective" : "Join collective"}
                            </button>
                        )}
                        {!isOwner && (
                            <button className="px-4 py-2 rounded-lg border border-inputaccent/30 text-sm text-gray-700 hover:bg-accent hover:text-white hover:border-accent transition-colors cursor-pointer" onClick={handleFollowUnfollow}>
                                {isFollower ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                            <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
                                <button
                                    onClick={() => setView("grid")}
                                    className={`p-1.5 rounded transition-colors ${view === "grid" ? "bg-white shadow-sm text-accent" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <Grid3X3 size={16} />
                                </button>
                                <button
                                    onClick={() => setView("list")}
                                    className={`p-1.5 rounded transition-colors ${view === "list" ? "bg-white shadow-sm text-accent" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>

                        {events.length === 0 ? (
                            <div className="py-12 text-center text-gray-500 text-sm border border-dashed border-inputaccent/20 rounded-xl">
                                No upcoming events from this collective.
                            </div>
                        ) : view === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {events.map((ev) => {
                                    const registered = tickets.filter(
                                        (t) => t.event_id === ev.id && t.status === "approved"
                                    ).length;
                                    const isFull = registered === ev.max_attendees;
                                    return (
                                        <Link
                                            to={`/event/${ev.id}`}
                                            key={ev.id}
                                            className="group rounded-xl overflow-hidden border border-inputaccent/20 bg-white transition-all duration-300 hover:shadow-lg hover:border-accent"
                                        >
                                            <div className="relative w-full aspect-square overflow-hidden">
                                                <img
                                                    src={ev.banner_url}
                                                    alt={ev.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                {bookmarks.filter((b: Bookmarks) => b.event_id === ev.id).length > 0 && <div onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleBookMark(ev.id);
                                                }} className="absolute top-4 right-4 z-0 cursor-pointer group-hover:scale-140 transition-transform duration-300 p-2 bg-inputbg rounded-md">
                                                    <BookmarkCheck color="var(--color-accent)" size={20} />
                                                </div>}
                                                {bookmarks.filter((b: Bookmarks) => b.event_id === ev.id).length === 0 && <div onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleBookMark(ev.id);
                                                }} className="absolute cursor-pointer top-4 right-4 z-0 group-hover:scale-140 transition-transform duration-300 p-2 bg-inputbg rounded-md">
                                                    <BookmarkOff color="var(--color-accent)" size={20} />
                                                </div>}
                                            </div>
                                            <div className="p-4 space-y-2">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent transition-colors line-clamp-1">
                                                    {ev.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <MapPin size={14} />
                                                    {ev.location}, {ev.city}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <CalendarDays size={14} />
                                                    {ev.event_dates?.map((d, idx, arr) => (
                                                        <span key={d.date}>
                                                            {new Date(d.date).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                            {idx < arr.length - 1 && " / "}
                                                        </span>
                                                    ))}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={14} />
                                                        {registered} / {ev.max_attendees}
                                                    </span>
                                                    {isFull && (
                                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                                                            Full
                                                        </span>
                                                    )}
                                                </div>
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
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {events.map((ev) => {
                                    const registered = tickets.filter(
                                        (t) => t.event_id === ev.id && t.status === "approved"
                                    ).length;
                                    return (
                                        <Link
                                            to={`/event/${ev.id}`}
                                            key={ev.id}
                                            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-inputaccent/20 hover:shadow-md hover:border-accent transition-all group"
                                        >
                                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                                <img src={ev.banner_url} alt={ev.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-accent transition-colors truncate">
                                                    {ev.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <MapPin size={14} />
                                                    {ev.location}, {ev.city}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <CalendarDays size={14} />
                                                    {ev.event_dates?.[0] && new Date(ev.event_dates[0].date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                    {ev.event_dates && ev.event_dates.length > 1 && ` + ${ev.event_dates.length - 1} more`}
                                                </p>
                                            </div>
                                            {bookmarks.filter((b: Bookmarks) => b.event_id === ev.id).length > 0 && <div onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleBookMark(ev.id);
                                            }} className="z-0 cursor-pointer group-hover:scale-140 transition-transform duration-300 p-2 bg-inputbg rounded-md">
                                                <BookmarkCheck color="var(--color-accent)" size={20} />
                                            </div>}
                                            {bookmarks.filter((b: Bookmarks) => b.event_id === ev.id).length === 0 && <div onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleBookMark(ev.id);
                                            }} className="z-0 group-hover:scale-140 transition-transform duration-300 p-2 bg-inputbg rounded-md">
                                                <BookmarkOff color="var(--color-accent)" size={20} />
                                            </div>}
                                            <div className="text-xs text-gray-500">
                                                {registered} / {ev.max_attendees}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <MiniCalendar events={events} />

                        <div className="bg-white border border-inputaccent/20 rounded-xl p-4 shadow-sm">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Members</h3>
                            <div className={`space-y-2.5 ${showAllMembers ? 'max-h-48 overflow-auto' : ''}`}>
                                {(showAllMembers ? collectiveMembers : collectiveMembers.slice(0, 5)).map((member) => {
                                    const profile = memberProfileMap.get(member.user_id);
                                    const fullName = profile?.full_name || 'Member';
                                    const initial = fullName.charAt(0).toUpperCase();
                                    const isOwnerMember = collective.owner_id === member.user_id;

                                    return (
                                        <Link
                                            key={member.id}
                                            to={`/profile/${member.user_id}`}
                                            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/5"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                                                {initial}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm text-gray-800 truncate">{fullName}</div>
                                                <div className="text-[10px] uppercase tracking-wide text-gray-500">
                                                    {isOwnerMember ? 'Owner' : (member.role || 'Member')}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                            {collectiveMembers.length > 5 && (
                                <button
                                    onClick={() => setShowAllMembers((s) => !s)}
                                    className="text-xs text-gray-400 mt-3 hover:underline"
                                >
                                    {showAllMembers ? 'Show less' : `+${collectiveMembers.length - 5} more members`}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}