import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

// DOLEZITE: codegen command nefunguje dobre s bun. pouzivat len npm run codegen!!!!!!!
const config: CodegenConfig = {
  schema: process.env.BACKEND_URL + "/graphql",
  documents: [
    "src/**/*.tsx",
    "src/**/*queries.ts",
    "src/**/*fragments.ts",
    "src/**/queries.ts",
    "src/**/fragments.ts",
    "src/**/mutations.ts",
    "src/**/*mutations.ts",
    "!src/gql/**/*",
  ],
  ignoreNoDocuments: false,
  verbose: true,
  noSilentErrors: true,
  debug: true,
  generates: {
    "./src/graphql/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
      presetConfig: {
        fragmentMasking: {
          unmaskFunctionName: "getFragmentData",
        },
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
