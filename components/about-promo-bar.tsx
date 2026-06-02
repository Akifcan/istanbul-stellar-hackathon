"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

const STELLAR_YELLOW = "#FDDA24";

export default function AboutPromoBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div
        className="border-t-2 border-black/10 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]"
        style={{ backgroundColor: STELLAR_YELLOW }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 text-black sm:px-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white">
            <Image src="/logo.png" alt="AdProof" width={24} height={24} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 truncate text-sm font-semibold">
              Get paid in seconds with
              <Image
                src="/Stellar-Logo-Final-Black-RGB.png"
                alt="Stellar"
                width={62}
                height={16}
                className="inline-block"
              />
            </p>
            <p className="hidden truncate text-xs text-black/60 sm:block">
              Instant, low-cost payouts no banks, no middlemen, no waiting.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white hover:opacity-90"
          >
            <span className="hidden sm:inline">Start earning</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 rounded-md p-1.5 text-black/60 hover:bg-black/10 hover:text-black"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
