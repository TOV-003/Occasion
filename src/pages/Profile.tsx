import { CalendarDays, MapPin, Users, Plus } from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import Layout from '../Layout';
import type { Collective, Event, Profile as ProfileType } from '../interfaces';

export default function ProfilePage() {
    const { profile, createdEvents, ownedCollectives, memberCollectives } = useLoaderData() as {
        profile: ProfileType;
        createdEvents: Event[];
        ownedCollectives: Collective[];
        memberCollectives: Collective[];
    };

    const allCollectives = [...ownedCollectives, ...memberCollectives.filter(
        (collective) => !ownedCollectives.some((owned) => owned.id === collective.id)
    )];

    return (
        <Layout>
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="rounded-2xl border border-inputaccent/20 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={profile.avatar_url || 'https://placehold.co/200x200/EEF2FF/4F46E5?text=User'}
                                alt={profile.full_name}
                                className="h-20 w-20 rounded-full object-cover ring-4 ring-accent/10"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                                <p className="mt-1 text-sm text-gray-600">{profile.bio || 'No bio yet.'}</p>
                            </div>
                        </div>

                        <Link
                            to="/settings"
                            className="inline-flex items-center gap-2 rounded-lg border border-inputaccent/30 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:bg-accent hover:text-white"
                        >
                            <Plus size={15} />
                            View settings
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Events</p>
                        <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <CalendarDays size={18} className="text-accent" />
                            {createdEvents.length}
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
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Member collectives</p>
                        <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <Users size={18} className="text-accent" />
                            {memberCollectives.length}
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <section className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold text-gray-900">Created events</h2>
                            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                                {createdEvents.length}
                            </span>
                        </div>

                        {createdEvents.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                No events created yet.
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {createdEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        to={`/event/${event.id}`}
                                        className="group overflow-hidden rounded-xl border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent"
                                    >
                                        <div className="h-36 overflow-hidden">
                                            <img
                                                src={event.banner_url}
                                                alt={event.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
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
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold text-gray-900">Collectives</h2>
                            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                                {allCollectives.length}
                            </span>
                        </div>

                        {allCollectives.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                No collectives to show.
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {allCollectives.map((collective) => {
                                    const isOwner = ownedCollectives.some((owned) => owned.id === collective.id);
                                    return (
                                        <Link
                                            key={collective.id}
                                            to={`/collective/${collective.id}`}
                                            className="group rounded-xl border border-inputaccent/20 bg-white p-4 transition-colors duration-300 hover:border-accent"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">
                                                        {collective.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                                                            {collective.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">{isOwner ? 'Owner' : 'Member'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">{collective.description}</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </Layout>
    );
}
