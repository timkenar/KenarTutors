import React, { useState } from 'react';

type RouteDescriptor = {
  path: string;
  label: string;
  description: string;
  badge?: string;
};

type LandingPageProps = {
  onRouteSelect: (path: string) => void;
  availableRoutes: RouteDescriptor[];
  currentPath: string;
};

const landingHighlights = [
  {
    title: 'Smart Matching',
    description: 'Connect students to the right tutors instantly with data-backed recommendations.',
  },
  {
    title: 'Collaborative Workspace',
    description: 'Share files, track assignments, and chat in one organized dashboard.',
  },
  {
    title: 'Transparent Progress',
    description: 'Real-time updates keep students, tutors, and admins aligned on outcomes.',
  },
];

const testimonialData = [
  {
    quote:
      'TutorFlow keeps every session organized. Students appreciate the visibility and I spend less time chasing updates.',
    name: 'Amira Patel',
    role: 'Lead Tutor, STEM Collective',
    rating: 5,
  },
  {
    quote: 'We improved assignment turnaround by 30% because everyone finally works from the same source of truth.',
    name: 'Daniel Smith',
    role: 'Academic Director, Summit Prep',
    rating: 4,
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onRouteSelect, availableRoutes, currentPath }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleRatingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(`Thanks for rating us ${rating} stars!`);
    setRating(5);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-6">
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-widest text-indigo-300">Kenar Tutors</span>
            <h1 className="text-2xl font-semibold tracking-tight">TutorFlow</h1>
          </div>
          <nav className="hidden flex-1 justify-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => onRouteSelect('/login')}
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium hover:border-white hover:bg-white/10 transition"
            >
              Sign in
            </button>
            <button
              onClick={() => onRouteSelect('/signin')}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium hover:bg-indigo-400 transition"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Where students meet mentors</p>
            <h2 className="text-4xl font-semibold leading-tight text-white/90 sm:text-5xl">
              A modern workspace for tutoring teams and ambitious learners.
            </h2>
            <p className="text-base text-white/70 sm:text-lg">
              Manage lessons, assignments, and accountability on a single platform that feels as polished as your
              teaching. TutorFlow keeps everyone aligned without the messy spreadsheets.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onRouteSelect('/signin')}
                className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-indigo-400 transition"
              >
                Join the beta
              </button>
              <button
                onClick={() => onRouteSelect('/login')}
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:border-white hover:bg-white/10 transition"
              >
                Explore features
              </button>
            </div>
            <div className="flex items-center gap-6 text-white/60">
              <div>
                <p className="text-3xl font-semibold text-white">4k+</p>
                <p className="text-xs uppercase tracking-widest">Lessons organized</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">98%</p>
                <p className="text-xs uppercase tracking-widest">Student satisfaction</p>
              </div>
            </div>
          </div>
          <div className="flex-1 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="rounded-2xl bg-white/5 p-6 shadow-lg">
                <p className="text-sm uppercase tracking-widest text-indigo-200">Live session preview</p>
                <p className="mt-3 text-lg text-white/80">
                  Schedule sessions, upload resources, and track progress in real time.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Active tutors</p>
                  <p className="text-3xl font-semibold">128</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Assignments</p>
                  <p className="text-3xl font-semibold">642</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Avg. response</p>
                  <p className="text-3xl font-semibold">12m</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Success rate</p>
                  <p className="text-3xl font-semibold">96%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Routes</p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-3xl font-semibold text-white/90 sm:text-4xl">
                  Deep link to every experience inside TutorFlow.
                </h3>
                <p className="mt-3 text-white/70">
                  Preview exactly where each path takes you so you can share links with your teams confidently.
                </p>
              </div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                {availableRoutes.length} ROUTES
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {availableRoutes.map((route) => {
                const isActive = currentPath === route.path;
                return (
                  <button
                    key={route.path}
                    onClick={() => onRouteSelect(route.path)}
                    className={`rounded-3xl border border-white/10 bg-white/5 p-6 text-left transition hover:border-indigo-400/60 hover:bg-white/10 ${
                      isActive ? 'ring-2 ring-indigo-400/70' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.5em] text-indigo-200">
                      <span>{route.label}</span>
                      <span className="font-semibold tracking-[0.2em] text-white/70">{route.badge ?? 'Live'}</span>
                    </div>
                    <p className="mt-6 text-3xl font-semibold text-white">{route.path}</p>
                    <p className="mt-3 text-sm text-white/70">{route.description}</p>
                    {isActive && (
                      <span className="mt-6 inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                        Active route
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-white/10 bg-slate-900/60">
          <div className="mx-auto max-w-6xl px-6 pt-16 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Platform features</p>
            <h3 className="mt-3 text-3xl font-semibold text-white/90">Built for clarity, accountability, and speed.</h3>
            <p className="mt-4 text-white/70">
              Every workflow is crafted for tutoring teams so setup takes minutes, not weeks.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
            {landingHighlights.map((feature) => (
              <div key={feature.title} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Feature</p>
                <h3 className="text-xl font-semibold text-white/90">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="border-y border-white/10 bg-slate-900/40">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Testimonials</p>
              <h3 className="mt-3 text-3xl font-semibold text-white/90">What tutoring teams say about us.</h3>
              <div className="mt-8 space-y-6">
                {testimonialData.map((testimonial) => (
                  <figure
                    key={testimonial.name}
                    className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
                  >
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, index) => (
                        <span key={index} aria-hidden className="text-indigo-300">
                          ★
                        </span>
                      ))}
                    </div>
                    <blockquote className="text-lg text-white/80">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                    <figcaption className="text-sm text-white/60">
                      <p className="text-white/90">{testimonial.name}</p>
                      <p>{testimonial.role}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Rate our service</p>
              <h4 className="mt-3 text-2xl font-semibold text-white/90">Share your experience</h4>
              <p className="mt-2 text-sm text-white/70">
                Let us know how TutorFlow is helping your tutoring practice. Your insight informs the next features we
                build.
              </p>
              <form onSubmit={handleRatingSubmit} className="mt-8 space-y-5">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRating(value)}
                      className={`text-3xl transition ${
                        value <= rating ? 'text-indigo-400' : 'text-white/30 hover:text-white/60'
                      }`}
                      aria-label={`${value} star${value > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-white/60">{rating} / 5</span>
                </div>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Tell us about your tutoring wins..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-white placeholder:text-white/40 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-indigo-500 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-indigo-400 transition"
                >
                  Submit rating
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Built for every role</p>
          <h3 className="mt-4 text-3xl font-semibold text-white/90">Students, tutors, and admins stay in sync.</h3>
          <p className="mt-4 text-base text-white/70 sm:text-lg">
            Give students visibility, empower tutors with clarity, and equip admins with the metrics they need to run a
            modern tutoring operation.
          </p>
          <button
            onClick={() => onRouteSelect('/login')}
            className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-white/90 transition"
          >
            See the platform
          </button>
        </section>
      </main>

      <footer id="contact" className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 text-sm text-white/70 md:flex-row md:justify-between">
          <div>
            <p className="text-base font-semibold text-white">Kenar Tutors</p>
            <p className="mt-2">Modern tutoring workflows for ambitious teams.</p>
          </div>
          <div className="space-y-1">
            <p className="text-white/90">Quick contact</p>
            <p>
              Email:{' '}
              <a href="mailto:hello@kenartutors.com" className="text-indigo-300 hover:text-indigo-200">
                hello@kenartutors.com
              </a>
            </p>
            <p>
              Phone:{' '}
              <a href="tel:+15550102048" className="text-indigo-300 hover:text-indigo-200">
                +1 (555) 010-2048
              </a>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-white/90">Visit us</p>
            <p>1200 Learning Lane, Suite 210</p>
            <p>Seattle, WA 98101</p>
          </div>
          <div className="space-y-2">
            <p className="text-white/90">Follow</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 text-center text-xs text-white/50 py-4">
          &copy; {new Date().getFullYear()} Kenar Tutors. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
