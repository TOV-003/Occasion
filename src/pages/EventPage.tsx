import { useLoaderData, Link, useRevalidator } from 'react-router-dom';
import type { Event } from '../interfaces';
import { ChevronLeft, Users, MapPin, CalendarDays, CheckCircle, Info, BookmarkCheck, BookmarkOff, CalendarPlus, Navigation, Mail } from 'lucide-react';
import Layout from '../Layout';
import ShareButton from '../components/ShareButton';
import { UseAuth } from '../context/UseAuth';
import { toast } from 'react-hot-toast';
import type { Tickets, Event_collective, CollectiveWithRelations, Bookmarks } from '../interfaces';
import { useNavigate } from 'react-router-dom';
import QrCodeDisplay from '../components/QrCodeDisplay';
import { formatEventDate } from '../utils/date';
export default function EventPage() {
    const { event, tickets, eventCollective, bookmarks } = useLoaderData() as {
        event: Event;
        tickets: Tickets[];
        collective: Event_collective[];
        eventCollective: CollectiveWithRelations | null;
        bookmarks: Bookmarks[];
    };
    const { user, delistEvent, relistEvent, createTicket, joinCollective, toggleBookmark, cancelTicket, joinWaitlist } = UseAuth();
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    async function handleDelist(id: string) {
        try {
            await delistEvent(id);
        }
        catch (error) {
            console.error("Error delisting event:", error);
            toast.error("Failed to delist event. Please try again.");
        }
        finally {
            revalidator.revalidate();
        }
    }
    async function handleRelist(id: string) {
        try {
            const event = await relistEvent(id);
            if (event) {
                toast.success("Event relisted successfully");
            }
        }
        catch (error) {
            console.error("Error relisting event:", error);
            toast.error("Failed to relist event. Please try again.");
        }
        finally {
            revalidator.revalidate();
        }
    }
    async function handleCreateTicket(id: string) {
        toast.loading("Creating ticket...", { duration: 1000 });
        try {
            await createTicket(id);
            toast.success("Ticket created successfully");
        }
        catch (error) {
            console.error("Error creating ticket:", error);
            toast.error("Failed to create ticket. Please try again.");
        }
        finally {
            revalidator.revalidate();
        }
    }
    async function handleCancelTicket(id: string) {
        if (!window.confirm('Cancel your ticket for this event?')) {
            return;
        }
        try {
            await cancelTicket(id);
            toast.success('Ticket cancelled');
        }
        catch (error) {
            console.error('Error cancelling ticket:', error);
            toast.error('Failed to cancel ticket. Please try again.');
        }
        finally {
            revalidator.revalidate();
        }
    }
    async function handleJoinWaitlist(id: string) {
        try {
            await joinWaitlist(id);
        }
        catch (error) {
            console.error('Error joining waitlist:', error);
            toast.error('Failed to join waitlist. Please try again.');
        }
        finally {
            revalidator.revalidate();
        }
    }
    async function handleJoinCollective(id: string) {
        try {
            await joinCollective(id);
            toast.success("Joined collective successfully");
        }
        catch (error) {
            console.error("Error joining collective:", error);
            toast.error("Failed to join collective. Please try again.");
        }
        finally {
            revalidator.revalidate();
        }
    }
    async function HandleBookMark(id: string | undefined) {
        if (!user) {
            navigate('/login');
            return;
        }
        if (id) {
            try {
                await toggleBookmark(id);
            }
            catch (error) {
                console.error("Error BookMarking event:", error);
                toast.error("Failed to BookMark event. Please try again.");
            }
            finally {
                revalidator.revalidate();
            }
        }
    }
    function userHasTicketCheck() {
        return tickets.some(function (t) {
            return t.user_id === user?.id && t.event_id === event.id && t.status === 'approved';
        });
    }
    const userHasTicket = userHasTicketCheck();
    function userTicketIsPending() {
        return tickets.some(function (t) {
            return t.user_id === user?.id && t.event_id === event.id && t.status === 'pending';
        });
    }
    const userTicketIsPendingCheck = userTicketIsPending();
    function userOnWaitlistCheck() {
        return tickets.some(function (t) {
            return t.user_id === user?.id && t.event_id === event.id && t.status === 'waitlist';
        });
    }
    const userOnWaitlist = userOnWaitlistCheck();
    const approvedTicketCount = tickets.filter(function (t) {
        return t.status === 'approved';
    }).length;
    const isFull = event.max_attendees ? approvedTicketCount >= event.max_attendees : false;
    const isCreator = user?.id === event.creator_id;
    function formatCalendarDate(dateStr?: string) {
        if (!dateStr)
            return '';
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    const firstDate = event.event_dates?.[0]?.date;
    const lastDate = event.event_dates?.[event.event_dates.length - 1]?.date;
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatCalendarDate(firstDate)}/${formatCalendarDate(lastDate || firstDate)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(`${event.location}, ${event.city}`)}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location}, ${event.city}`)}`;
    const whatsappShareText = `${event.title} - ${event.location}, ${event.city} ${window.location.href}`;
    function handleBack() {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate('/');
    }
    return (<Layout>
        <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
            <button type="button" onClick={handleBack} className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-accent transition-colors mb-6 cursor-pointer">
                <ChevronLeft size={16} />
                Back to previous page
            </button>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="lg:w-2/3 space-y-6">
                    <div className="rounded-xl shadow-lg relative overflow-hidden">
                        <img src={event.banner_url} alt={event.title} className="w-full aspect-square object-cover pointer-events-none" />
                        {bookmarks.filter(function (b: Bookmarks) {
                            return b.event_id === event.id;
                        }).length > 0 && (<div onClick={function () {
                            return HandleBookMark(event.id);
                        }} className="absolute top-4 right-4 z-0 cursor-pointer group-hover:scale-110 transition-transform duration-300 p-2 bg-inputbg rounded-md">
                            <BookmarkCheck color="var(--color-accent)" size={20} />
                        </div>)}
                        {bookmarks.filter(function (b: Bookmarks) {
                            return b.event_id === event.id;
                        }).length === 0 && (<div onClick={function () {
                            return HandleBookMark(event.id);
                        }} className="absolute top-4 right-4 z-0 cursor-pointer group-hover:scale-110 transition-transform duration-300 p-2 bg-inputbg rounded-md">
                            <BookmarkOff color="var(--color-accent)" size={20} />
                        </div>)}
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
                                    {event.event_dates?.map(function (dateObj) {
                                        return (<span key={dateObj.date} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                                            {formatEventDate(dateObj.date)}
                                        </span>);
                                    })}
                                </div>
                            </div>
                        </div>

                        {event.max_attendees && (<div className="flex items-start gap-3">
                            <Users size={20} className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Capacity</p>
                                <p className="text-base text-gray-800">{event.max_attendees} attendees</p>
                            </div>
                        </div>)}

                        {approvedTicketCount > 0 && (<div className="flex items-start gap-3">
                            <Users size={20} className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Registered</p>
                                <p className="text-base text-gray-800">
                                    {approvedTicketCount}
                                    {isFull && (<span className="ml-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                        Full
                                    </span>)}
                                </p>
                            </div>
                        </div>)}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-inputaccent/30 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:text-accent cursor-pointer">
                            <CalendarPlus size={16} />
                            Add to calendar
                        </a>
                        <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-inputaccent/30 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:text-accent cursor-pointer">
                            <Navigation size={16} />
                            Directions
                        </a>
                        <Link to={`/profile/${event.creator_id}`} className="inline-flex items-center gap-2 rounded-lg border border-inputaccent/30 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:text-accent cursor-pointer">
                            <Mail size={16} />
                            Contact organizer
                        </Link>
                    </div>

                    {eventCollective && (<Link to={`/collective/${eventCollective.id}`} state={{ fromEvent: event.id }} className="mt-4 cursor-pointer" onClick={function () {
                        return toast.loading("Loading Collective...", { duration: 1500 });
                    }}>
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
                    </Link>)}
                </div>

                <div className="lg:w-1/3 w-full lg:sticky lg:top-8 self-center lg:self-start flex flex-col gap-4 p-6 lg:p-0 items-center ">
                    <div className="bg-white rounded-xl border border-inputaccent/20 p-6 shadow-sm space-y-5 w-full">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Registration</h3>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${event.auto_approve
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'}`}>
                                {event.auto_approve ? 'Auto-approved' : 'Manual review'}
                            </span>
                        </div>

                        {userHasTicket ? (<>
                            <button disabled className="w-full py-3 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed">
                                You have Registered for this Event
                            </button>
                            <QrCodeDisplay
                                ticketId={tickets.find(t => t.user_id === user?.id && t.event_id === event.id && t.status === 'approved')!.id}
                                className="mt-4"
                            />
                            <button type="button" onClick={function () {
                                handleCancelTicket(event.id);
                            }} className="w-full py-3 rounded-lg font-semibold border border-red-300 bg-white text-red-600 transition-colors hover:bg-red-50 cursor-pointer">
                                Cancel ticket
                            </button>
                        </>) : userTicketIsPendingCheck ? (
                            <button disabled className="w-full py-3 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed">
                                You have a pending ticket for this event
                            </button>
                        ) : isCreator ? (
                            <button disabled className="w-full py-3 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed">
                                You are the Host
                            </button>
                        ) : isFull ? (userOnWaitlist ? (
                            <button disabled className="w-full py-3 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed">
                                You're on the waitlist
                            </button>
                        ) : (
                            <button type="button" onClick={function () {
                                handleJoinWaitlist(event.id);
                            }} className="w-full py-3 rounded-lg font-semibold bg-amber-500 text-white transition-colors shadow-sm hover:shadow-md hover:bg-amber-600 cursor-pointer">
                                Join waitlist
                            </button>
                        )) : (
                            <button type="button" onClick={function () {
                                return handleCreateTicket(event.id);
                            }} className="w-full py-3 rounded-lg font-semibold bg-accent text-white transition-colors shadow-sm hover:shadow-md hover:bg-accent-dark cursor-pointer">
                                Register for this event
                            </button>
                        )}

                        <p className="text-sm text-gray-500 flex items-start gap-2">
                            {event.auto_approve ? (<>
                                <CheckCircle size={16} className="mt-0.5 shrink-0 text-green-500" />
                                <span>{!isCreator ? 'Registration is automatic. You\'ll be confirmed immediately.' : 'You are the host. Your spot is confirmed.'}</span>
                            </>) : (<>
                                <Info size={16} className="mt-0.5 shrink-0 text-gray-400" />
                                <span>
                                    This event uses manual approval. Your spot isn't confirmed until the
                                    organiser reviews your request.
                                </span>
                            </>)}
                        </p>

                        <hr className="border-inputaccent/20" />

                        <div className="flex items-center justify-between">
                            <ShareButton title={`Join me at ${event.title}!`} text={`${event.title} - ${event.location}, ${event.city}`} url={window.location.href} whatsappText={whatsappShareText} className="border-none shadow-none hover:bg-transparent hover:text-accent text-gray-500 cursor-pointer" />
                            {eventCollective && (user?.id === eventCollective.owner_id || eventCollective?.collective_members?.some(function (el) {
                                return el.user_id === user?.id;
                            })) && (<button className="text-sm text-gray-500 cursor-not-allowed">
                                Already in this event's Collective
                            </button>)}
                            {eventCollective && (user?.id !== eventCollective.owner_id && !eventCollective?.collective_members?.some(function (el) {
                                return el.user_id === user?.id;
                            })) && (<button onClick={function () {
                                return handleJoinCollective(eventCollective.id);
                            }} className="text-sm text-accent hover:underline cursor-pointer">
                                Join collective
                            </button>)}
                        </div>
                    </div>
                    {isCreator && (<div className="bg-white rounded-xl border border-inputaccent/20 p-6 shadow-sm space-y-4 w-full">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Manage event</h3>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                toast.loading("Loading Manage Event...", { duration: 500 });
                                setTimeout(() => {
                                    navigate(`/manage-event/${event.id}`);
                                }, 500);
                            }}
                            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark cursor-pointer"
                        >
                            Manage event
                        </button>

                        {event.isActive ? (<button type="button" className="w-full rounded-lg bg-red-50 text-red-600 border border-red-200 font-medium text-sm hover:bg-red-100 hover:border-red-300 transition-colors duration-150 cursor-pointer px-4 py-2.5" onClick={function () {
                            return handleDelist(event.id);
                        }}>
                            Delist event
                        </button>) : (<button type="button" className="w-full rounded-lg bg-accent text-white border border-accent-dark font-medium text-sm hover:bg-accent-dark transition-colors duration-150 cursor-pointer px-4 py-2.5" onClick={function () {
                            return handleRelist(event.id);
                        }}>
                            Relist event
                        </button>)}
                    </div>)}
                </div>
            </div>
        </div>
    </Layout>);
}
