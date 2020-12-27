
import {Subject} from "rxjs";
import { EventDispatcher, SubjectBasedEventDispatcher } from "./events";

export type TextEditDelta
    = InsertTextEdit
    | DeleteTextEdit
    | ReplaceTextEdit

export interface EditEvent {
    type: 'edit';
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

    let isEmpty = contents.length === 0;

    const contentElement = document.createElement('div');
    const observer = new MutationObserver(() => {
        isEmpty = contentElement.innerHTML.length === 0;
    });

    const events = new SubjectBasedEventDispatcher<TextEditorEvents>([
        'blur',
        'edit',
        'focus',
    ]);

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

    }

    if (!readOnly) {
        setWritable();
    }

    if (isEmpty && placeholder !== null) {
        contentElement.appendChild(placeholder);
    }

    return {
        events,
        setReadOnly,
        setWritable,
        domElement: contentElement,
    }

}

export default createTextEditor;

