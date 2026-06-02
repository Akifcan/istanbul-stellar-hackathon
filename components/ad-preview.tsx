import Image from "next/image"
import { ImageIcon, Play, X } from "lucide-react"

type AdPreviewData = {
  format: string
  name: string
  description: string
  imageUrl: string
}

function Creative({ data, className }: { data: AdPreviewData; className?: string }) {
  if (!data.imageUrl) {
    return (
      <div
        className={`bg-muted text-muted-foreground flex items-center justify-center ${className ?? ""}`}
      >
        <ImageIcon className="size-6" aria-hidden="true" />
      </div>
    )
  }
  return (
    <div className={`bg-muted relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={data.imageUrl}
        alt=""
        fill
        unoptimized
        sizes="320px"
        className="object-cover"
      />
    </div>
  )
}

function AdLabel() {
  return (
    <span className="text-muted-foreground absolute top-1.5 right-1.5 rounded bg-background/80 px-1.5 py-0.5 text-[9px] font-medium tracking-wide uppercase">
      Ad
    </span>
  )
}

export default function AdPreview({ data }: { data: AdPreviewData }) {
  const title = data.name.trim() || "Your ad title"
  const description = data.description.trim() || "Your ad description shows here."
  const cta = "Learn more"

  let creative

  switch (data.format) {
    case "banner":
      creative = (
        <div className="relative flex w-full max-w-[468px] items-center gap-3 rounded-md border bg-card p-2 shadow-sm">
          <AdLabel />
          <Creative data={data} className="size-16 shrink-0 rounded" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{title}</p>
            <p className="text-muted-foreground line-clamp-2 text-xs">{description}</p>
          </div>
          <span className="bg-brand text-brand-foreground shrink-0 rounded-md px-3 py-1.5 text-xs font-medium">
            {cta}
          </span>
        </div>
      )
      break

    case "popup":
      creative = (
        <div className="bg-foreground/10 flex w-full max-w-[340px] items-center justify-center rounded-xl p-6">
          <div className="relative w-full max-w-[260px] rounded-lg border bg-card p-3 shadow-lg">
            <span className="text-muted-foreground absolute top-2 right-2">
              <X className="size-4" aria-hidden="true" />
            </span>
            <Creative data={data} className="aspect-video w-full rounded-md" />
            <p className="mt-3 text-sm font-semibold">{title}</p>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
              {description}
            </p>
            <span className="bg-brand text-brand-foreground mt-3 block rounded-md py-2 text-center text-xs font-medium">
              {cta}
            </span>
          </div>
        </div>
      )
      break

    case "rewarded":
      creative = (
        <div className="relative w-full max-w-[260px] rounded-lg border bg-card p-3 shadow-sm">
          <AdLabel />
          <div className="relative">
            <Creative data={data} className="aspect-video w-full rounded-md" />
            <span className="bg-foreground/60 text-background absolute inset-0 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium">
              <Play className="size-4 fill-current" aria-hidden="true" />
              Watch to earn
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold">{title}</p>
          <p className="text-brand-teal mt-1 text-xs font-medium">
            Get a reward for watching
          </p>
        </div>
      )
      break

    case "square":
      creative = (
        <div className="relative w-[250px] overflow-hidden rounded-lg border bg-card shadow-sm">
          <AdLabel />
          <Creative data={data} className="aspect-square w-full" />
          <div className="p-3">
            <p className="truncate text-sm font-semibold">{title}</p>
            <p className="text-muted-foreground line-clamp-1 text-xs">{description}</p>
          </div>
        </div>
      )
      break

    case "rectangle":
    default:
      creative = (
        <div className="relative w-[300px] overflow-hidden rounded-lg border bg-card shadow-sm">
          <AdLabel />
          <Creative data={data} className="aspect-video w-full" />
          <div className="p-3">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
              {description}
            </p>
            <span className="bg-brand text-brand-foreground mt-3 inline-block rounded-md px-3 py-1.5 text-xs font-medium">
              {cta}
            </span>
          </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs font-medium">Preview</span>
      <div className="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed bg-muted/20 p-4">
        {data.format ? (
          creative
        ) : (
          <p className="text-muted-foreground text-xs">
            Select an ad type to preview
          </p>
        )}
      </div>
    </div>
  )
}
