import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LinkForm } from "@/components/LinkBuilder/LinkForm";
import { ArrowLeft } from "lucide-react";

export default function NewLinkPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/links">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Payment Link</h1>
          <p className="text-muted-foreground">
            Set up a new payment link for your product or service
          </p>
        </div>
      </div>

      <LinkForm />
    </div>
  );
}
