"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

export function HeaderClient() {
  const { data } = useSuspenseQuery({});
}
