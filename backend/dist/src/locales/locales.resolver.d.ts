import { LocalesService } from './locales.service';
import { CreateLocaleInput } from './dto/create-locale.input';
import { UpdateLocaleInput } from './dto/update-locale.input';
export declare class LocalesResolver {
    private readonly localesService;
    constructor(localesService: LocalesService);
    createLocale(createLocaleInput: CreateLocaleInput): import("@prisma/client").Prisma.Prisma__LocaleClient<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
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
    updateLocale(updateLocaleInput: UpdateLocaleInput): import("@prisma/client").Prisma.Prisma__LocaleClient<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    removeLocale(id: string): import("@prisma/client").Prisma.Prisma__LocaleClient<{
        name: string;
        id: string;
        code: string;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
