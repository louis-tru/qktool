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

import type * as all from './_event';

// ======================== IMPL ========================
declare var __webpack_exports__: any;
var _ex = typeof __webpack_exports__ == 'object' ? __webpack_exports__ : exports;
Object.assign(_ex, typeof __binding__ == 'function' ? __binding__('_event') : require('./_event'));

export type event = typeof all.event;
export const event = _ex.event as typeof all.event;
export default event;

export type ListIterator<T> = all.ListIterator<T>;
export type List<T = any> = all.List<T>;
export const List = _ex.List as typeof all.List;
export type Event<Sender = any, SendData = any> = all.Event<Sender, SendData>;
export const Event = _ex.Event as typeof all.Event;

export type Listen<E = Event, Ctx extends object = object> = all.Listen<E, Ctx>;
export type Listen2<E = Event, Ctx extends object = object> = all.Listen2<E, Ctx>;

export type SenderOf<T> = all.SenderOf<T>;
export type DataOf<T> = all.DataOf<T>;

export type EventNoticer<E extends Event = Event> = all.EventNoticer<E>;
export const EventNoticer = _ex.EventNoticer as typeof all.EventNoticer;

export type Notification<E extends Event = Event> = all.Notification<E>;
export const Notification = _ex.Notification as typeof all.Notification;
