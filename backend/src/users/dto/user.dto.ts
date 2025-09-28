import { User } from "generated/prisma/client";

export type UserDto = Omit<User, 'hashedPassword'>;
