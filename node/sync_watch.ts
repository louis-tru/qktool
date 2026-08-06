#!/usr/bin/env node

import * as fs from './fs';
import * as path from 'path';
import { options, helpInfo, defOpts } from '../arguments';
import { execSync } from './syscall';

defOpts('help', 0,									'--help, --help print help info');
defOpts('u', 'louis',								'-u username [{0}]');
defOpts('h', '192.168.0.115',				'-h host [{0}]');
defOpts('t', '~/quark',							'-t target directory [{0}]');
defOpts('i', '',										'-i ignore directory or file');
defOpts('d',  0,										'-d delay time [{0}] watch');

if (options.help) {
	console.log(' ', helpInfo.join('\n  '));
	process.exit(0);
}

// console.log('-----------------------------', options.i)

var root = process.cwd();
var target = `${options.u}@${options.h}:${options.t}`;

console.log(`watch ${root} ${target}`);

var ignore = ['.git', '.svn', 'out', 'node/deps', 'tools/android-toolchain', 'node_modules', '.o', '.a', '.d'];
var count = 1;

if (options.i) {
	if (Array.isArray(options.i)) {
		ignore = ignore.concat(options.i);
	} else {
		ignore.push(options.i);
	}
}

interface Callback {
	(pathname: string, name: string, extname: string, is_dir: boolean): boolean;
}

function eachDirectory(root: string, dir: string, cb: Callback) {
	fs.readdirSync(root + '/' + dir).forEach(name=>{
		var pathname = dir + (dir ? '/': '') + name;
		var stat;
		try {
			stat = fs.lstatSync(root + '/' + pathname);
		} catch(e: any) {
			console.warn('sync_watch#each_directory', e);
			return;
		}
		if (!stat.isSymbolicLink()) {
			var ext = path.extname(pathname);
			if (stat.isDirectory()) {
				if (cb(pathname, name, ext, true)) {
					eachDirectory(root, pathname, cb);
				}
			} else {
				var name = pathname.substring(0, pathname.length - ext.length);
				cb(pathname, name, ext, false);
			}
		}
	});
}

function sync(type: string, dir: string, name: string | null) {
	if (!name)
		return;
	let ext = path.extname(name);
	let pathname = path.join(dir, name);
	if (ignore.find(e=>{
		if (e == ext)
			return true;
		if (e == name)
			return true;
		if (pathname.indexOf(e) == 0)
			return true;
	}))
		return;
	console.log('sync', type, pathname, '...');
	var cmd = `scp ${root}/${pathname} ${target}/${dir}`;
	var r = execSync(cmd);
	console.log('sync', type, `${pathname}`, r.code == 0 ? 'ok': 'fail');
}

function start() {
	fs.watch(root, (type, filename)=>sync(type, '.', filename));

	eachDirectory(root, '', function(pathname: string, name: string, ext: string, is_dir: boolean) {
		if (is_dir) {
			if (ignore.indexOf(name) >= 0 ||
					ignore.indexOf(pathname) >= 0 ||
					ignore.indexOf(ext) >= 0
			) {
				return false;
			}
			fs.watch(root + '/' + pathname, (type, name)=>sync(type, pathname, name));
			count++;
			return true;
		}
		return false;
	});

	// sudo ulimit -HSn 12000

	execSync(`cd ${root}; git status -s | awk '{print $2}'`).stdout.forEach(e=>{
		if (e) {
			const stat = fs.lstatSync(e);
			if (stat.isFile())
				sync('init', path.dirname(e), path.basename(e));
		}
	});

	console.log(`---------------- Start watch dir count ${count} ... ---------------- `);
}

setTimeout(start, Number(options.d) || 0);