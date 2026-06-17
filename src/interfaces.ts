export interface Profile {
    id: string;
    full_name: string;
    avatar_url: string;
    bio: string;
}

export interface Event {
    id: string;
    creator_id: string | null;
    title: string;
    category: string;
    description: string | null;
    city: string;
    location: string | null;
    banner_url: string | undefined;
    max_attendees: number | null;
    auto_approve: boolean | null;
    created_at: string | null;
}

export interface EventDate {
    id: string;
    event_id: string;
    date: Date;
    created_at: string;
}
