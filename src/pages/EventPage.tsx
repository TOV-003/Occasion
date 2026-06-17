import { useLoaderData, Link } from 'react-router-dom';
import type { Event } from '../interfaces';
import { ChevronLeft, Users, MapPin, CalendarDays } from 'lucide-react';
import Layout from '../Layout';
import type { Tickets, Event_collective } from '../interfaces';

export default function EventPage() {
    const { event, tickets, collective } = useLoaderData() as { event: Event, tickets: Tickets[], collective: Event_collective[] };
    console.log(collective);
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
                        <h3 className="text-2xl font-semibold mb-4">About Event</h3>
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
                    </div>
                </div>

            </div>
        </Layout>
    );
}