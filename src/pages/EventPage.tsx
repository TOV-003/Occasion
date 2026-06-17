import { useLoaderData, Link } from 'react-router-dom';
import type { Event } from '../interfaces';
import { ChevronLeft, Users, MapPin, CalendarDays } from 'lucide-react';
import Layout from '../Layout';
import ShareButton from '../components/ShareButton';
import type { Tickets, Event_collective, CollectiveWithRelations } from '../interfaces';

export default function EventPage() {
    const { event, tickets, eventCollective } = useLoaderData() as { event: Event, tickets: Tickets[], collective: Event_collective[], eventCollective: CollectiveWithRelations };
    console.log("eventCollective", eventCollective);
    return (
        <Layout>
            <div className="container mx-auto p-8">
                <Link to="/" className="text-sm text-accent-dark font-semibold flex items-center">
                    <ChevronLeft size={12} />Back to Events
                </Link>
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <div className="flex flex-wrap gap-4 mt-4">
                    <img
                        src={event.banner_url}
                        alt={event.title}
                        className="w-full lg:w-1/2 aspect-square object-cover rounded-lg"
                    />
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">About This Event</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">{event.description}</p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-accent mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-base font-medium text-gray-700">Location</p>
                                    <p className="text-lg text-gray-600">{event.location}, {event.city}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CalendarDays size={20} className="text-accent mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-base font-medium text-gray-700">Dates</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {event.event_dates?.map((dateObj) => (
                                            <span
                                                key={dateObj.date}
                                                className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-base"
                                            >
                                                {new Date(dateObj.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {event.max_attendees && (
                                <div className="flex items-start gap-3">
                                    <Users size={20} className="text-accent mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-base font-medium text-gray-700">Capacity</p>
                                        <p className="text-lg text-gray-600">{event.max_attendees} attendees</p>
                                    </div>
                                </div>
                            )}
                            {tickets.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <Users size={20} className="text-accent mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-base font-medium text-gray-700">Attendees</p>
                                        <p className="text-lg text-gray-600">{tickets.length} attendees</p>
                                    </div>
                                </div>
                            )}
                            {tickets.length === event.max_attendees && (
                                <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-lg font-medium">
                                    THIS EVENT IS FULLY OCCUPIED
                                </div>)}
                        </div>
                        {eventCollective && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold mb-3">Part Of:</h3>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-inputaccent/20">
                                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <span className="text-2xl font-bold text-accent">
                                            {eventCollective.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">{eventCollective.name}</p>
                                        <p className="text-sm text-gray-500">Collective</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Users size={14} />
                                            {eventCollective.collective_members.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <div>
                <ShareButton
                    title={`Join me at ${event.title}!`}
                    text={`${event.title} - ${event.location}, ${event.city}`}
                    url={window.location.href}
                />
            </div>
        </Layout>
    );
}