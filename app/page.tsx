import Link from "next/link";
import {
  Zap,
  FileText,
  Brain,
  Download,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StepIndicator({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
        {step}
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Luminate
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
                <Zap className="h-3.5 w-3.5" />
                AI-powered study materials
              </div>

              <h1 className="animate-fade-in stagger-1 mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl md:leading-[1.1]">
                Turn any lecture into
                <br />
                <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                  active recall
                </span>
              </h1>

              <p className="animate-fade-in stagger-2 mb-10 text-lg leading-relaxed text-muted-foreground md:text-xl">
                Upload a PDF, and Luminate transforms it into structured
                summaries, flashcards, and key terminology. Built for the
                11th-hour study session.
              </p>

              <div className="animate-fade-in stagger-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30"
                >
                  Start studying
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-surface-elevated"
                >
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-border bg-surface-elevated"
        >
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                One flow. Zero friction.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                No configuration, no prompt engineering, no learning curve.
                Upload your PDF and get structured study materials in seconds.
              </p>
            </div>

            <div className="mx-auto mb-16 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <StepIndicator step={1} label="Upload PDF" />
              <div className="hidden h-px flex-1 bg-border sm:block" />
              <StepIndicator step={2} label="AI processes" />
              <div className="hidden h-px flex-1 bg-border sm:block" />
              <StepIndicator step={3} label="Study and export" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={FileText}
                title="Smart extraction"
                description="Drop any lecture PDF. Luminate extracts and structures the content, handling dense slides and multi-column layouts."
              />
              <FeatureCard
                icon={Brain}
                title="Active recall framework"
                description="Gemini transforms raw text into a Feynman-style summary, targeted flashcards, and a curated terminology list."
              />
              <FeatureCard
                icon={Download}
                title="Export anywhere"
                description="Download your study materials as clean Markdown. Take them into Notion, Obsidian, or any tool you prefer."
              />
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Ready to study smarter?
              </h2>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                Your next exam is closer than you think. Start turning lectures
                into lasting knowledge.
              </p>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30"
              >
                Create your free account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-sm text-muted-foreground">
            Luminate. Built for students, by students.
          </span>
          <span className="text-xs text-muted">
            Powered by Gemini
          </span>
        </div>
      </footer>
    </div>
  );
}
