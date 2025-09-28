export declare class LocalesService {
    constructor();
    findAll(): ({
        readonly code: "en";
        readonly name: "English";
    } | {
        readonly code: "sk";
        readonly name: "Slovensky";
    })[];
    findOne(code: string): {
        readonly code: "en";
        readonly name: "English";
    } | {
        readonly code: "sk";
        readonly name: "Slovensky";
    } | undefined;
}
