import { Search, Users, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../api/SupabaseClient';
import Layout from '../Layout';
import Skeleton from '../components/Skeleton';
import { toast } from 'react-hot-toast';
import type { CollectiveWithRelations } from '../interfaces';

export default function Collectives() {
    const [collectives, setCollectives] = useState<CollectiveWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const debounceTimeoutRef = useRef<number | null>(null);

    const fetchCollectives = async (reset: boolean = false) => {
        if (reset) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        let query = supabase
            .from('collectives')
            .select('*, collective_members (*), collective_followers (*)')
            .order('created_at', { ascending: false })
            .limit(10);

        if (searchQuery.trim()) {
            query = query.or(`name.ilike.%${searchQuery.trim()}%, description.ilike.%${searchQuery.trim()}%`);
        }

        if (!reset && cursor) {
            query = query.lt('created_at', cursor);
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
            setLoading(false);
            setIsLoadingMore(false);
            return;
        }

        if (reset) {
            setCollectives(data || []);
        } else {
            setCollectives(prev => [...prev, ...(data || [])]);
        }

        if (data && data.length > 0) {
            const lastItem = data[data.length - 1];
            setCursor(lastItem.created_at);
            setHasMore(data.length === 10);
        } else {
            setHasMore(false);
        }

        setLoading(false);
        setIsLoadingMore(false);
    };

    useEffect(() => {
        function set() {
            setCollectives([]);
            setCursor(null);
            setHasMore(true);
            fetchCollectives(true);
        }
        set();
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = null;
        }

        if (value.trim() === '') {
            setSearchQuery('');
            return;
        }

        if (value.length >= 3) {
            debounceTimeoutRef.current = setTimeout(() => {
                setSearchQuery(value.trim());
            }, 300);
        } else {
            setSearchQuery('');
        }
    };

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const loadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchCollectives(false);
        }
    };

    if (loading && collectives.length === 0) {
        return <Layout><Skeleton variant="home" /></Layout>;
    }

    return (
        <Layout>
            <main className="flex flex-col gap-16 items-center lg:items-start px-4 py-8 lg:px-32 lg:py-12 lg:max-w-6xl lg:mx-auto w-full">
                <div className="flex flex-col items-center lg:items-start justify-end w-full">
                    <h1 className="text-2xl">Collectives</h1>
                    <p className="text-md font-light text-inputaccent">
                        Groups and organisations creating events in your city.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 w-full justify-center">
                        <div className="relative flex-1 w-full">
                            <Search
                                color="var(--color-inputaccent)"
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="text"
                                placeholder="Search collectives by name or description..."
                                className="w-full bg-inputbg/30 border-inputaccent pl-9 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-ring placeholder:text-muted-foreground"
                                value={inputValue}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-b-1/2 w-screen self-center border-inputaccent/50" />

                <div className="flex flex-col items-center justify-center gap-4 w-full lg:items-start">
                    <div className="flex items-center w-full justify-between">
                        <h2 className="text-xl">
                            {searchQuery ? 'Search Results' : 'All Collectives'}
                        </h2>
                        <p className="text-sm text-inputaccent">
                            {collectives.length} {collectives.length === 1 ? 'collective' : 'collectives'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 w-full justify-center">
                        {collectives.map((collective) => (
                            <Link
                                to={`/collective/${collective.id}`}
                                key={collective.id}
                                className="group relative rounded-xl w-84 overflow-hidden border border-inputaccent/20 bg-white transition-colors duration-300 hover:border-accent"
                                onClick={() => toast.loading("Loading Collective...", { duration: 1500 })}
                            >
                                <div className="flex flex-col gap-2 p-4">
                                    <div className="flex items-center justify-center p-6 bg-accent/10 rounded-lg h-14 w-14 aspect-square">
                                        <span className="text-3xl font-light text-accent">{collective.name[0]}</span>
                                    </div>
                                    <h2 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">
                                        {collective.name}
                                    </h2>
                                    <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                        {collective.description || 'No description'}
                                    </p>
                                    <div className="flex gap-2">
                                        <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                            <Users size={15} />
                                            <span>{collective.collective_members?.length || 0}</span>
                                            Members
                                        </p>
                                        <p className="text-sm font-light text-inputaccent flex flex-row gap-2">
                                            <Users size={15} />
                                            <span>{collective.collective_followers?.length || 0}</span>
                                            Followers
                                        </p>
                                    </div>
                                    <div className="absolute top-4 right-4 group-hover:scale-140 transition-transform duration-300">
                                        <ChevronRight color="var(--color-inputaccent)" size={15} />
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {collectives.length === 0 && !loading && (
                            <p className="text-center text-sm text-gray-500 w-full">
                                No collectives found
                            </p>
                        )}

                        {hasMore && (
                            <button
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                className="text-center text-sm text-gray-500 hover:text-accent transition-colors disabled:opacity-50 w-full"
                            >
                                {isLoadingMore ? 'Loading...' : 'Load more'}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </Layout>
    );
}