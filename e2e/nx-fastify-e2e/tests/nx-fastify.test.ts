import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

jest.setTimeout(300000);

describe('nx-fastify e2e', () => {
  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-fastify');
      ensureNxProject('@plugified/nx-fastify', 'dist/packages/nx-fastify');
      await runNxCommandAsync(
        `generate @plugified/nx-fastify:application ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/main.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-fastify');
      ensureNxProject('@plugified/nx-fastify', 'dist/packages/nx-fastify');
      await runNxCommandAsync(
        `generate @plugified/nx-fastify:application ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
