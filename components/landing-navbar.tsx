import Image from "next/image"
import Link from "next/link"

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2" aria-label="AdProof home">
          <Image src="/logo.png" alt="AdProof logo" width={32} height={32} priority />
          <span className="text-lg font-semibold tracking-tight">AdProof</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#why" className="hover:text-foreground">Why AdProof</Link>
          <Link href="#demos" className="hover:text-foreground">Demos</Link>
        </div>

        <Link
          href="/dashboard"
          className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
        >
          Launch app
        </Link>
      </nav>
    </header>
  )
}
