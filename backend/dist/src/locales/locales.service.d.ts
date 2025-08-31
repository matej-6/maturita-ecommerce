import { CreateLocaleInput } from './dto/create-locale.input';
import { UpdateLocaleInput } from './dto/update-locale.input';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class LocalesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createLocaleInput: CreateLocaleInput): import("@prisma/client").Prisma.Prisma__LocaleClient<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(page?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__LocaleClient<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByLocaleCode(localeCode: string): import("@prisma/client").Prisma.Prisma__LocaleClient<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateLocaleInput: UpdateLocaleInput): import("@prisma/client").Prisma.Prisma__LocaleClient<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__LocaleClient<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
