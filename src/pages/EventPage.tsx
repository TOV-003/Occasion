import { useLoaderData, Link, useParams } from 'react-router-dom';
import type { Event } from '../interfaces';
import { ChevronLeft, Users, MapPin, CalendarDays, CheckCircle, Info } from 'lucide-react';
import Layout from '../Layout';
import ShareButton from '../components/ShareButton';
import type { Tickets, Event_collective, CollectiveWithRelations } from '../interfaces';

export default function EventPage() {
    const { event, tickets, eventCollective } = useLoaderData() as {
        event: Event;
        tickets: Tickets[];
        collective: Event_collective[];
        eventCollective: CollectiveWithRelations | null;
    };
    const { id } = useParams();
    console.log("eventid", id);
    console.log("eventCollective", eventCollective);

    const isFull = tickets.length === event.max_attendees;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-accent transition-colors mb-6"
                >
                    <ChevronLeft size={16} />
                    Back to Explore
                </Link>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="lg:w-2/3 space-y-6">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={event.banner_url}
                                alt={event.title}
                                className="w-full aspect-square object-cover"
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{event.title}</h1>
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold text-gray-800">About This Event</h3>
                                <p className="mt-2 text-lg text-gray-600 leading-relaxed">{event.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-6 border border-inputaccent/20">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-accent mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Location</p>
                                    <p className="text-base text-gray-800">{event.location}, {event.city}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CalendarDays size={20} className="text-accent mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Dates</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {event.event_dates?.map((dateObj) => (
                                            <span
                                                key={dateObj.date}
                                                className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {new Date(dateObj.date).toLocaleDateString('en-US', {
                                                    month: 'short',
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
                                        <p className="text-sm font-medium text-gray-500">Capacity</p>
                                        <p className="text-base text-gray-800">{event.max_attendees} attendees</p>
                                    </div>
                                </div>
                            )}

                            {tickets.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <Users size={20} className="text-accent mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Registered</p>
                                        <p className="text-base text-gray-800">
                                            {tickets.length}
                                            {isFull && (
                                                <span className="ml-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                                    Full
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {eventCollective && (
                            <Link
                                to={`/collective/${eventCollective.id}`}
                                state={{ fromEvent: event.id }}
                                className="mt-4"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Part of</h3>
                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-inputaccent/20 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <span className="text-2xl font-bold text-accent">
                                            {eventCollective.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">{eventCollective.name}</p>
                                        <p className="text-sm text-gray-500">Collective</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 text-sm text-gray-500">
                                        <Users size={14} />
                                        <span>{eventCollective.collective_members?.length || 0}</span>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    <div className="lg:w-1/3 lg:sticky lg:top-8 self-start">
                        <div className="bg-white rounded-xl border border-inputaccent/20 p-6 shadow-sm space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Registration</h3>
                                <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${event.auto_approve
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {event.auto_approve ? 'Auto-approved' : 'Manual review'}
                                </span>
                            </div>

                            <button
                                onClick={() => console.log('Register for event:', event.id)}
                                disabled={isFull}
                                className={`w-full py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md ${isFull
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-accent text-white hover:bg-accent-dark'
                                    }`}
                            >
                                {isFull ? 'Fully Occupied' : 'Register for this event'}
                            </button>

                            <p className="text-sm text-gray-500 flex items-start gap-2">
                                {event.auto_approve ? (
                                    <>
                                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-green-500" />
                                        <span>Registration is automatic. You'll be confirmed immediately.</span>
                                    </>
                                ) : (
                                    <>
                                        <Info size={16} className="mt-0.5 shrink-0 text-gray-400" />
                                        <span>
                                            This event uses manual approval. Your spot isn't confirmed until the
                                            organiser reviews your request.
                                        </span>
                                    </>
                                )}
                            </p>

                            <hr className="border-inputaccent/20" />

                            <div className="flex items-center justify-between">
                                <ShareButton
                                    title={`Join me at ${event.title}!`}
                                    text={`${event.title} - ${event.location}, ${event.city}`}
                                    url={window.location.href}
                                    className="border-none shadow-none hover:bg-transparent hover:text-accent text-gray-500"
                                />
                                <button
                                    onClick={() => console.log('Join collective')}
                                    className="text-sm text-accent hover:underline"
                                >
                                    Join collective
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}