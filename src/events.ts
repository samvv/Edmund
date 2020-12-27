
import { Observable, Subject, Subscription } from "rxjs";

export interface EventList {
    [key: string]: any;
}

export type EventNames<L extends EventList> = keyof L;

export type ValueTypeOfEvent<L extends EventList, K extends keyof L> = L[K];

export interface EventDispatcher<L extends EventList> {
    addEventListener<K extends EventNames<L>>(name: K, callback: (value: ValueTypeOfEvent<L, K>) => void): Subscription;
    getObservable<K extends EventNames<L>>(name: K): Observable<ValueTypeOfEvent<L, K>>;
}

export class SubjectBasedEventDispatcher<L extends EventList> {

    private subjects: { [K in keyof L]: Subject<L[K]> } = Object.create(null);

    constructor(eventNames: EventNames<L>[]) {
        for (const eventName of eventNames) {
            this.subjects[eventName] = new Subject();
        }
    }

    public addEventListener<K extends EventNames<L>>(
        name: K,
        callback: (value: ValueTypeOfEvent<L, K>) => void
    ): Subscription {
        return this.subjects[name].subscribe(callback)
    }

    public getObservable<K extends EventNames<L>>(name: K):
            Observable<ValueTypeOfEvent<L, K>> {
        return this.subjects[name];
    }
}

