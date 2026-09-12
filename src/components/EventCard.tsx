import { CalendarDays, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../interfaces';
import { formatEventDate } from '../utils/date';

interface EventCardProps {
    event: Event;
    children?: ReactNode;
}

export default function EventCard({ event, children }: EventCardProps) {
    const firstDate = event.event_dates?.[0];
    return (<div className="group cursor-pointer overflow-hidden rounded-xl border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent">
        <Link to={`/event/${event.id}`} className="block">
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
                    {firstDate && formatEventDate(firstDate.date)}
                </p>
            </div>
        </Link>
        {children}
    </div>);
}
