/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2015, blue.chu
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of blue.chu nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL blue.chu BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof __binding__ == 'function') {
	require('quark/_ext');
} else {
	require('./_ext');
}

import {Event, Notification, EventNoticer} from './event';

const base64_chars =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

const isNode: boolean = !!globalThis.process;
const isQuark: boolean = !!globalThis.__binding__;
const isWeb: boolean = !!globalThis.document;

type Platform = 'darwin' | 'linux' | 'win32' | 'android'
| 'freebsd'
| 'openbsd'
| 'sunos'
| 'cygwin'
| 'netbsd' | 'web';

let argv: string[] = [];
let webFlags: WebPlatformFlags | null = null;
let platform: Platform;
let gc: ()=>void = unrealized;

export type Optopns = Dict<string|string[]>;

let options: Optopns = {};  // start options
let config: Dict | null = null;
let isWin32: boolean = false;
let _quark_util: any;
let debug = false;

const _require = function(a: any, ...args: any[]) { return a(args[0]) }((a:any)=>a, require);

export interface WebPlatformFlags {
	windows: boolean,
	windowsPhone: boolean,
	linux: boolean,
	android: boolean,
	macos: boolean,
	ios: boolean,
	iphone: boolean,
	ipad: boolean,
	ipod: boolean,
	mobile: boolean,
	touch: boolean,
	trident: boolean,
	presto: boolean,
	webkit: boolean,
	gecko: boolean
}

interface IProcess {
	getNoticer(name: string): EventNoticer;
	exit(code?: number): void;
}

export let _process: IProcess;

const _processHandles = {
	BeforeExit: (noticer: EventNoticer, code = 0)=>{
		noticer.triggerWithEvent(new Event(code));
	},
	Exit: (noticer: EventNoticer, code = 0)=>{
		noticer.triggerWithEvent(new Event(code));
	},
	UncaughtException: (noticer: EventNoticer, err: Error)=>{
		noticer.length && noticer.triggerWithEvent(new Event(err));
	},
	UnhandledRejection: (noticer: EventNoticer, reason: Error, promise: Promise<any>)=>{
		noticer.length && noticer.triggerWithEvent(new Event({ reason, promise }));
	},
};

function parse_options(argv: string[]) {
	let putkv = (k: string, v: string)=>{
		if (options.hasOwnProperty(k)) {
			options[k] += ' ' + v;
		} else {
			options[k] = v;
		}
	};

	let lastKey = '';
	(argv as string[]).forEach((e,i)=>{
		let mat = e.match(/^(-{1,2})([^=]+)(?:=(.*))?$/);
		if (mat) {
			let k = mat[2].replace(/-/gm, '_');
			let v = mat[3];
			if (!v && mat[1] == '-') {
				putkv((lastKey = k), '');
			} else {
				putkv(k, v || '');
				lastKey = '';
			}
		} else if (e) {
			if (lastKey) {
				putkv(lastKey, e);
				lastKey = '';
			} else if (options.__main__) {
				putkv('__unknown__', e);
			} else {
				options.__main__ = e;
				options.__mainIdx__ = i + 1 + '';
			}
		}
	});
	debug = 'inspect' in options ||
					'inspect_brk' in options;

	if ( 'url_arg' in options ) {
		if (Array.isArray(options.url_arg))
			options.url_arg = options.url_arg.join('&');
	} else {
		options.url_arg = '';
	}
	if ('no_cache' in options || debug) {
		if (options.url_arg) {
			options.url_arg += '&__no_cache';
		} else {
			options.url_arg = '__no_cache';
		}
	}
}

if (isQuark) {
	_quark_util = __binding__('_util');
	isWin32 = _quark_util.default.platform == 'win32';
	argv = _quark_util.default.argv;
	debug = _quark_util.default.debug;
	options = _quark_util.default.options;
	platform = _quark_util.default.platform as Platform;
	gc = _quark_util.default.gc;
	_process = _require('quark/uitl').__runtime;
}
else if (isNode) {
	let nodeProcess = process;
	platform = nodeProcess.platform as any;
	process.execArgv = nodeProcess.execArgv || [];
	argv = process.argv || [];
	isWin32 = process.platform == 'win32';
	parse_options(argv.slice(1));
	class NodeProcess extends Notification implements IProcess {
		getNoticer(name: 'BeforeExit'|'Exit'|'UncaughtException'|'UnhandledRejection') {
			if (!this.hasNoticer(name)) {
				var noticer = super.getNoticer(name);
				nodeProcess.on(name.substring(0, 1).toLowerCase() + name.substring(1), function(...args: any[]) {
					return (_processHandles[name] as any)(noticer, ...args);
				});
			}
			return super.getNoticer(name);
		}
		exit(code?: number) {
			nodeProcess.exit(code || 0);
		}
	}
	_process = new NodeProcess();
}
else if (isWeb) {
	let USER_AGENT = navigator.userAgent;
	let mat = USER_AGENT.match(/\(i[^;]+?; (U; )?CPU.+?OS (\d).+?Mac OS X/);
	let ios = !!mat;
	webFlags = {
		windows: USER_AGENT.indexOf('Windows') > -1,
		windowsPhone: USER_AGENT.indexOf('Windows Phone') > -1,
		linux: USER_AGENT.indexOf('Linux') > -1,
		android: /Android|Adr/.test(USER_AGENT),
		macos: USER_AGENT.indexOf('Mac OS X') > -1,
		ios: ios,
		iphone: USER_AGENT.indexOf('iPhone') > -1,
		ipad: USER_AGENT.indexOf('iPad') > -1,
		ipod: USER_AGENT.indexOf('iPod') > -1,
		mobile: USER_AGENT.indexOf('Mobile') > -1 || 'ontouchstart' in globalThis,
		touch: 'ontouchstart' in globalThis,
		//--
		trident: !!USER_AGENT.match(/Trident|MSIE/),
		presto: !!USER_AGENT.match(/Presto|Opera/),
		webkit: 
			USER_AGENT.indexOf('AppleWebKit') > -1 || 
			!!globalThis.WebKitCSSMatrix,
		gecko:
			USER_AGENT.indexOf('Gecko') > -1 &&
			USER_AGENT.indexOf('KHTML') == -1, // || !!globalThis.MozCSSKeyframeRule
	};
	platform = 'web' as Platform;
	argv = [location.origin + location.pathname].concat(location.search.substring(1).split('&'));
	class WebProcess extends Notification implements IProcess {
		getNoticer(name: 'BeforeExit'|'Exit'|'UncaughtException'|'UnhandledRejection') {
			if (!this.hasNoticer(name)) {
				var noticer = super.getNoticer(name);
				if (name == 'UncaughtException') {
					globalThis.addEventListener('error', function(e) {
						var { message, error, filename, lineno, colno } = e;
						return _processHandles.UncaughtException(noticer, Error.new(error || message || 'unknown UncaughtException'));
					});
				} else if (name == 'UnhandledRejection') {
					globalThis.addEventListener('unhandledrejection', function(e) {
						var {reason,promise} = e;
						return _processHandles.UnhandledRejection(noticer, Error.new(reason || 'unknown UnhandledRejection'), promise);
					});
				}
			}
			return super.getNoticer(name);
		}
		exit(code?: number) {
			window.close();
		}
	}
	_process = new WebProcess();
} else {
	throw new Error('no support');
}

if (isNode) {
	var fs = _require('fs');
	let _keys = _require('./_keys').default;
	require('module').Module._extensions['.keys'] = 
		function(module: NodeModule, filename: string): any {
		var content = fs.readFileSync(filename, 'utf8');
		try {
			module.exports = _keys(stripBOM(content));
		} catch (err: any) {
			err.message = filename + ': ' + err.message;
			throw err;
		}
	};
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 * because the buffer-to-string conversion in `fs.readFileSync()`
 * translates it to FEFF, the UTF-16 BOM.
 */
export function stripBOM(content: string): string {
	if (content.charCodeAt(0) === 0xFEFF) {
		content = content.slice(1);
	}
	return content;
}

function requireWithoutErr(pathname: string) {
	try { return _require(pathname) } catch(e) {}
}

function readConfigFile(pathname: string, pathname2: string) {
	var c = requireWithoutErr(pathname);
	var c2 = requireWithoutErr(pathname2);
	if (c && c2) {
		return Object.assign(c2, Object.assign(c, c2));
	} else {
		return c2 || c;
	}
}

let configDir = '';

export function getConfig(): Dict {
	if (!config) {
		if (isQuark) {
			config = _quark_util.getConfig();
		} else if (isNode) {
			if (configDir) {
				config = readConfigFile(configDir + '/.config', configDir + '/config');
			} else {
				var mainModule = require.main;// process.mainModule || require.main;
				if (mainModule) {
					let mainDir = _require('path').dirname(mainModule.filename);
					config = readConfigFile(mainDir + '/.config', mainDir + '/config');
				}
			}

			const PREFIX = 'file:///';
			const _cwd = isWin32 ? function() {
				return PREFIX + process.cwd().replace(/\\/g, '/');
			}: function() {
				return PREFIX + process.cwd().substring(1);
			};

			config = config || readConfigFile(_cwd() + '/.config', _cwd() + '/config') || {};

			// rend extend config file
			if (config && config.extendConfigPath) {
				Object.assign(config, requireWithoutErr(config.extendConfigPath));
			}
		} else {
			config = {};
		}
	}
	return config as Dict;
}

export function setConfig(cfg: any) {
	if (typeof cfg == 'string') {
		configDir = cfg;
	} else {
		config = {...(cfg as any)};
	}
}

// ------------------------------------------------------

/**
* @method hash # gen hash value
* @arg input {Object} 
* @ret {String}
*/
function hash(data: any): string {
	var value = Object.hashCode(data);
	var retValue = '';
	do
		retValue += base64_chars[value & 0x3F];
	while ( value >>>= 6 );
	return retValue;
}

if (!globalThis.setImmediate) {
	(globalThis as any).setImmediate = function<A extends any[]>(cb: (...args: A) => void, ...args: A): any {
		return globalThis.setTimeout(function() {
			cb(...args);
		}, 1);
	};
	globalThis.clearImmediate = globalThis.clearTimeout;
}

const nextTick: <A extends any[], R>(cb: (...args: A) => R, ...args: A) => void = 
isNode ? process.nextTick: function(cb, ...args): void {
	if (typeof cb != 'function')
		throw new Error('callback must be a function');
	if (isQuark) {
		_quark_util.default.nextTick(()=>cb(...args));
	} else {
		setImmediate(()=>cb(...args));
	}
};

function sleep<T = number>(time: number, defaultValue?: T): Promise<T> {
	return new Promise((ok, err)=>setTimeout(()=>ok((defaultValue || 0) as any), time));
}

function unrealized(): any {
	throw new Error('Unrealized function');
}

export default {
	debug,
	version: unrealized,
	platform,
	isNode, isQuark,isWeb, webFlags,
	argv,
	options,
	unrealized,
	nextTick,
	exit: (code?: number)=>{ _process.exit(code) },
	sleep, gc,
	runScript: unrealized,
	hashCode: Object.hashCode,
	hash: hash,
}