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

// ======================== IMPL ========================

var _ex: any;

declare var __webpack_exports__: any;

if (typeof __binding__ == 'function') { // quark
	_ex = Object.assign(exports, __binding__('_event'));
} else if (typeof __webpack_exports__ == 'object') {
	_ex = Object.assign(__webpack_exports__, require('./_event'));
} else {
	_ex = Object.assign(exports, require('./_event'));
}

import * as _event from './_event';

export type event = typeof _event.event;
export const event = _ex.event as typeof _event.event;
export default (_ex.event as typeof event);

export type ListIterator<T> = _event.ListIterator<T>;
export type List<T = any> = _event.List<T>;
export const List = _ex.List as typeof _event.List;
export type Event<Sender = any, SendData = any> = _event.Event<Sender, SendData>;
export const Event = _ex.Event as typeof _event.Event;

export type Listen<E = Event, Ctx extends object = object> = _event.Listen<E, Ctx>;
export type Listen2<E = Event, Ctx extends object = object> = _event.Listen2<E, Ctx>;

export type SenderOf<T> = _event.SenderOf<T>;
export type DataOf<T> = _event.DataOf<T>;

export type EventNoticer<E extends Event = Event> = _event.EventNoticer<E>;
export const EventNoticer = _ex.EventNoticer as typeof _event.EventNoticer;

export type Notification<E extends Event = Event> = _event.Notification<E>;
export const Notification = _ex.Notification as typeof _event.Notification;
