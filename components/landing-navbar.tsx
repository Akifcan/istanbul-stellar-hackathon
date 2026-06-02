"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const LINKS = [
  { href: "/#why", label: "Why AdProof" },
  { href: "/#how", label: "How it works" },
  { href: "/#demos", label: "Demos" },
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
]

export default function LandingNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label="AdProof home">
            <Image src="/logo.png" alt="AdProof logo" width={32} height={32} priority />
            <span className="text-lg font-semibold tracking-tight">AdProof</span>
          </Link>
          <span className="hidden items-center gap-1.5 border-l pl-3 text-xs text-muted-foreground sm:flex">
            Built on
            <Image src="/Stellar-Logo-Final-Black-RGB.png" alt="Stellar" width={56} height={14} />
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
          >
            Launch app
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex size-9 items-center justify-center rounded-md border text-muted-foreground hover:bg-accent md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
