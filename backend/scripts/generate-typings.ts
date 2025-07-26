import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

async function main() {
  await new GraphQLDefinitionsFactory().generate({
    typePaths: ['./**/*.graphql'],
    path: join(process.cwd(), 'src/generated/graphql.ts'),
    outputAs: 'class',
    watch: true,
    emitTypenameField: true,
  });
}

main();
