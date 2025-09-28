import { LocalesService } from './locales.service';
export declare class LocalesResolver {
    private readonly localesService;
    constructor(localesService: LocalesService);
    findAll(): ({
        readonly code: "en";
        readonly name: "English";
    } | {
        readonly code: "sk";
        readonly name: "Slovensky";
    })[];
    findOne(id: string): {
        readonly code: "en";
        readonly name: "English";
    } | {
        readonly code: "sk";
        readonly name: "Slovensky";
    } | undefined;
}
