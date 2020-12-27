
import { useEffect, useRef } from "react";
import { Observable } from "rxjs";
import { BlurEvent, createTextEditor, EditEvent, FocusEvent, TextEditDelta, TextEditor } from "./index";

export interface TextEditorProps {
    editor?: TextEditor;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: BlurEvent) => void;
    onEdit?: (event: EditEvent) => void;
}

//function useObservable<T>(observable: Observable<T>, callback: (value: T) => void | undefined) {
//    const prevSubscriptionRef = useRef<Observable<T>>();
//    useEffect(() => {
//        if (prevSubscriptionRef.current !== undefined) {
//            prevSubscriptionRef.unsubscribe();
//            prevSubscriptionRef.current = undefined;
//        }
//        if (callback !== undefined) {
//            const subscription = observable.subscribe(callback);
//            prevSubscriptionRef.current = subscription;
//            return () => {
//                subscription.cancel();
//                prevSubscriptionRef.current = undefined;
//            }
//        }
//    }, [ observable, callback ]);
//}


function useSubscription<T>(
    observable: Observable<T>,
    callback: ((value: T) => void) | undefined,
    deps: any[] = []
) {
    useEffect(() => {
        if (callback !== undefined) {
            const subscription = observable.subscribe(callback);
            return () => { subscription.unsubscribe(); }
        }
    }, [ observable, ...deps ]);
}

export default function TextEditorComponent({
    editor,
    onFocus,
    onBlur,
    onEdit,
}: TextEditorProps) {

    const editorRef = useRef<TextEditor>();
    if (editor === undefined) {
        if (editorRef.current === undefined) {
            editorRef.current = createTextEditor();
        }
        editor = editorRef.current!;
    }

    useSubscription(editor.events.getObservable('blur'), onBlur, [ onBlur ]);
    useSubscription(editor.events.getObservable('edit'), onEdit, [ onBlur ]);
    useSubscription(editor.events.getObservable('focus'), onFocus, [ onBlur ]);

}

