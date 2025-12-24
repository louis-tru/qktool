/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2015, Louis.chu
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Louis.chu nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL Louis.chu BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * ***** END LICENSE BLOCK ***** */

import util from './util';
import url from './uri';
import {DelayCall} from './delay_call';

const { isNode, isQuark, isWeb } = util;

if (isWeb) {
	// use localStorage as storage
	var get_key = function(self: Storage, key: string) {
		return (<any>self).m_prefix + key
	};

	var has = function(self: Storage, key: string): boolean {
		key = get_key(self, key);
		return key in (<any>self).m_value;
	};

	var get_val = function(self: Storage, key: string): any {
		key = get_key(self, key);
		var rv = (<any>self).m_value[key];
		if (rv) {
			return JSON.parse(rv);
		}
	};

	var set_val = function(self: Storage, key: string, val: any): any {
		try {
			key = get_key(self, key);
			(<any>self).m_value[key] = JSON.stringify(val);
		} catch(e) {
			console.warn('qktool.storage.web.set_val', e);
		}
	};

	var del_val = function(self: Storage, key: string): any {
		key = get_key(self, key);
		delete (<any>self).m_value[key];
	};

	var clear = function(self: Storage): any {
		var keys: any[] = [];
		var prefix = (<any>self).m_prefix;
		for (var i in (<any>self).m_value) {
			if (i.substring(0, prefix.length) == prefix) {
				keys.push(i);
			}
		}
		for (var key of keys) {
			delete (<any>self).m_value[key];
			// localStorage.removeItem(key);
		}
	}

} else if (isQuark) {
	// use quark storage
	const _storage = __binding__('_storage');

	var get_val = function(self: Storage, key: string): any {
		var rv = _storage.get(key);
		if ( rv ) {
			return JSON.parse(rv);
		}
	};
	var set_val = function(self: Storage, key: string, val: any): any {
		_storage.set(key, JSON.stringify(val));
	};
	var del_val = function(self: Storage, key: string): any {
		_storage.remove(key);
	};
	var clear = function(self: Storage): any {
		_storage.clear();
	};
} else if (isNode) {
	// use fs as storage
	var fs = require('fs');

	var sync_local = function(self: Storage) {
		if ((<any>self).m_change) {
			fs.writeFileSync((<any>self).m_path, JSON.stringify((<any>self).m_value, null, 2));
			(<any>self).m_change = false;
		}
	};

	var commit = function(self: Storage) {
		(<any>self).m_change = true;
		(<any>self).m_sync.call();
	};

	var get_val = function(self: Storage, key: string): any {
		return (<any>self).m_value[key];
	};

	var set_val = function(self: Storage,  key: string, val: any): any {
		(<any>self).m_value[key] = val;
		commit(self);
	};

	var del_val = function(self: Storage, key: string): any {
		delete (<any>self).m_value[key];
		commit(self);
	};

	var clear = function(self: Storage): any {
		(<any>self).m_value = {};
		commit(self);
	};
}

var shared: IStorageSync | null = null;

export interface IStorage {
	get<T = any>(key: string, defaultValue?: T): Promise<T>;
	has(key: string): Promise<boolean>;
	set(key: string, value: any): Promise<void>;
	delete(key: string): Promise<void>;
	clear(): Promise<void>;
}

export interface IStorageSync extends IStorage {
	getSync<T = any>(key: string, defaultValue?: T): T;
	hasSync(key: string): boolean;
	setSync(key: string, value: any): void;
	deleteSync(key: string): void;
	clearSync(): void;
}

export class Storage implements IStorageSync {
	private m_path: string;
	private m_prefix: string = '';
	private m_value: Dict = {};
	private m_change: boolean = false;
	private m_sync: any;

	constructor(path?: string) {
		this.m_path = url.classicPath(path?path:(isWeb ? location.origin: url.cwd()) + '/' + '.storage');
		this.m_value = {};
		this.m_sync = new DelayCall(e=>sync_local(this), 100); // 100ms后保存到文件

		if (isWeb) {
			this.m_prefix = util.hash(this.m_path || 'default') + '_';
			this.m_value = localStorage;
		} else {
			if (fs.existsSync(this.m_path)) {
				try {
					this.m_value = JSON.parse(fs.readFileSync(this.m_path, 'utf-8')) || {};
				} catch(e) {}
			}
		}
	}

	async get<T = any>(key: string, defaultValue?: T) { return this.getSync(key, defaultValue) }
	async has(key: string) { return this.hasSync(key) }
	async set(key: string, value: any) { this.setSync(key, value) }
	async delete(key: string) { this.deleteSync(key) }
	async clear() { this.clearSync() }

	getSync(key: string, defaultValue?: any) {
		var val = get_val(this, key);
		if (val !== undefined) {
			return val;
		} else if (defaultValue !== undefined) {
			set_val(this, key, defaultValue);
			return defaultValue;
		}
	}

	hasSync(key: string) {
		return has(this, key);
	}

	setSync(key: string, value: any) {
		set_val(this, key, value);
	}

	deleteSync(key: string) {
		key = del_val(this, key);
	}

	clearSync() {
		clear(this);
	}
}

function _shared(): IStorageSync {
	if (!shared) {
		shared = new Storage();
	}
	return shared;
}

export default {

	get shared() {
		return _shared();
	},

	setShared: function(value: IStorageSync) {
		shared = value;
	},

	get: function(key: string, defaultValue?: any) {
		return _shared().getSync(key, defaultValue);
	},

	has: function(key: string) {
		return _shared().hasSync(key);
	},

	set: function(key: string, value: any) {
		return _shared().setSync(key, value);
	},

	delete: function(key: string) {
		return _shared().deleteSync(key);
	},

	clear: function() {
		return _shared().clearSync();
	},

};
