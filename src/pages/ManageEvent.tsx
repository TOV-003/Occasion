import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import Layout from '../Layout';
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import type { Event, EventFormData, Tickets, Profile, EventAccessStaff, EventServiceStaff } from '../interfaces';
import { UseAuth } from '../context/UseAuth';
import { toast } from 'react-hot-toast';
import { supabase } from '../api/SupabaseClient';
export default function ManageEvent() {
    const { event, approvedTickets, pendingTickets, tickets, profiles } = useLoaderData() as {
        event: Event;
        approvedTickets: Tickets[];
        pendingTickets: Tickets[];
        tickets: Tickets[];
        profiles: Profile[];
    };
    const { approveTicket, rejectTicket, user, HandleEditEvent, HandleAddEventServiceStaff, HandleAddEventAccessStaff, getServiceStaff, getAccessStaff, handleRemoveServiceStaff, handleRemoveAccessStaff } = UseAuth();
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [activeTab, setActiveTab] = useState<'tickets' | 'details' | 'staff'>('tickets');
    const [serviceStaff, setServiceStaff] = useState<EventServiceStaff[]>([]);
    const [accessStaff, setAccessStaff] = useState<EventAccessStaff[]>([]);
    const [accessStaffProfiles, setAccessStaffProfiles] = useState<Record<string, Profile>>({});
    const [newServiceStaffName, setNewServiceStaffName] = useState('');
    const [newServiceStaffPhone, setNewServiceStaffPhone] = useState('');
    const [newServiceStaffRole, setNewServiceStaffRole] = useState('');
    const [accessStaffSearch, setAccessStaffSearch] = useState('');
    const [accessStaffSearchResults, setAccessStaffSearchResults] = useState<Profile[]>([]);
    const [selectedAccessStaff, setSelectedAccessStaff] = useState<Profile | null>(null);
    const [isAccessStaffSearching, setIsAccessStaffSearching] = useState(false);
    const [isAssigningAccessStaff, setIsAssigningAccessStaff] = useState(false);
    const [hasSearchedAccessStaff, setHasSearchedAccessStaff] = useState(false);
    const [isStaffLoading, setIsStaffLoading] = useState(true);
    const [staffLoadError, setStaffLoadError] = useState('');
    const [ticketSearch, setTicketSearch] = useState('');
    const [isBulkUpdatingTickets, setIsBulkUpdatingTickets] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSavingEvent, setIsSavingEvent] = useState(false);
    const [editDate, setEditDate] = useState('');
    const [editForm, setEditForm] = useState<EventFormData>({
        title: '', category: '', description: '', city: '', location: '', event_dates: [], max_attendees: null, auto_approve: true, banner_url: '',
    });
    const accessStaffSearchRequest = useRef(0);
    console.log("Event ID:", event.id);
    console.log("Event Creator ID:", event.creator_id);
    console.log("User ID:", user?.id);
    console.log("Event Name:", event.title);
    async function fetchServiceStaff() {
        const serviceStaff = await getServiceStaff(event.id);
        setServiceStaff(serviceStaff);
        console.log("Service Staff:", serviceStaff);
    }
    async function fetchAccessStaff() {
        const assignedAccessStaff = await getAccessStaff(event.id);
        setAccessStaff(assignedAccessStaff);
        const accessStaffUserIds = [...new Set(assignedAccessStaff.map(function (staff) {
            return staff.user_id;
        }))];
        if (accessStaffUserIds.length === 0) {
            setAccessStaffProfiles({});
            return;
        }
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, bio')
            .in('id', accessStaffUserIds);
        if (error) {
            console.error('Error fetching access staff profiles:', error);
            return;
        }
        setAccessStaffProfiles(Object.fromEntries((data ?? []).map(function (profile) {
            return [profile.id, profile];
        })));
    }
    async function fetchStaff() {
        setIsStaffLoading(true);
        setStaffLoadError('');
        try {
            await Promise.all([fetchServiceStaff(), fetchAccessStaff()]);
        }
        catch (error) {
            console.error('Error loading staff:', error);
            setStaffLoadError('Failed to load staff. Please refresh and try again.');
        }
        finally {
            setIsStaffLoading(false);
        }
    }
    useEffect(function () {
        function fetchData() {
            fetchStaff();
        }
        fetchData();
    }, [event.id]);
    function handleBack() {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate(`/event/${event.id}`);
    }
    const approvalMode = event.auto_approve ? 'Auto-approve' : 'Manual approval';
    const approvalTone = event.auto_approve
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-amber-100 text-amber-800 border border-amber-200';
    const profileMap = useMemo(function () {
        return new Map(profiles.map(function (profile) {
            return [profile.id, profile];
        }));
    }, [profiles]);
    const normalizedTicketSearch = ticketSearch.trim().toLowerCase();
    function matchesTicketSearch(ticket: Tickets) {
        return !normalizedTicketSearch || (profileMap.get(ticket.user_id)?.full_name ?? 'Unknown user').toLowerCase().includes(normalizedTicketSearch);
    }
    const filteredPendingTickets = pendingTickets.filter(matchesTicketSearch);
    const filteredApprovedTickets = approvedTickets.filter(matchesTicketSearch);
    async function handleTicketDecision(ticketId: string, status: 'approved' | 'rejected') {
        try {
            if (status === 'approved') {
                await approveTicket(ticketId);
            }
            else {
                await rejectTicket(ticketId);
            }
            revalidator.revalidate();
        }
        catch (error) {
            console.error('Error updating ticket status:', error);
            toast.error('Failed to update ticket status.');
        }
    }
    async function handleAddServiceStaff() {
        if (!newServiceStaffName.trim() || !newServiceStaffPhone.trim() || !newServiceStaffRole.trim()) {
            toast.error('Please enter all fields.');
            return;
        }
        try {
            await HandleAddEventServiceStaff(event.id, newServiceStaffName.trim(), newServiceStaffPhone.trim(), newServiceStaffRole.trim());
            setNewServiceStaffName('');
            setNewServiceStaffPhone('');
            setNewServiceStaffRole('');
            await fetchServiceStaff();
            revalidator.revalidate();
        }
        catch (error) {
            console.error('Error:', error);
            toast.error('Failed to add service staff member.');
        }
    }
    async function handleRemoveEventServiceStaff(staffId: string) {
        if (!window.confirm('Remove this service staff member from the event?'))
            return;
        try {
            await handleRemoveServiceStaff(staffId);
            revalidator.revalidate();
            await fetchServiceStaff();
        }
        catch (error) {
            console.error('Error:', error);
            toast.error('Failed to remove service staff member.');
        }
    }
    async function handleRemoveEventAccessStaff(staffId: string) {
        if (!window.confirm('Remove this access staff member from the event?'))
            return;
        try {
            await handleRemoveAccessStaff(staffId);
            revalidator.revalidate();
            await fetchAccessStaff();
        }
        catch (error) {
            console.error('Error:', error);
            toast.error('Failed to remove access staff member.');
        }
    }
    async function handleAccessStaffSearch(searchValue: string) {
        const requestId = ++accessStaffSearchRequest.current;
        setAccessStaffSearch(searchValue);
        setSelectedAccessStaff(null);
        setHasSearchedAccessStaff(false);
        const trimmedSearch = searchValue.trim();
        if (!trimmedSearch) {
            setAccessStaffSearchResults([]);
            setIsAccessStaffSearching(false);
            return;
        }
        setIsAccessStaffSearching(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, bio')
            .ilike('full_name', `%${trimmedSearch}%`)
            .limit(8);
        if (requestId !== accessStaffSearchRequest.current)
            return;
        setIsAccessStaffSearching(false);
        setHasSearchedAccessStaff(true);
        if (error) {
            console.error('Error searching profiles:', error);
            toast.error('Failed to search accounts.');
            setAccessStaffSearchResults([]);
            return;
        }
        setAccessStaffSearchResults(data ?? []);
    }
    function handleSelectAccessStaff(profile: Profile) {
        accessStaffSearchRequest.current += 1;
        setSelectedAccessStaff(profile);
        setAccessStaffSearch(profile.full_name);
        setAccessStaffSearchResults([]);
    }
    async function handleAssignAccessStaff() {
        if (!selectedAccessStaff)
            return;
        setIsAssigningAccessStaff(true);
        try {
            await HandleAddEventAccessStaff(event.id, selectedAccessStaff.id);
            setSelectedAccessStaff(null);
            setAccessStaffSearch('');
            setAccessStaffSearchResults([]);
            await fetchAccessStaff();
            revalidator.revalidate();
        }
        catch (error) {
            console.error('Error assigning access staff:', error);
            toast.error('Failed to assign access staff member.');
        }
        finally {
            setIsAssigningAccessStaff(false);
        }
    }
    function openEditEventModal() {
        setEditForm({
            title: event.title,
            category: event.category,
            description: event.description,
            city: event.city,
            location: event.location,
            event_dates: event.event_dates?.map(function (eventDate) {
                return eventDate.date;
            }).sort() ?? [],
            max_attendees: event.max_attendees,
            auto_approve: event.auto_approve,
            banner_url: event.banner_url,
        });
        setEditDate('');
        setIsEditModalOpen(true);
    }
    function addEditDate() {
        if (editDate && !editForm.event_dates.includes(editDate)) {
            setEditForm(function (current) {
                return ({ ...current, event_dates: [...current.event_dates, editDate].sort() });
            });
            setEditDate('');
        }
    }
    async function handleEditEvent(formEvent: React.FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        if (!editForm.title.trim() || !editForm.category.trim() || !editForm.description.trim() || !editForm.city.trim() || !editForm.location.trim() || editForm.event_dates.length === 0) {
            toast.error('Please complete all required event details and add at least one date.');
            return;
        }
        setIsSavingEvent(true);
        try {
            await HandleEditEvent(event.id, { ...editForm, title: editForm.title.trim(), category: editForm.category.trim(), description: editForm.description.trim(), city: editForm.city.trim(), location: editForm.location.trim() });
            setIsEditModalOpen(false);
            revalidator.revalidate();
        }
        catch (error) {
            console.error('Error updating event:', error);
        }
        finally {
            setIsSavingEvent(false);
        }
    }
    async function handleBulkTicketDecision(status: 'approved' | 'rejected') {
        if (pendingTickets.length === 0 || !window.confirm(`${status === 'approved' ? 'Approve' : 'Reject'} all ${pendingTickets.length} pending ticket requests?`))
            return;
        setIsBulkUpdatingTickets(true);
        try {
            await Promise.all(pendingTickets.map(function (ticket) {
                return status === 'approved' ? approveTicket(ticket.id) : rejectTicket(ticket.id);
            }));
            toast.success(`All pending tickets ${status}.`);
            revalidator.revalidate();
        }
        catch (error) {
            console.error('Error updating tickets:', error);
            toast.error('Failed to update all pending tickets.');
        }
        finally {
            setIsBulkUpdatingTickets(false);
        }
    }
    function renderTicketCard(ticket: Tickets, status: 'approved' | 'pending') {
        const profile = profileMap.get(ticket.user_id);
        const fullName = profile?.full_name || 'Unknown user';
        const initials = fullName
            .split(' ')
            .map(function (part) {
                return part[0];
            })
            .join('')
            .slice(0, 2)
            .toUpperCase();
        return (<div key={ticket.id} className="flex flex-col gap-3 rounded-xl border border-inputaccent/20 bg-white p-4 shadow-sm transition-colors hover:border-accent hover:bg-accent/5 sm:flex-row sm:items-center sm:justify-between">
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
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'}`}>
                    {status === 'approved' ? 'Approved' : 'Pending'}
                </span>

                {status === 'pending' && (<div className="flex gap-2">
                    <button type="button" onClick={function () {
                        return handleTicketDecision(ticket.id, 'approved');
                    }} className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-dark">
                        Approve
                    </button>
                    <button type="button" onClick={function () {
                        return handleTicketDecision(ticket.id, 'rejected');
                    }} className="rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-red-300 hover:text-red-600">
                        Reject
                    </button>
                </div>)}
            </div>
        </div>);
    }
    return (<Layout>
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
            <div className="flex flex-col gap-4">
                <button type="button" onClick={handleBack} className="inline-flex w-fit items-center gap-1 text-sm font-medium text-gray-500 hover:text-accent transition-colors">
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
                    <button type="button" onClick={function () {
                        return setActiveTab('tickets');
                    }} className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'tickets'
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        Tickets
                    </button>
                    <button type="button" onClick={function () {
                        return setActiveTab('staff');
                    }} className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'staff'
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        Staff
                    </button>
                    <button type="button" onClick={function () {
                        return setActiveTab('details');
                    }} className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'details'
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        Event details
                    </button>
                </div>

                {activeTab === 'staff' ? (<div className="space-y-6">
                    {isStaffLoading && <p className="text-sm text-gray-500">Loading staff...</p>}
                    {staffLoadError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{staffLoadError}</p>}
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
                                <input type="text" placeholder="Staff/Company name" value={newServiceStaffName} onChange={function (e) {
                                    return setNewServiceStaffName(e.target.value);
                                }} className="flex-1 rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent" />
                                <input type="tel" placeholder="Phone number" value={newServiceStaffPhone} onChange={function (e) {
                                    return setNewServiceStaffPhone(e.target.value);
                                }} className="flex-1 rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent" />
                                <select value={newServiceStaffRole} onChange={function (e) {
                                    return setNewServiceStaffRole(e.target.value);
                                }} className="flex-1 rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent">
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
                                <button type="button" onClick={handleAddServiceStaff} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">
                                    Add
                                </button>
                            </div>
                        </div>

                        {serviceStaff.length > 0 ? (<div className="space-y-2">
                            {serviceStaff.map(function (staff, index) {
                                return (<div key={index} className="flex items-center justify-between rounded-lg border border-inputaccent/20 bg-white p-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{staff.staff_or_company_name}</p>
                                        <p className="text-xs text-gray-500">{staff.phone}</p>
                                        <p className="text-xs text-gray-500">{staff.role}</p>
                                    </div>
                                    <button type="button" className="cursor-pointer rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50" onClick={function () {
                                        return handleRemoveEventServiceStaff(staff.id);
                                    }}>
                                        Remove
                                    </button>
                                </div>);
                            })}
                        </div>) : (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                            No service staff added yet.
                        </div>)}
                    </div>

                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Access Staff</h2>
                            <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                                {accessStaff.length}
                            </span>
                        </div>
                        <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                            <label htmlFor="access-staff-search" className="mb-2 block text-sm font-medium text-gray-700">
                                Search for an account
                            </label>
                            <div className="relative">
                                <input id="access-staff-search" type="search" placeholder="Search by full name" value={accessStaffSearch} onChange={function (e) {
                                    return handleAccessStaffSearch(e.target.value);
                                }} className="w-full rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent" />

                                {(isAccessStaffSearching || accessStaffSearchResults.length > 0) && (<div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-inputaccent/20 bg-white shadow-lg">
                                    {isAccessStaffSearching ? (<p className="px-3 py-2 text-sm text-gray-500">Searching accounts...</p>) : (accessStaffSearchResults.map(function (profile) {
                                        return (<button key={profile.id} type="button" onClick={function () {
                                            return handleSelectAccessStaff(profile);
                                        }} className="flex w-full items-center px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-accent/10">
                                            {profile.full_name}
                                        </button>);
                                    }))}
                                </div>)}
                                {hasSearchedAccessStaff && !isAccessStaffSearching && accessStaffSearchResults.length === 0 && (<p className="mt-2 text-sm text-gray-500">No accounts found.</p>)}
                            </div>

                            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-600">
                                    {selectedAccessStaff ? `Selected: ${selectedAccessStaff.full_name}` : 'Choose an account to give event access.'}
                                </p>
                                <button type="button" onClick={handleAssignAccessStaff} disabled={!selectedAccessStaff || isAssigningAccessStaff} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50">
                                    {isAssigningAccessStaff ? 'Assigning...' : 'Assign'}
                                </button>
                            </div>
                        </div>

                        {accessStaff.length > 0 ? (<div className="mt-4 space-y-2">
                            {accessStaff.map(function (staff) {
                                const profile = accessStaffProfiles[staff.user_id];
                                const fullName = profile?.full_name || 'Unknown user';
                                const initials = fullName
                                    .split(' ')
                                    .map(function (part) {
                                        return part[0];
                                    })
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase();
                                return (<div key={staff.id} className="flex items-center justify-between rounded-lg border border-inputaccent/20 bg-white p-4">
                                    <Link to={`/profile/${staff.user_id}`} className="flex items-center gap-3 transition-opacity hover:opacity-75">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{fullName}</p>
                                            <p className="text-xs text-gray-500">Access staff</p>
                                        </div>
                                    </Link>
                                    <button type="button" className="cursor-pointer rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50" onClick={function () {
                                        return handleRemoveEventAccessStaff(staff.id);
                                    }}>
                                        Remove
                                    </button>
                                </div>);
                            })}
                        </div>) : (<div className="mt-4 rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                            No access staff assigned yet.
                        </div>)}
                    </div>
                </div>) : activeTab === 'tickets' ? (<div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <input type="search" value={ticketSearch} onChange={function (event) {
                            return setTicketSearch(event.target.value);
                        }} placeholder="Search ticket requests by name" className="w-full rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-sm" />
                        {pendingTickets.length > 0 && (<div className="flex gap-2">
                            <button type="button" onClick={function () {
                                return handleBulkTicketDecision('approved');
                            }} disabled={isBulkUpdatingTickets} className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                                Approve all
                            </button>
                            <button type="button" onClick={function () {
                                return handleBulkTicketDecision('rejected');
                            }} disabled={isBulkUpdatingTickets} className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                                Reject all
                            </button>
                        </div>)}
                    </div>
                    {pendingTickets.length > 0 && (<div>
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Pending approvals</h2>
                        <div className="space-y-3">
                            {filteredPendingTickets.map(function (ticket) {
                                return renderTicketCard(ticket, 'pending');
                            })}
                        </div>
                    </div>)}

                    {approvedTickets.length > 0 && (<div>
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Approved tickets</h2>
                        <div className="space-y-3">
                            {filteredApprovedTickets.map(function (ticket) {
                                return renderTicketCard(ticket, 'approved');
                            })}
                        </div>
                    </div>)}

                    {ticketSearch && filteredPendingTickets.length === 0 && filteredApprovedTickets.length === 0 && (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">No ticket requests match your search.</div>)}

                    {pendingTickets.length === 0 && approvedTickets.length === 0 && (<div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                        No ticket requests yet.
                    </div>)}
                </div>) : (<div className="space-y-5">
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
                        <Link to={`/event/${event.id}`} className="rounded-lg border border-inputaccent/30 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:text-accent">
                            View public event
                        </Link>
                        <Link to={`/dashboard`} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark">
                            Back to dashboard
                        </Link>
                        <button type="button" onClick={openEditEventModal} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark">
                            Edit event
                        </button>
                    </div>
                </div>)}
            </div>
        </main>
        {isEditModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-event-title">
            <form onSubmit={handleEditEvent} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 id="edit-event-title" className="text-xl font-bold text-gray-900">Edit event</h2>
                    <button type="button" onClick={function () {
                        return setIsEditModalOpen(false);
                    }} className="text-sm font-medium text-gray-500 hover:text-gray-900">Cancel</button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700 sm:col-span-2">Title
                        <input required value={editForm.title} onChange={function (event) {
                            return setEditForm(function (current) {
                                return ({ ...current, title: event.target.value });
                            });
                        }} className="mt-1 w-full rounded-lg border border-inputaccent/30 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-accent" />
                    </label>
                    <label className="text-sm font-medium text-gray-700">Category
                        <input required value={editForm.category} onChange={function (event) {
                            return setEditForm(function (current) {
                                return ({ ...current, category: event.target.value });
                            });
                        }} className="mt-1 w-full rounded-lg border border-inputaccent/30 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-accent" />
                    </label>
                    <label className="text-sm font-medium text-gray-700">Maximum attendees
                        <input type="number" min="1" value={editForm.max_attendees ?? ''} onChange={function (event) {
                            return setEditForm(function (current) {
                                return ({ ...current, max_attendees: event.target.value ? Number(event.target.value) : null });
                            });
                        }} className="mt-1 w-full rounded-lg border border-inputaccent/30 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-accent" />
                    </label>
                    <label className="text-sm font-medium text-gray-700">Location
                        <input required value={editForm.location} onChange={function (event) {
                            return setEditForm(function (current) {
                                return ({ ...current, location: event.target.value });
                            });
                        }} className="mt-1 w-full rounded-lg border border-inputaccent/30 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-accent" />
                    </label>
                    <label className="text-sm font-medium text-gray-700">City
                        <input required value={editForm.city} onChange={function (event) {
                            return setEditForm(function (current) {
                                return ({ ...current, city: event.target.value });
                            });
                        }} className="mt-1 w-full rounded-lg border border-inputaccent/30 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-accent" />
                    </label>
                    <label className="text-sm font-medium text-gray-700 sm:col-span-2">Description
                        <textarea required rows={4} value={editForm.description} onChange={function (event) {
                            return setEditForm(function (current) {
                                return ({ ...current, description: event.target.value });
                            });
                        }} className="mt-1 w-full rounded-lg border border-inputaccent/30 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-accent" />
                    </label>
                </div>
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Event dates</p>
                    <div className="mt-1 flex gap-2">
                        <input type="date" value={editDate} onChange={function (event) {
                            return setEditDate(event.target.value);
                        }} className="rounded-lg border border-inputaccent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                        <button type="button" onClick={addEditDate} disabled={!editDate} className="rounded-lg border border-inputaccent/30 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">Add date</button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {editForm.event_dates.map(function (date) {
                            return (<span key={date} className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
                                {date}
                                <button type="button" onClick={function () {
                                    return setEditForm(function (current) {
                                        return ({
                                            ...current, event_dates: current.event_dates.filter(function (item) {
                                                return item !== date;
                                            })
                                        });
                                    });
                                }} aria-label={`Remove ${date}`}>×</button>
                            </span>);
                        })}
                    </div>
                </div>
                <label className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={editForm.auto_approve} onChange={function (event) {
                        return setEditForm(function (current) {
                            return ({ ...current, auto_approve: event.target.checked });
                        });
                    }} />
                    Automatically approve ticket requests
                </label>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={function () {
                        return setIsEditModalOpen(false);
                    }} className="rounded-lg border border-inputaccent/30 px-4 py-2 text-sm font-medium text-gray-700">Cancel</button>
                    <button type="submit" disabled={isSavingEvent} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{isSavingEvent ? 'Saving...' : 'Save changes'}</button>
                </div>
            </form>
        </div>)}
    </Layout>);
}
