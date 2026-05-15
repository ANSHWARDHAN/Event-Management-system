import React, { useState } from 'react';
import { FaCalendarCheck, FaEnvelope, FaHandshake, FaLightbulb, FaLinkedin, FaUserTie } from 'react-icons/fa';

const values = [
    {
        icon: <FaCalendarCheck />,
        title: 'Event Operations',
        text: 'Focused on planning clean event flows, ticketing journeys, and reliable user experiences from discovery to check-in.'
    },
    {
        icon: <FaLightbulb />,
        title: 'Product Thinking',
        text: 'Every screen is shaped around clarity, speed, and the real decisions organizers and attendees need to make.'
    },
    {
        icon: <FaHandshake />,
        title: 'Professional Delivery',
        text: 'Built with attention to trust, consistency, and the kind of polished details expected from production platforms.'
    }
];

const About = () => {
    const [photoLoaded, setPhotoLoaded] = useState(true);

    return (
        <div className="space-y-14">
            <section className="relative overflow-hidden rounded-3xl bg-gray-950 text-white shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_34%),linear-gradient(135deg,_rgba(31,41,55,0.92),_rgba(3,7,18,1))]"></div>
                <div className="relative grid gap-10 px-6 py-10 md:grid-cols-[0.9fr_1.1fr] md:px-12 lg:px-16 lg:py-16">
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute -inset-4 rounded-[2rem] border border-white/10 bg-white/5"></div>
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gray-800 shadow-2xl">
                                {photoLoaded ? (
                                    <img
                                        src="/my-photo.jpg"
                                        alt="Anshwardhan Singh Solanki"
                                        className="h-full w-full object-cover"
                                        onError={() => setPhotoLoaded(false)}
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950 px-8 text-center">
                                        <FaUserTie className="mb-5 text-6xl text-gray-300" />
                                        <p className="text-2xl font-bold">Your Photo Here</p>
                                        <p className="mt-3 text-sm leading-6 text-gray-400">
                                            Add your image at client/public/my-photo.jpg to display it here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <span className="mb-5 w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-200">
                            About the Creator
                        </span>
                        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                            Hi, I am Anshwardhan Singh Solanki.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                            I build digital event experiences that feel organized, trustworthy, and easy to use. Eventora reflects my goal of bringing modern product quality to event discovery, booking, dashboards, and administration.
                        </p>
                        <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
                            <div>
                                <p className="text-3xl font-black">01</p>
                                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Platform</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black">360</p>
                                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Event Flow</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black">Pro</p>
                                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">UI Focus</p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-gray-950 transition hover:bg-gray-200">
                                <FaEnvelope /> Contact Me
                            </a>
                            <a href="https://www.linkedin.com/in/anshwardhan-singh-solanki/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                                <FaLinkedin /> LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Profile</p>
                    <h2 className="mt-3 text-3xl font-black text-gray-950 md:text-4xl">A clean, industry-ready event management experience.</h2>
                </div>
                <div className="space-y-5 text-base leading-8 text-gray-600">
                    <p>
                        This platform is designed around the complete event lifecycle: browsing events, reviewing details, booking tickets, managing attendee access, and giving admins the tools they need to operate confidently.
                    </p>
                    <p>
                        My approach combines software engineering with practical product judgment. The focus is not only on features, but also on presentation, reliability, and a smooth experience for both users and organizers.
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {values.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-2xl text-white">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-950">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-gray-500">{item.text}</p>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default About;
