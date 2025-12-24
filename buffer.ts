/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright © 2015-2016, Louis.chu
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

import type * as all from './_buffer_impl';

// ======================== IMPL ========================
declare var __webpack_exports__: any;
var _ex = typeof __webpack_exports__ == 'object' ? __webpack_exports__ : exports;
Object.assign(_ex, typeof __binding__ == 'function' ? require('quark/buffer') : require('./_buffer_impl'));

export type Encoding = all.Encoding;
export type Bytes = all.Bytes;
export declare type Buffer = all.Buffer;
export declare const Buffer: typeof all.Buffer;
export declare const Zero: typeof all.Zero;
export declare const alloc: typeof all.alloc;
export declare const allocUnsafe: typeof all.allocUnsafe;
export declare const isTypedArray: typeof all.isTypedArray;
export declare const isUint8Array: typeof all.isUint8Array;
export declare const isBuffer: typeof all.isBuffer;
export declare const compare: typeof all.compare;
export declare const encodeUTF8Length: typeof all.encodeUTF8Length;
export declare const toString: typeof all.toString;
export declare const fromString: typeof all.fromString;
export declare const from: typeof all.from;
export declare const byteLength: typeof all.byteLength;
export declare const concat: typeof all.concat;
export default _ex.default as typeof all.default;