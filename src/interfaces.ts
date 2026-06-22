export interface Profile {
    id: string;
    full_name: string;
    avatar_url: string;
    bio: string;
}

export interface Event {
    id: string;
    creator_id: string;
    title: string;
    category: string;
    description: string;
    city: string;
    location: string;
    banner_url: string;
    max_attendees: number;
    auto_approve: boolean;
    created_at: string;
    event_dates: {
        date: string;
    }[];
    approved_ticket_count: number;
}

export interface EventDate {
    id: string;
    event_id: string;
    date: string;
    created_at: string;
}

export interface Tickets {
    id: string;
    event_id: string;
    user_id: string;
    status: string;
    created_at: string;
}

export interface Collective {
    id: string;
    owner_id: string;
    name: string;
    description: string;
    guidelines: string;
    auto_approve: boolean;
    created_at: string;
}

export interface CollectiveMember {
    id: string;
    collective_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export interface CollectiveFollower {
    id: string;
    collective_id: string;
    user_id: string;
    created_at: string;
}

export interface CollectiveWithRelations extends Collective {
    collective_members: CollectiveMember[];
    collective_followers: CollectiveFollower[];
}

export interface Event_collective {
    event_id: string;
    collective_id: string;
    status: string;
    created_at: string;
}

export interface Profile {
    id: string;
    full_name: string;
    avatar_url: string;
    bio: string
}

export interface Bookmarks {
    id: string;
    user_id: string;
    event_id: string;
    created_at: string;
}