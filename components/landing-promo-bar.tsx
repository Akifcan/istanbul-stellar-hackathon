"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export default function LandingPromoBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="border-t bg-background/95 backdrop-blur shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10">
            <Image src="/logo.png" alt="AdProof" width={24} height={24} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              Get paid the instant your ads are seen — no middlemen, no waiting.
            </p>
            <p className="hidden items-center gap-1.5 truncate text-xs text-muted-foreground sm:flex">
              Instant payouts, settled on
              <Image
                src="/Stellar-Logo-Final-Black-RGB.png"
                alt="Stellar"
                width={52}
                height={13}
                className="inline-block"
              />
              · keep more of every impression.
            </p>
          </div>

          <span className="hidden items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground lg:flex">
            Powered by
            <Image
              src="/Stellar-Logo-Final-Black-RGB.png"
              alt="Stellar"
              width={56}
              height={14}
            />
          </span>

          <Link
            href="/login"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground hover:opacity-90"
          >
            <span className="hidden sm:inline">Start earning</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
