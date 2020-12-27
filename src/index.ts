
import {Subject} from "rxjs";
import { EventDispatcher, SubjectBasedEventDispatcher } from "./events";

export type TextEditDelta
    = InsertTextEdit
    | DeleteTextEdit
    | ReplaceTextEdit

export interface EditEvent {
    type: 'edit';
    editor: TextEditor;
    delta: TextEditDelta;
}

export interface BlurEvent {
    type: 'blur';
    editor: TextEditor;
}

export interface FocusEvent {
    type: 'focus';
    editor: TextEditor;
}

interface TextEditorEvents {
    blur: BlurEvent;
    focus: FocusEvent;
    edit: EditEvent;
}

export interface TextEditor {
    readonly domElement: HTMLElement;
    setReadOnly(): void;
    setWritable(): void;
    events: EventDispatcher<TextEditorEvents>;
}

export interface CreateTextEditorOptions {
    readOnly?: boolean;
    contents?: string;
    placeholder?: Node | null;
}

export function createTextEditor({
    readOnly = false,
    contents = '',
    placeholder = document.createTextNode('Start writing something ...'),
}: CreateTextEditorOptions = {}): TextEditor {

    const editor = {} as TextEditor;

    let isEmpty = contents.length === 0;

    const focusEvents = new Subject<FocusEvent>();
    const blurEvents = new Subject<BlurEvent>();
    const editEvents = new Subject<EditEvent>();

    function dispatchFocusEvent(event: FocusEvent) {
        focusEvents.next(event);
    }

    function dispatchBlurEvent(event: BlurEvent) {
        blurEvents.next(event);
    }

    function dispatchEditEvent(event: EditEvent) {
        editEvents.next(event);
    }

    const contentElement = document.createElement('div');
    const observer = new MutationObserver(() => {
        isEmpty = contentElement.innerHTML.length === 0;
        dispatchEditEvent({
            type: 'edit',
            editor,
            delta: null,
        });
    });

    const events = new SubjectBasedEventDispatcher<TextEditorEvents>({
        blur: blurEvents,
        edit: editEvents,
        focus: focusEvents,
    });

    function setReadOnly() {
        contentElement.contentEditable = 'false';
        readOnly = true;
    }

    function setWritable() {
        contentElement.contentEditable = 'true';
        readOnly = false;
    }

    contentElement.onfocus = () => {

        if (isEmpty && placeholder !== null) {
            contentElement.removeChild(placeholder);
        }

        dispatchFocusEvent({
            type: 'focus',
            editor,
        });

        observer.observe(contentElement, {
            childList: true,
            attributes: true,
            subtree: true,
        });

    }

    contentElement.onblur = () => {

        observer.disconnect();

        if (isEmpty && placeholder !== null) {
            contentElement.appendChild(placeholder);
        }

        dispatchBlurEvent({
            type: 'blur',
            editor,
        });

    }

    if (!readOnly) {
        setWritable();
    }

    if (isEmpty && placeholder !== null) {
        contentElement.appendChild(placeholder);
    }

    editor.events = events;
    editor.setReadOnly = setReadOnly;
    editor.setWritable = setWritable;
    editor.domElement = contentElement;

    return editor;

}

export default createTextEditor;

