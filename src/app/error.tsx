"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for diagnostic tracking
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center py-20" role="alert">
      <Container size="narrow" className="text-center space-y-6">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-status-error-bg text-status-error-text border border-status-error-border">
          <AlertCircle className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-section-h1 font-bold text-content-primary tracking-tight">
            Something unexpected occurred
          </h1>
          <p className="text-content-secondary text-body-base leading-relaxed">
            We were unable to complete this request. You can try loading the page again or return to the main homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="primary" onClick={() => reset()}>
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Try Again</span>
          </Button>

          <Button variant="secondary" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Return Home</span>
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
