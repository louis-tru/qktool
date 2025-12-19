#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function cp_base_from_qk(baseDir) {
	const out = path.resolve(__dirname);
	// copy files from libs/quark
	// Because these files are completely compatible and identical.
	[
		'_bigint.js',
		'_buffer.ts',
		'_common.ts',
		'_errno.ts',
		'_event.ts',
		'_ext.ts',
		'buffer.ts',
		'jsonb.ts',
		'uri.ts',
	].map(function(name) {
		const bf = fs.readFileSync(`${baseDir}/${name}`);
		fs.writeFileSync(`${out}/${name}`, bf);
	});
}

if (process.argv[2] == 'cp_base') {
	const baseDir = path.resolve(__dirname, '../quark');
	if (fs.existsSync(baseDir)) {
		cp_base_from_qk(baseDir);
	}
	process.exit(0);
}

var pkg = JSON.parse(
	fs.readFileSync(`${__dirname}/package.json`, 'utf8')
);

const _buffer = `${__dirname}/out/${pkg.name}/_buffer.js`;
const _util = `${__dirname}/out/${pkg.name}/_util.d.ts`;

fs.writeFileSync(
	_buffer,
	fs.readFileSync(_buffer, 'utf8').replace(/Promise\.resolve\(\)\.then\(\(\)\s?=>\s?require\(\s*(['"][^'"]+['"])\s*\)\)/, `import($1)`)
);

fs.writeFileSync(
	_util,
	"import './_ext';\n" + fs.readFileSync(_util, 'utf8')
);

delete pkg.scripts.prepare;

fs.writeFileSync(
	`${__dirname}/out/${pkg.name}/package.json`, JSON.stringify(pkg, null, 2),
);

var pkg_lock = `${__dirname}/out/${pkg.name}/package-lock.json`;
if (fs.existsSync(pkg_lock))
	fs.unlinkSync(pkg_lock);