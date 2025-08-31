"use client";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Oopsie daisy</h1>
      <p className="text-lg">{error.message}</p>
      <Button onClick={reset}>Reset</Button>
    </div>
  );
}
