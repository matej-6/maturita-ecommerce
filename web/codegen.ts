import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_ENDPOINT!,
  documents: ["src/**/*.ts?(x)"],
  ignoreNoDocuments: false,
  verbose: true,
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
