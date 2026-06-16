export interface Profile {
    id: string;
    full_name: string;
    avatar_url: string;
    bio: string;
}

export interface Event {
    event_id: string;
    event_title: string;
    event_banner_url: string;
    event_category: string;
    event_date: Date;
}