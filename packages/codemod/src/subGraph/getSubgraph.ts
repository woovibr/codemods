import util from 'util';
import fs from 'fs';

import jscodeshift from 'jscodeshift';

import { debugConsole } from '../debugConsole';

import getInternalImports from '../getInternalImports/getInternalImports';

import { getFullPath } from './getFullPath';
import { getRelativePath } from './getRelativePath';
import { getFilename } from './getFilename';

const readFile = util.promisify(fs.readFile);

const parser = 'tsx';
const j = jscodeshift.withParser(parser);

// eslint-disable-next-line
const empty = () => {};

const stats = (name, quantity) => {
  // eslint-disable-next-line
  quantity = typeof quantity !== 'number' ? 1 : quantity;
  // eslint-disable-next-line
  console.log('update: ', {
    name,
    quantity,
  });
};

// eslint-disable-next-line
const report = () => {};

const getImportsFromFile = async (filename: string) => {
  const content = await readFile(filename);
  const source = content.toString();

  const options = {};

  // a "transform" that extract named exports
  const internalImports = getInternalImports(
    {
      path: filename,
      source,
    },
    {
      j,
      jscodeshift: j,
      stats: options.dry ? stats : empty,
      report: (msg) => report(file, msg),
    },
    options,
  );

  return internalImports.map((i) => getRelativePath(filename, i.source.value));
};

const getSubgraph = async (
  initialFile: string,
  calculateSmallestSubgraph = false,
) => {
  const visited = {};
  visited[initialFile] = false;

  let graph = [initialFile];

  let nodesToVisit = [initialFile];

  while (true) {
    const [nextFile, ...rest] = nodesToVisit;

    if (visited[nextFile]) {
      nodesToVisit = [...rest];
    } else {
      visited[nextFile] = true;

      const fullpath = getFullPath(nextFile);

      const filename = getFilename(fullpath);

      if (filename) {
        const dependenciesImports = await getImportsFromFile(filename);

        graph = [...graph, ...dependenciesImports];

        nodesToVisit = [...rest, ...dependenciesImports];
      } else {
        nodesToVisit = [...rest];
      }
    }

    if (nodesToVisit.length === 0) {
      break;
    }
  }

  if (calculateSmallestSubgraph) {
    debugConsole({
      subGraphSize: graph.length,
      graph,
    });
  }

  if (calculateSmallestSubgraph) {
    if (graph.length <= 1) {
      // eslint-disable-next-line
      console.log('graph is to small');
      return;
    }

    // eslint-disable-next-line
    const [initial, ...relatedFiles] = graph;

    const graphs = {};

    for (const f of relatedFiles) {
      // eslint-disable-next-line
      console.log('processing: ', f);
      const subgraphForFile = await getSubgraph(f);

      // eslint-disable-next-line
      console.log('graph for f: ', subgraphForFile.length);
      graphs[f] = subgraphForFile;
    }

    let minimalFile = relatedFiles[0];
    let min = graphs[minimalFile].length;

    for (const f of relatedFiles) {
      if (graphs[f].length < min) {
        min = graphs[f].length;
        minimalFile = f;
      }
    }

    // eslint-disable-next-line
    debugConsole({
      minimalFile,
      graph: graphs[minimalFile],
    });
  }

  return graph;
};

(async () => {
  try {
    const initialFile = process.argv[2];

    await getSubgraph(initialFile, true);
  } catch (err) {
    // eslint-disable-next-line
    console.log('err: ', err, err.stack);
  }
})();
