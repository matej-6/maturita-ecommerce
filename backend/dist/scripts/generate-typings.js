"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@nestjs/graphql");
const path_1 = require("path");
async function main() {
    await new graphql_1.GraphQLDefinitionsFactory().generate({
        typePaths: ['./**/*.graphql'],
        path: (0, path_1.join)(process.cwd(), 'src/generated/graphql.ts'),
        outputAs: 'class',
        watch: true,
        emitTypenameField: true,
    });
}
main();
//# sourceMappingURL=generate-typings.js.map