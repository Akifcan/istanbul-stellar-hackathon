"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { setWallet } from "@/lib/wallet";

// Read-only demo wallet — lets reviewers explore the dashboard without Freighter.
const DEMO_WALLET = "GCVKAMMHFYJBE67VKC3IUUMD44P2WSPJSSS77P5RCLIE7TUGTHQ56MKD";

export default function DemoLoginButton() {
  const router = useRouter();

  const handleDemo = () => {
    setWallet(DEMO_WALLET);
    toast.success("Signed in to the demo account");
    router.push("/dashboard");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleDemo}
      className="h-12 w-full gap-2"
    >
      <Image src="/logo.png" alt="" width={30} height={30} aria-hidden="true" />
      Try demo account
    </Button>
  );
}
