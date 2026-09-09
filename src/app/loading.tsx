import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-24" role="status" aria-label="Loading page content">
      <Container size="narrow" className="text-center space-y-4">
        <div className="inline-block animate-spin h-8 w-8 border-3 border-brand-primary border-t-transparent rounded-full" />
        <p className="text-sm font-medium text-content-secondary animate-pulse">
          Loading fresh wellness content...
        </p>
      </Container>
    </div>
  );
}
