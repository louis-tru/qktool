
import util from './util';
import path from './uri';
import * as nodePath from 'path';

path.cwd();
path.chdir('/');

util.assert(
	path.relative('/Users/louis/Project/touchcode2/deps/kace',
		'/Users/louis/Project/touchcode2/deps/kace/out/kace.gypi') == 'out/kace.gypi',
	'path.relative failed'
);

util.assert(
	path.relative(
		'/Users/louis/Project/touchcode2/deps/kace',
		'/Users/louis/Project/graphics/quark/out/qkmake/product/quark.gypi') == '../../../graphics/quark/out/qkmake/product/quark.gypi',
	'path.relative failed'
);

// Local paths must match Node's path.relative semantics. In particular, the
// last component of `from` is never inferred to be a file.
for (const [from, to] of [
	['/a/b', '/a/b/c'],
	['/a/b/c', '/a/b'],
	['/a/b/c', '/a/d/e'],
	['/a/b/c/', '/a/b/c/out/'],
	['/', '/a/b'],
	['/a/b', '/'],
	['/A/B/C/test.js', '/home'],
	['/a/b/../c', '/a/d/./e'],
]) {
	const actual = path.relative(from, to);
	const expected = nodePath.posix.relative(from, to);
	util.assert(actual == expected,
		`path.relative('${from}', '${to}') = '${actual}', expected '${expected}'`);
}

// Unlike Node, Qk returns an explicit current-directory path instead of an
// empty string, which is safer when the result is used in configuration or a command.
util.assert(path.relative('/a/b', '/a/b') == '.',
	'path.relative should return current directory for identical paths');

util.assert(
	path.relative('http://a.example/A/B', 'https://b.example/C/D') == 'https://b.example/C/D',
	'path.relative should return an absolute URL for a different origin'
);
