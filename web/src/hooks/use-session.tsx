import { currentSessionQueryOptions } from "@/queries/current-session-query-options";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useSession() {
  return useQuery(currentSessionQueryOptions);
}
