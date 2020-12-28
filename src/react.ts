
import React from "react";

import { useEffect, useRef } from "react";
import { Observable } from "rxjs";
import { BlurEvent, createTextEditor, EditEvent, FocusEvent, TextEditor } from "./index";

export interface TextEditorProps {
    editor?: TextEditor;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: BlurEvent) => void;
    onEdit?: (event: EditEvent) => void;
    style?: React.CSSProperties;
    className?: string;
}

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
    className,
    style
}: TextEditorProps) {

    const editorRef = useRef<TextEditor>();
    if (editor === undefined) {
        if (editorRef.current === undefined) {
            console.log('creating text editor');
            editorRef.current = createTextEditor();
        }
        editor = editorRef.current!;
    }

    useSubscription(editor.events.getObservable('blur'), onBlur, [ onBlur ]);
    useSubscription(editor.events.getObservable('edit'), onEdit, [ onBlur ]);
    useSubscription(editor.events.getObservable('focus'), onFocus, [ onBlur ]);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentElement = ref.current;
        if (currentElement !== null && currentElement.childNodes[0] !== editor!.domElement) {
            currentElement.appendChild(editor!.domElement);
            return () => {
                currentElement.removeChild(editor!.domElement);
            }
        }
    }, [ ref.current ]);

    return React.createElement('div', { ref, style, className });

}

