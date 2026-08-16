import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import Layout from '../Layout';
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import type { Event, Tickets, Profile, EventServiceStaff } from '../interfaces';
import { UseAuth } from '../context/UseAuth';
import { toast } from 'react-hot-toast';

export default function ManageEvent() {
    const { event, approvedTickets, pendingTickets, tickets, profiles } = useLoaderData() as {
        event: Event;
        approvedTickets: Tickets[];
        pendingTickets: Tickets[];
        tickets: Tickets[];
        profiles: Profile[];
    };

    const { approveTicket, rejectTicket, user, HandleAddEventServiceStaff, getServiceStaff } = UseAuth();
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [activeTab, setActiveTab] = useState<'tickets' | 'details' | 'staff'>('tickets');
    const [serviceStaff, setServiceStaff] = useState<EventServiceStaff[]>([]);
    const [newServiceStaffName, setNewServiceStaffName] = useState('');
    const [newServiceStaffPhone, setNewServiceStaffPhone] = useState('');
    const [newServiceStaffRole, setNewServiceStaffRole] = useState('');
    console.log("Event ID:", event.id);
    console.log("Event Creator ID:", event.creator_id);
    console.log("User ID:", user?.id);
    console.log("Event Name:", event.title);
    const fetchServiceStaff = async () => {
        const serviceStaff = await getServiceStaff(event.id);
        setServiceStaff(serviceStaff);
        console.log("Service Staff:", serviceStaff);
    }

    useEffect(() => {
        function fetchService() {
            fetchServiceStaff();
        }
        fetchService();
    }, [event.id])

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate(`/event/${event.id}`);
    };

    const approvalMode = event.auto_approve ? 'Auto-approve' : 'Manual approval';
    const approvalTone = event.auto_approve
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-amber-100 text-amber-800 border border-amber-200';

    const profileMap = useMemo(() => new Map(profiles.map((profile) => [profile.id, profile])), [profiles]);

    const handleTicketDecision = async (ticketId: string, status: 'approved' | 'rejected') => {
        try {
            if (status === 'approved') {
                await approveTicket(ticketId);
            } else {
                await rejectTicket(ticketId);
            }
            revalidator.revalidate();
        } catch (error) {
            console.error('Error updating ticket status:', error);
            toast.error('Failed to update ticket status.');
        }
    };

    const handleAddServiceStaff = async () => {
        if (!newServiceStaffName.trim() || !newServiceStaffPhone.trim() || !newServiceStaffRole.trim()) {
            toast.error('Please enter all fields.');
            return;
        }

        try {
            await HandleAddEventServiceStaff(
                event.id,
                newServiceStaffName.trim(),
                newServiceStaffPhone.trim(),
                newServiceStaffRole.trim()
            );

            setNewServiceStaffName('');
            setNewServiceStaffPhone('');
            setNewServiceStaffRole('');
            await fetchServiceStaff();
            revalidator.revalidate();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to add service staff member.');
        }
    };


    const renderTicketCard = (ticket: Tickets, status: 'approved' | 'pending') => {
        const profile = profileMap.get(ticket.user_id);
        const fullName = profile?.full_name || 'Unknown user';
        const initials = fullName
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        return (
            <div
                key={ticket.id}
                className="flex flex-col gap-3 rounded-xl border border-inputaccent/20 bg-white p-4 shadow-sm transition-colors hover:border-accent hover:bg-accent/5 sm:flex-row sm:items-center sm:justify-between"
            >
                <Link to={`/profile/${ticket.user_id}`} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                        {initials}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{fullName}</p>
                        <p className="text-xs text-gray-500">Ticket request</p>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                            }`}
                    >
                        {status === 'approved' ? 'Approved' : 'Pending'}
                    </span>

                    {status === 'pending' && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleTicketDecision(ticket.id, 'approved')}
                                className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-dark"
                            >
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTicketDecision(ticket.id, 'rejected')}
                                className="rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-red-300 hover:text-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-gray-500 hover:text-accent transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to previous page
                    </button>

                    <div className="flex flex-col gap-4 rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-2xl font-bold text-accent">
                                    {event.title.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{event.title}</h1>
                                    <p className="mt-1 text-sm text-gray-600">{event.location}, {event.city}</p>
                                </div>
                            </div>

                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${approvalTone}`}>
                                {event.auto_approve ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                                {approvalMode}
                            </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Tickets</p>
                                <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <Users size={18} className="text-accent" />
                                    {tickets.length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Approved</p>
                                <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <CheckCircle2 size={18} className="text-green-600" />
                                    {approvedTickets.length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Pending</p>
                                <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <Clock3 size={18} className="text-amber-600" />
                                    {pendingTickets.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-5 flex gap-2 border-b border-inputaccent/20 pb-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab('tickets')}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'tickets'
                                ? 'bg-accent text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Tickets
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('staff')}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'staff'
                                ? 'bg-accent text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Staff
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('details')}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'details'
                                ? 'bg-accent text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Event details
                        </button>
                    </div>

                    {activeTab === 'staff' ? (
                        <div className="space-y-6">
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Service Staff</h2>
                                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                                        {serviceStaff.length}
                                    </span>
                                </div>

                                <div className="mb-4 rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                    <p className="mb-3 text-sm font-medium text-gray-700">Add Service Staff Member</p>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <input
                                            type="text"
                                            placeholder="Staff/Company name"
                                            value={newServiceStaffName}
                                            onChange={(e) => setNewServiceStaffName(e.target.value)}
                                            className="flex-1 rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone number"
                                            value={newServiceStaffPhone}
                                            onChange={(e) => setNewServiceStaffPhone(e.target.value)}
                                            className="flex-1 rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                        <select
                                            value={newServiceStaffRole}
                                            onChange={(e) => setNewServiceStaffRole(e.target.value)}
                                            className="flex-1 rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            <option value="" disabled>
                                                Select a service...
                                            </option>
                                            <option value="Catering & Bar Services">Catering & Bar Services</option>
                                            <option value="Audio, Visual & Lighting">Audio, Visual & Lighting</option>
                                            <option value="Photography & Videography">Photography & Videography</option>
                                            <option value="Decor & Floral Design">Decor & Floral Design</option>
                                            <option value="Security & Crowd Control">Security & Crowd Control</option>
                                            <option value="Cleaning & Waste Management">Cleaning & Waste Management</option>
                                            <option value="Entertainment & DJs">Entertainment & DJs</option>
                                            <option value="Logistics & Venue Coordination">Logistics & Venue Coordination</option>
                                            <option value="Equipment & Furniture Rentals">Equipment & Furniture Rentals</option>
                                            <option value="Event Staffing & Ushers">Event Staffing & Ushers</option>
                                            <option value="Transportation & Valet">Transportation & Valet</option>
                                            <option value="Ticketing & Promotion">Ticketing & Promotion</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleAddServiceStaff}
                                            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {serviceStaff.length > 0 ? (
                                    <div className="space-y-2">
                                        {serviceStaff.map((staff, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg border border-inputaccent/20 bg-white p-4"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">{staff.staff_or_company_name}</p>
                                                    <p className="text-xs text-gray-500">{staff.phone}</p>
                                                    <p className="text-xs text-gray-500">{staff.role}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                        No service staff added yet.
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Access Staff</h2>
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                        Coming soon
                                    </span>
                                </div>
                                <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                    Access staff management will be available soon.
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'tickets' ? (
                        <div className="space-y-4">
                            {pendingTickets.length > 0 && (
                                <div>
                                    <h2 className="mb-3 text-lg font-semibold text-gray-900">Pending approvals</h2>
                                    <div className="space-y-3">
                                        {pendingTickets.map((ticket) => renderTicketCard(ticket, 'pending'))}
                                    </div>
                                </div>
                            )}

                            {approvedTickets.length > 0 && (
                                <div>
                                    <h2 className="mb-3 text-lg font-semibold text-gray-900">Approved tickets</h2>
                                    <div className="space-y-3">
                                        {approvedTickets.map((ticket) => renderTicketCard(ticket, 'approved'))}
                                    </div>
                                </div>
                            )}

                            {pendingTickets.length === 0 && approvedTickets.length === 0 && (
                                <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                    No ticket requests yet.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Category</p>
                                    <p className="mt-2 text-base font-semibold text-gray-900">{event.category}</p>
                                </div>
                                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Capacity</p>
                                    <p className="mt-2 text-base font-semibold text-gray-900">{event.max_attendees} attendees</p>
                                </div>
                                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Location</p>
                                    <p className="mt-2 flex items-center gap-2 text-base font-semibold text-gray-900">
                                        <MapPin size={16} className="text-accent" />
                                        {event.location}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Dates</p>
                                    <p className="mt-2 flex items-center gap-2 text-base font-semibold text-gray-900">
                                        <CalendarDays size={16} className="text-accent" />
                                        {event.event_dates?.length || 0} scheduled
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Description</p>
                                <p className="mt-2 text-sm leading-6 text-gray-700">{event.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/event/${event.id}`}
                                    className="rounded-lg border border-inputaccent/30 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:text-accent"
                                >
                                    View public event
                                </Link>
                                <Link
                                    to={`/dashboard`}
                                    className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
                                >
                                    Back to dashboard
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </Layout>
    );
}
