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
    event_dates: {
        date: string;
    }[];
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
