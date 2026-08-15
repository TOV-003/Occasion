
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import Layout from '../Layout';
import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import { useMemo, useState } from 'react';
import type { CollectiveMember, CollectiveWithRelations, Event, Profile } from '../interfaces';
import { supabase } from '../api/SupabaseClient';
import { toast } from 'react-hot-toast';

export default function ManageCollective() {
    const { collective, approvedEvents, pendingEvents, approvedMembers, pendingMembers, memberProfiles } = useLoaderData() as {
        collective: CollectiveWithRelations;
        approvedEvents: Event[];
        pendingEvents: Event[];
        approvedMembers: CollectiveMember[];
        pendingMembers: CollectiveMember[];
        memberProfiles: Profile[];
    };
    const revalidator = useRevalidator();
    const [activeTab, setActiveTab] = useState<'events' | 'members'>('events');

    const approvalMode = collective.auto_approve ? 'Auto-approve' : 'Manual approval';
    const approvalTone = collective.auto_approve
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-amber-100 text-amber-800 border border-amber-200';

    const memberMap = useMemo(() => {
        return new Map(memberProfiles.map((profile) => [profile.id, profile]));
    }, [memberProfiles]);

    const handleEventDecision = async (eventId: string, status: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('event_collectives')
                .update({ status })
                .eq('collective_id', collective.id)
                .eq('event_id', eventId);

            if (error) throw error;
            toast.success(status === 'approved' ? 'Event approved.' : 'Event rejected.');
            revalidator.revalidate();
        } catch (error) {
            console.error('Error updating event status:', error);
            toast.error('Failed to update event status.');
        }
    };

    const handleMemberDecision = async (memberId: string, status: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('collective_members')
                .update({ status })
                .eq('id', memberId);

            if (error) throw error;
            toast.success(status === 'approved' ? 'Member approved.' : 'Member rejected.');
            revalidator.revalidate();
        } catch (error) {
            console.error('Error updating member status:', error);
            toast.error('Failed to update member status.');
        }
    };

    const renderEventCard = (event: Event, status: 'approved' | 'pending') => (
        <div
            key={event.id}
            className="group rounded-xl overflow-hidden border border-inputaccent/20 bg-white transition-all duration-300 hover:border-accent hover:shadow-md"
        >
            <div className="flex flex-col sm:flex-row">
                <div className="h-32 w-full shrink-0 overflow-hidden sm:w-40">
                    <img src={event.banner_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>

                <div className="flex-1 p-4">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}
                        >
                            {status === 'approved' ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                            {status === 'approved' ? 'Approved' : 'Pending'}
                        </span>
                    </div>

                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">{event.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-inputaccent">
                        <span className="inline-flex items-center gap-2">
                            <MapPin size={15} />
                            {event.location}, {event.city}
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <CalendarDays size={15} />
                            {event.event_dates?.[0] && new Date(event.event_dates[0].date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                            {event.event_dates && event.event_dates.length > 1 && ` + ${event.event_dates.length - 1} more`}
                        </span>
                    </div>

                    {status === 'pending' && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleEventDecision(event.id, 'approved')}
                                className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-dark"
                            >
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEventDecision(event.id, 'rejected')}
                                className="rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-red-300 hover:text-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderMemberCard = (member: CollectiveMember, status: 'approved' | 'pending') => {
        const profile = memberMap.get(member.user_id);
        const fullName = profile?.full_name || 'Unknown user';
        const initials = fullName
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        return (
            <Link
                to={`/profile/${member.user_id}`}
                key={member.id}
                className="flex flex-col gap-3 rounded-xl border border-inputaccent/20 bg-white p-4 shadow-sm transition-colors hover:border-accent hover:bg-accent/5 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                        {initials}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{fullName}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                </div>

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
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleMemberDecision(member.id, 'approved');
                                }}
                                className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-dark"
                            >
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleMemberDecision(member.id, 'rejected');
                                }}
                                className="rounded-lg border border-inputaccent/30 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-red-300 hover:text-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <Layout>
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <div className="flex flex-col gap-4">
                    <Link
                        to={`/collective/${collective.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-accent transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to collective
                    </Link>

                    <div className="flex flex-col gap-4 rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-2xl font-bold text-accent">
                                    {collective.name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{collective.name}</h1>
                                    <p className="mt-1 text-sm text-gray-600">{collective.description}</p>
                                </div>
                            </div>

                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${approvalTone}`}>
                                {collective.auto_approve ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                                {approvalMode}
                            </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Members</p>
                                <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <Users size={18} className="text-accent" />
                                    {approvedMembers.length + pendingMembers.length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Approved Events</p>
                                <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <CheckCircle2 size={18} className="text-green-600" />
                                    {approvedEvents.length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-inputaccent/20 bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Pending Events</p>
                                <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <Clock3 size={18} className="text-amber-600" />
                                    {pendingEvents.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Approval setting</h2>
                            <p className="text-sm text-gray-600">This setting is fixed for the collective and cannot be changed here.</p>
                        </div>
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${approvalTone}`}>
                            {collective.auto_approve ? 'Auto-approve' : 'Manual review'}
                        </span>
                    </div>

                    <div className="rounded-xl border border-dashed border-inputaccent/30 bg-inputbg/20 p-4 text-sm text-gray-700">
                        {collective.auto_approve
                            ? 'New members and event submissions are approved automatically by default.'
                            : 'New members and event submissions must be reviewed before they are accepted.'}
                    </div>
                </div>

                <div className="rounded-2xl border border-inputaccent/20 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('events')}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'events' ? 'bg-white text-accent shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <CalendarDays size={16} />
                            Events
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('members')}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'members' ? 'bg-white text-accent shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <Users size={16} />
                            Members
                        </button>
                    </div>

                    {activeTab === 'events' ? (
                        <div className="space-y-8">
                            <section>
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h2 className="text-xl font-semibold text-gray-900">Approved events</h2>
                                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                        {approvedEvents.length} live
                                    </span>
                                </div>

                                {approvedEvents.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                        No approved events yet.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {approvedEvents.map((event) => renderEventCard(event, 'approved'))}
                                    </div>
                                )}
                            </section>

                            <section>
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h2 className="text-xl font-semibold text-gray-900">Pending events</h2>
                                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                        {pendingEvents.length} awaiting review
                                    </span>
                                </div>

                                {pendingEvents.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                        No pending events at the moment.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingEvents.map((event) => renderEventCard(event, 'pending'))}
                                    </div>
                                )}
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <section>
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h2 className="text-xl font-semibold text-gray-900">Approved members</h2>
                                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                        {approvedMembers.length} approved
                                    </span>
                                </div>

                                {approvedMembers.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                        No approved members yet.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {approvedMembers.map((member) => renderMemberCard(member, 'approved'))}
                                    </div>
                                )}
                            </section>

                            <section>
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h2 className="text-xl font-semibold text-gray-900">Pending members</h2>
                                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                        {pendingMembers.length} awaiting review
                                    </span>
                                </div>

                                {pendingMembers.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-inputaccent/20 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                        No pending member requests.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pendingMembers.map((member) => renderMemberCard(member, 'pending'))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </Layout>
    );
}


