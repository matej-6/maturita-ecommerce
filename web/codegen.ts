import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

// DOLEZITE: codegen command nefunguje dobre s bun. pouzivat len npm run codegen!!!!!!!

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_URL!,
  documents: ["src/app/data-access-layer/**/*.graphql.ts"],
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
