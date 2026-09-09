import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Container size="narrow" className="text-center space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-subtle text-brand-primary text-2xl font-display font-bold">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-section-h1 font-bold text-content-primary tracking-tight">
            Page not found
          </h1>
          <p className="text-content-secondary text-body-base leading-relaxed">
            The page you requested could not be located. It may have moved or the address may have been entered incorrectly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="primary" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Back to Humming Drops</span>
            </Link>
          </Button>

          <Button variant="secondary" asChild>
            <Link href="/medcity-smiles">
              <span>Explore MedCity Smiles</span>
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
