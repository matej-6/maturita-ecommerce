import { refreshToken } from "@/lib/refresh-token";
import { mutationOptions } from "@tanstack/react-query";

export const refreshTokenMutationOptions = mutationOptions({
  mutationKey: ["refresh-token"],
  mutationFn: async () => {
    const res = await refreshToken();
    return res;
  },
});
