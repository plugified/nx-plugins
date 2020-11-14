import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';
import { readJsonInTree } from '@nrwl/workspace';

describe('application schematic', () => {
  let appTree: Tree;

  const testRunner = new SchematicTestRunner(
    '@plugified/nx-fastify',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should generate files', async () => {
    const tree = await testRunner
      .runSchematicAsync('app', { name: 'myFastifyApp' }, appTree)
      .toPromise();
    expect(tree.readContent('apps/my-fastify-app/src/main.ts')).toContain(
      `import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';`
    );
  });

  it('should generate files inside subdir', async () => {
    const tree = await testRunner
      .runSchematicAsync(
        'app',
        { name: 'myFastifyApp', directory: 'subdir' },
        appTree
      )
      .toPromise();
    expect(
      tree.readContent('apps/subdir/my-fastify-app/src/main.ts')
    ).toContain(
      `import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';`
    );
  });

  it('should add tags to nx json', async () => {
    const tree = await testRunner
      .runSchematicAsync(
        'app',
        { name: 'myFastifyApp', tags: 'e2etag,e2ePackage' },
        appTree
      )
      .toPromise();

    const nxjson = readJsonInTree(tree, 'nx.json');
    expect(nxjson.projects['my-fastify-app'].tags).toEqual([
      'e2etag',
      'e2ePackage',
    ]);
  });

  it('should update tsconfig', async () => {
    const tree = await testRunner
      .runSchematicAsync('app', { name: 'myFastifyApp' }, appTree)
      .toPromise();
    const tsconfig = readJsonInTree(tree, 'apps/my-fastify-app/tsconfig.json');
    expect(tsconfig.references).toContainEqual({
      path: './tsconfig.app.json',
    });
    expect(tsconfig.references).toContainEqual({
      path: './tsconfig.spec.json',
    });
  });

  it('should add types to the tsconfig.app.json', async () => {
    const tree = await testRunner
      .runSchematicAsync('app', { name: 'myFastifyApp' }, appTree)
      .toPromise();
    const tsconfig = readJsonInTree(
      tree,
      'apps/my-fastify-app/tsconfig.app.json'
    );
    expect(tsconfig.compilerOptions.types).toContain('node');
  });
});
