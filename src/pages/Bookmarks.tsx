import { Bookmark } from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import Layout from '../Layout';
import EventCard from '../components/EventCard';
import type { Event } from '../interfaces';
export default function BookmarksPage() {
    const { bookmarkedEvents } = useLoaderData() as {
        bookmarkedEvents: Event[];
    };
    return (<Layout>
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
            <div className="flex flex-col gap-2">
                <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
                    <Bookmark size={28} className="text-accent" />
                    Your bookmarks
                </h1>
                <p className="text-sm text-gray-600">
                    Events you have saved for later.
                </p>
            </div>

            {bookmarkedEvents.length === 0 ? (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-8 text-center">
                <p className="text-lg font-semibold text-gray-900">No bookmarked events yet</p>
                <p className="mt-1 text-sm text-gray-500">Browse events and tap the bookmark icon to save them here.</p>
                <Link to="/" className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark cursor-pointer">
                    Browse events
                </Link>
            </div>) : (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bookmarkedEvents.map(function (event) {
                    return <EventCard key={event.id} event={event} />;
                })}
            </div>)}
        </main>
    </Layout>);
}
