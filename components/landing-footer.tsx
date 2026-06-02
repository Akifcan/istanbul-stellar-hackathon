import Image from "next/image"
import Link from "next/link"

export default function LandingFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="flex items-center gap-2" aria-label="AdProof home">
            <Image src="/logo.png" alt="AdProof logo" width={30} height={30} />
            <span className="font-semibold tracking-tight">AdProof</span>
          </Link>
          <nav aria-label="Footer" className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#how" className="hover:text-foreground">How it works</Link>
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#demos" className="hover:text-foreground">Demos</Link>
            <Link href="/dashboard" className="hover:text-foreground">Launch app</Link>
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AdProof — Privacy-preserving advertising.
          </p>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            Powered by
            <Image
              src="/Stellar-Logo-Final-Black-RGB.png"
              alt="Stellar"
              width={80}
              height={20}
            />
          </span>
        </div>
      </div>
    </footer>
  )
}
