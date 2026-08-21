import { CalendarDays, MapPin, Users, Plus, QrCode, X, Bookmark, Eye } from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../Layout';
import type { Collective, Event, Profile as ProfileType, Tickets, Bookmarks } from '../interfaces';
import { UseAuth } from '../context/UseAuth';
import QrCodeDisplay from '../components/QrCodeDisplay';
export default function ProfilePage() {
    const { profile, createdEvents, ownedCollectives, memberCollectives, attendingEvents, tickets, bookmarkedEvents, followedCollectives } = useLoaderData() as {
        profile: ProfileType;
        createdEvents: Event[];
        ownedCollectives: Collective[];
        memberCollectives: Collective[];
        attendingEvents: Event[];
        tickets: Tickets[];
        bookmarks: Bookmarks[];
        bookmarkedEvents: Event[];
        followedCollectives: Collective[];
    };
    const { user } = UseAuth();
    const isOwnProfile = user?.id === profile.id;
    const [showPast, setShowPast] = useState(false);
    const [showingQrFor, setShowingQrFor] = useState<string | null>(null);
    const today = new Date();
    const filteredCreatedEvents = createdEvents.filter(function (event) {
        if (!event.event_dates || event.event_dates.length === 0)
            return false;
        const eventDate = new Date(event.event_dates[0].date);
        return showPast ? eventDate < today : eventDate >= today;
    });
    return (<Layout>
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
            <div className="rounded-2xl border border-inputaccent/20 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <img src={profile.avatar_url || 'https://placehold.co/200x200/EEF2FF/4F46E5?text=User'} alt={profile.full_name} className="h-20 w-20 rounded-full object-cover ring-4 ring-accent/10" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                            <p className="mt-1 text-sm text-gray-600">{profile.bio || 'No bio yet.'}</p>
                        </div>
                    </div>

                    {isOwnProfile && (<Link to="/settings" className="inline-flex items-center gap-2 rounded-lg border border-inputaccent/30 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:bg-accent hover:text-white cursor-pointer">
                        <Plus size={15} />
                        View settings
                    </Link>)}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Created events</p>
                    <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                        <CalendarDays size={18} className="text-accent" />
                        {filteredCreatedEvents.length}
                    </p>
                </div>

                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Upcoming</p>
                    <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                        <CalendarDays size={18} className="text-accent" />
                        {attendingEvents.length}
                    </p>
                </div>

                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Bookmarked</p>
                    <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                        <Bookmark size={18} className="text-accent" />
                        {bookmarkedEvents.length}
                    </p>
                </div>

                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Owned collectives</p>
                    <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                        <Users size={18} className="text-accent" />
                        {ownedCollectives.length}
                    </p>
                </div>

                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Followed</p>
                    <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                        <Eye size={18} className="text-accent" />
                        {followedCollectives.length}
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                <section className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-900">Created events</h2>
                            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                                {filteredCreatedEvents.length}
                            </span>
                        </div>
                        <div className="inline-flex rounded-lg border border-inputaccent/30 bg-gray-100 p-1">
                            <button onClick={function () { setShowPast(false); }} className={`cursor-pointer px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${!showPast ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                                Future
                            </button>
                            <button onClick={function () { setShowPast(true); }} className={`cursor-pointer px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${showPast ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                                Past
                            </button>
                        </div>
                    </div>

                    {filteredCreatedEvents.length === 0 ? (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                        No {showPast ? 'past' : 'future'} events created yet.
                    </div>) : (<div className="grid gap-4 md:grid-cols-2">
                        {filteredCreatedEvents.map(function (event) {
                            return (<Link key={event.id} to={`/event/${event.id}`} className="group overflow-hidden rounded-xl border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent cursor-pointer">
                                <div className="h-36 overflow-hidden">
                                    <img src={event.banner_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                                <div className="space-y-2 p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={14} />
                                        {event.location}, {event.city}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-gray-600">
                                        <CalendarDays size={14} />
                                        {event.event_dates?.[0] && new Date(event.event_dates[0].date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </Link>);
                        })}
                    </div>)}
                </section>

                <section className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">Upcoming events</h2>
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                            {attendingEvents.length}
                        </span>
                    </div>

                    {attendingEvents.length === 0 ? (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                        No upcoming events yet.
                    </div>) : (<div className="grid gap-4 md:grid-cols-2">
                        {attendingEvents.map(function (event) {
                            const userTicket = tickets?.find(t => t.user_id === profile.id && t.event_id === event.id);
                            return (
                                <div key={event.id} className="group rounded-xl border border-inputaccent/20 bg-white overflow-hidden transition-colors duration-300 hover:border-accent">
                                    <Link to={`/event/${event.id}`} className="block cursor-pointer">
                                        <div className="h-36 overflow-hidden">
                                            <img src={event.banner_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                        <div className="space-y-2 p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={14} />
                                                {event.location}, {event.city}
                                            </p>
                                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                                <CalendarDays size={14} />
                                                {event.event_dates?.[0] && new Date(event.event_dates[0].date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </Link>
                                    {userTicket?.status === 'approved' && (
                                        <div className="p-3 border-t border-inputaccent/20">
                                            <button
                                                onClick={function(e) {
                                                    e.preventDefault();
                                                    setShowingQrFor(userTicket.id);
                                                }}
                                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer"
                                            >
                                                <QrCode size={16} />
                                                <span className="text-sm font-medium">Show QR Code</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })},
                    </div>)}
                </section>

                <section className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">Bookmarked events</h2>
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                            {bookmarkedEvents.length}
                        </span>
                    </div>

                    {bookmarkedEvents.length === 0 ? (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                        No bookmarked events yet.
                    </div>) : (<div className="grid gap-4 md:grid-cols-2">
                        {bookmarkedEvents.map(function (event) {
                            return (<Link key={event.id} to={`/event/${event.id}`} className="group overflow-hidden rounded-xl border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent cursor-pointer">
                                <div className="h-36 overflow-hidden">
                                    <img src={event.banner_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                                <div className="space-y-2 p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={14} />
                                        {event.location}, {event.city}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-gray-600">
                                        <CalendarDays size={14} />
                                        {event.event_dates?.[0] && new Date(event.event_dates[0].date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </Link>);
                        })}
                    </div>)}
                </section>

                <section className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">Collectives</h2>
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                            {ownedCollectives.length + memberCollectives.length}
                        </span>
                    </div>

                    {(ownedCollectives.length === 0 && memberCollectives.length === 0) ? (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                        No collectives to show.
                    </div>) : (<div className="space-y-6">
                        {ownedCollectives.length > 0 && (<div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Created By Me</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {ownedCollectives.map(function (collective) {
                                    return (<Link key={collective.id} to={`/collective/${collective.id}`} className="group rounded-xl border border-inputaccent/20 bg-white p-4 transition-colors duration-300 hover:border-accent cursor-pointer">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">
                                                {collective.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                                                    {collective.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">Owner</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{collective.description}</p>
                                </Link>);
                                })}
                            </div>
                        </div>)}
                        {memberCollectives.length > 0 && (<div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Joined</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {memberCollectives.map(function (collective) {
                                    return (<Link key={collective.id} to={`/collective/${collective.id}`} className="group rounded-xl border border-inputaccent/20 bg-white p-4 transition-colors duration-300 hover:border-accent cursor-pointer">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">
                                                {collective.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                                                    {collective.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">Member</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{collective.description}</p>
                                </Link>);
                                })}
                            </div>
                        </div>)}
                    </div>)}
                </section>

                <section className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">Followed collectives</h2>
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                            {followedCollectives.length}
                        </span>
                    </div>

                    {followedCollectives.length === 0 ? (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                        No followed collectives yet.
                    </div>) : (<div className="grid gap-4 md:grid-cols-2">
                        {followedCollectives.map(function (collective) {
                            return (<Link key={collective.id} to={`/collective/${collective.id}`} className="group rounded-xl border border-inputaccent/20 bg-white p-4 transition-colors duration-300 hover:border-accent cursor-pointer">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">
                                            {collective.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                                                {collective.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">Follower</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{collective.description}</p>
                            </Link>);
                        })}
                    </div>)}
                </section>
            </div>
        </main>
        {showingQrFor && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Your Ticket</h3>
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
    </Layout>);
}
