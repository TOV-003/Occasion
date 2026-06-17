import { Users, Award, Heart, Sparkles, Mail } from "lucide-react";
import Layout from "../Layout";

export default function About() {
    return (
        <Layout>
            <main className="flex flex-col items-center px-4 py-8 lg:px-16 lg:py-16 gap-12">
                <section className="flex flex-col items-center text-center max-w-3xl">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        About <span className="text-accent">Occasion</span>
                    </h1>
                    <p className="mt-4 text-lg text-inputaccent">
                        Connecting people through curated experiences – from intimate gatherings to large-scale festivals.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-inputaccent">
                            <Sparkles size={18} className="text-accent" />
                            <span>Curated Events</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-inputaccent">
                            <Users size={18} className="text-accent" />
                            <span>Local Communities</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-inputaccent">
                            <Award size={18} className="text-accent" />
                            <span>Trusted Organisers</span>
                        </div>
                    </div>
                </section>

                <hr className="w-full max-w-4xl border-inputaccent/30" />

                <section className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl w-full">
                    <div className="rounded-xl border border-inputaccent/20 bg-white p-6 shadow-sm transition hover:border-accent">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                            <Heart size={22} className="text-accent" />
                            Our Mission
                        </h2>
                        <p className="mt-3 text-inputaccent">
                            To empower collectives and independent organisers to share their passion with the world, making every occasion memorable and accessible to everyone.
                        </p>
                    </div>
                    <div className="rounded-xl border border-inputaccent/20 bg-white p-6 shadow-sm transition hover:border-accent">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                            <Sparkles size={22} className="text-accent" />
                            Our Vision
                        </h2>
                        <p className="mt-3 text-inputaccent">
                            A vibrant community where every event becomes a shared story, bridging cultures, interests, and people across the city.
                        </p>
                    </div>
                </section>

                <section className="w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold text-center mb-6">What We Stand For</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-inputaccent/10 bg-inputbg/30 p-4 text-center">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-accent/10 p-3">
                                    <Users size={24} className="text-accent" />
                                </div>
                            </div>
                            <h3 className="mt-3 font-medium">Community First</h3>
                            <p className="text-sm text-inputaccent">We believe in the power of local connections.</p>
                        </div>
                        <div className="rounded-lg border border-inputaccent/10 bg-inputbg/30 p-4 text-center">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-accent/10 p-3">
                                    <Sparkles size={24} className="text-accent" />
                                </div>
                            </div>
                            <h3 className="mt-3 font-medium">Quality Experiences</h3>
                            <p className="text-sm text-inputaccent">Every event is handpicked for its uniqueness.</p>
                        </div>
                        <div className="rounded-lg border border-inputaccent/10 bg-inputbg/30 p-4 text-center">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-accent/10 p-3">
                                    <Heart size={24} className="text-accent" />
                                </div>
                            </div>
                            <h3 className="mt-3 font-medium">Inclusivity</h3>
                            <p className="text-sm text-inputaccent">Welcoming all backgrounds and interests.</p>
                        </div>
                    </div>
                </section>

                <section className="w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold text-center mb-6">Creator</h2>
                    <div className="flex flex-col items-center rounded-xl border border-inputaccent/20 bg-white p-6 shadow-sm transition hover:border-accent max-w-md mx-auto">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl font-light text-accent">
                            V
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">Victor Toba-Ogunleye</h3>
                        <p className="text-sm text-inputaccent">Developer</p>
                        <div className="mt-4 flex gap-4">
                            <a
                                href="https://github.com/TOV-003"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-full border border-inputaccent/20 px-4 py-2 text-sm text-inputaccent transition hover:border-accent hover:text-accent"
                            >
                                GitHub
                            </a>
                            <a
                                href="mailto:victortoba03@gmail.com"
                                className="flex items-center gap-2 rounded-full border border-inputaccent/20 px-4 py-2 text-sm text-inputaccent transition hover:border-accent hover:text-accent"
                            >
                                <Mail size={16} />
                                Contact
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}