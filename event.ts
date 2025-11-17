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

export interface ListIterator<T> {
	readonly prev: ListIterator<T>;
	readonly next: ListIterator<T>;
	readonly host: List<T> | null;
	value: T;
}
export declare class List<T = any> {
	private _length;
	private _end;
	get begin(): ListIterator<T>;
	get end(): ListIterator<T>;
	get length(): number;
	get front(): T | undefined;
	get back(): T | undefined;
	constructor();
	toArray(): T[];
	remove(it: ListIterator<T>): ListIterator<T>;
	erase(begin: ListIterator<T>, end: ListIterator<T>): void;
	insert(after: ListIterator<T>, value: T): ListIterator<T>;
	splice(it: ListIterator<T>, from_begin: ListIterator<T>, from_end: ListIterator<T>): void;
	spliceAll(it: ListIterator<T>, from: List<T>): void;
	pushBack(value: T): ListIterator<T>;
	pushFront(value: T): ListIterator<T>;
	popBack(): void;
	popFront(): void;
	clear(): void;
}
/**
 * @class Event The event data
*/
export declare class Event<Sender = any, SendData = any> {
	private _sender;
	private _data;
	/** The return value */
	returnValue: Uint;
	/** The Data */
	get data(): SendData;
	/** The sender */
	get sender(): Sender;
	/** */
	constructor(data: SendData);
}
/**
 * @template E,Ctx
 * @callback Listen(this:Ctx,evt:E)any
*/
export interface Listen<E = Event, Ctx extends object = object> {
	(this: Ctx, evt: E): any;
}
/**
 * @template E,Ctx
 * @callback Listen2(self:Ctx,evt:E)any
*/
export interface Listen2<E = Event, Ctx extends object = object> {
	(self: Ctx, evt: E): any;
}
export type DataOf<T> = T extends Event<any, infer D> ? D : never;
export type SenderOf<T> = T extends Event<infer S, any> ? S : never;
/**
 * @class EventNoticer
 *
 * Event notifier, the core of event listener adding, deleting, triggering and notification
*/
export declare class EventNoticer<E extends Event = Event> {
	private _name;
	private _sender;
	private _listens?;
	private _listens_map?;
	private _length;
	private _add;
	/** Event name */
	get name(): string;
	/**
	 * @get sender:any Event sender
	 */
	get sender(): SenderOf<E>;
	/**
	 * @get length Number of event listeners
	 */
	get length(): Uint;
	/**
	 * @param name   Event name
	 * @param sender Event sender
	 */
	constructor(name: string, sender: SenderOf<E>);
	/**
	 * Add an event listener (function)
	 * @param  listen    Listening Function
	 * @param  ctxOrId?  Specify the listener function this or id alias
	 * @param  id?       Listener alias, can be deleted by id
	 * @return Returns the passed `id` or the automatically generated `id`
	 * @example
	 *	```ts
	 *	var ctx = { a:100 }
	 *	var id = screen.onChange.on(function(ev) {
	 *	// Prints: 100
	 *		console.log(this.a)
	 *	}, ctx)
	 *	// Replace Listener
	 *	screen.onChange.on(function(ev) {
	 *	// Prints: replace 100
	 *		console.log('replace', this.a)
	 *	}, ctx, id)
	 *	```
	 */
	on<Ctx extends object>(listen: Listen<E, Ctx>, ctxOrId?: Ctx | string, id?: string): string;
	/**
	 * Add an event listener (function),
	 * and "on" the same processor of the method to add the event trigger to receive two parameters
	 * @param  listen    Listening Function
	 * @param  ctxOrId?  Specify the listener function this or id alias
	 * @param  id?       Listener alias, can be deleted by id
	 * @return Returns the passed `id` or the automatically generated `id`
	 *
	 *
	 * Example:
	 *
	 * ```js
	 * var ctx = { a:100 }
	 * var id = display_port.onChange.on2(function(ctx, ev) {
	 * 	// Prints: 100
	 * 	console.log(ctx.a)
	 * }, ctx)
	 * ```
	 */
	on2<Ctx extends object>(listen: Listen2<E, Ctx>, ctxOrId?: Ctx | string, id?: string): string;
	/** Forward the event to another noticer */
	forward(noticer: EventNoticer<E>, id?: string): string;
	/**
	 * Set the lifespan of the listener function with the specified `id`
	 * @param id Listener id
	 * @param lifespan Lifespan, the number of times the listener is valid, default is 1
	 */
	setLifespan(id: string, lifespan?: Uint): void;
	/**
	 * Notify all observers
	 */
	trigger(data: DataOf<E>): void;
	/**
	 * Notify all observers
	 */
	triggerWithEvent(e: E): void;
	/**
	 * Remove listener function
	 * @param listen?
	 * 	It can be a listener function/id alias.
	 * 	If no parameter is passed, all listeners will be uninstalled.
	 * @param ctx? Context object, only valid when `listen` is a function
	 * @return {Uint} Returns the number of deleted listeners
	 */
	off(listen?: Function | string, ctx?: object): Uint;
	/**
	 * Remove all listeners related to `ctx` on this noticer
	*/
	offByCtx(ctx: object): Uint;
}
/**
 * @class Notification
 *
 * This is a collection of events `EventNoticer`, event triggering and response center
 *
 * Derived types inherited from it can use the `@event` keyword to declare member events
 *
 */
export declare class Notification<E extends Event = Event> {
	/**
	 * @method getNoticer(name)
	 */
	getNoticer(name: string): EventNoticer<E>;
	/**
	 * @method hasNoticer(name)bool
	 */
	hasNoticer(name: string): boolean;
	/**
	 * @method addDefaultListener(name,listen)
	 */
	addDefaultListener(name: string, listen: Listen<E> | null): void;
	/**
	 * call: [`EventNoticer.on(listen,ctxOrId?,id?)`]
	 */
	addEventListener<Ctx extends object>(name: string, listen: Listen<E, Ctx>, ctxOrId?: Ctx | string, id?: string): string;
	/**
	 * call: [`EventNoticer.on2(listen,ctxOrId?,id?)`]
	 */
	addEventListener2<Ctx extends object>(name: string, listen: Listen2<E, Ctx>, ctxOrId?: Ctx | string, id?: string): string;
	/**
	 * call: [`EventNoticer.forward(noticer,id?)`]
	*/
	addEventForward(name: string, noticer: EventNoticer<E>, id?: string): string;
	/**
	 * call: [`EventNoticer.setLifespan(id,lifespan)`]
	 */
	setEventListenerLifespan(name: string, id: string, lifespan?: Uint): void;
	/**
	* Trigger an event by event name --> [`EventNoticer.trigger(data)`]
	*/
	trigger(name: string, data: DataOf<E>): void;
	/**
	* Trigger an event by name and [`Event`] --> [`EventNoticer.triggerWithEvent(event)`]
	*/
	triggerWithEvent(name: string, event: E): void;
	/**
	 * Remove listener function
	 * @param name      Event name
	 * @param listen?   It can be a listener function/id alias.
	 *                   If no parameter is passed, all listeners will be uninstalled.
	 * @param ctx?      Context object, only valid when `listen` is a function
	*/
	removeEventListener(name: string, listen?: Function | string, ctx?: object): void;
	/**
	 * Delete all listeners related to `ctx` on `notification`
	 *
	 * Actually traverse and call the [`EventNoticer.offByCtx(ctx)`] method
	 *
	 * @example
	 *
	 * ```ts
	 * import event from 'quark/event';
	 *
	 * class TestNotification extends Notification {
	 * 	\@event readonly onChange;
	 * }
	 *
	 * var notification = new TestNotification();
	 * // Prints: responseonChange 0 100
	 * notification.onChange = function(ev) { // add default listener
	 * 	console.log('responseonChange 0', ev.data)
	 * }
	 * notification.triggerChange(100);
	 *
	 * // Prints:
	 * // responseonChange 0 200
	 * // responseonChange 1
	 * notification.onChange.on(function(ev) {
	 * 	console.log('responseonChange 1')
	 * })
	 * notification.triggerWithEvent('change', new Event(200));
	 *
	 * var noticer = notification.onChange;
	 * noticer.off(0) // delete default listener
	 * // Prints: responseonChange 1
	 * notification.triggerChange();
	 *
	 * ```
	 */
	removeEventListenerByCtx(ctx: object): void;
	/**
	 * Get all of [`EventNoticer`]
	 */
	allNoticers(): EventNoticer<E>[];
	/**
	*/
	triggerListenerChange(name: string, count: Uint, change: Uint): void;
}
/**
 * Typescript decorator
 * @decorator
*/
export declare function event(target: any, name: string): void;

export { };

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

export default (_ex.event as (target: any, name: string) => void);