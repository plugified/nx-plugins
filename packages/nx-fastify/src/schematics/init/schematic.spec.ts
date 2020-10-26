import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { join } from 'path'

import { InitSchematicSchema } from './schema';

describe('init schematic', () => {
  let appTree: Tree;
  const options: InitSchematicSchema = { skipFormat: true, unitTestRunner: "jest" };

  const testRunner = new SchematicTestRunner(
    '@plugified/nx-fastify',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(testRunner.runSchematicAsync(
        'init',
        options,
        appTree
      ).toPromise()
    ).resolves.not.toThrowError();
  })

  it('should add fastify dependencies', async () => {
    const result = await testRunner.runSchematicAsync('init', options, appTree).toPromise();
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@nrwl/jest']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/node']).toBeDefined();
    expect(packageJson.dependencies['fastify']).toBeDefined();
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    const result = await testRunner.runSchematicAsync(
      'init',
      {
        unitTestRunner: 'none',
      },
      appTree
    ).toPromise();
    expect(result.exists('jest.config.js')).toEqual(false);
  });


  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      const result = await testRunner.runSchematicAsync('init', {}, appTree).toPromise();
      const workspaceJson = readJsonInTree(result, 'workspace.json');
      expect(workspaceJson.cli.defaultCollection).toEqual('@plugified/nx-fastify');
    });
  });
});
