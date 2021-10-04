import { QuillModules } from 'ngx-quill/lib/quill-editor.interfaces';
import { SafeHtml } from '@angular/platform-browser';

export interface QuillMentionData {
  id: number;
  value: string;
  link?: string;
}

export interface QuillMentionOptions {
  selectKeys?: number[];
  renderLoading?: () => SafeHtml | null;
  positioningStrategy?: 'absolute' | 'fixed' | 'normal';
  spaceAfterInsert?: boolean;
  mentionListClass?: string;
  mentionContainerClass?: string;
  listItemClass?: string;
  linkTarget?: string;
  dataAttributes?: string[];
  blotName?: 'mention' | string;
  defaultMenuOrientation?: 'bottom' | 'top';
  showDenotationChar?: boolean;
  fixMentionsToQuill?: boolean;
  isolateCharacter?: boolean;
  mentionDenotationChars?: string[];
  offsetLeft?: number;
  offsetTop?: number;
  maxChars?: number;
  minChars?: number;
  allowedChars?: RegExp | (() => RegExp);
  source?(
    searchTerm: string,
    renderList: (matches: QuillMentionData[], searchTerm: string) => Promise<void> | void,
    mentionChat: string
  ): void;
  renderItem?(item: QuillMentionData, searchTerm: string): string;
  onOpen?(): void;
  onClose?(): void;
  onSelect?(item: DOMStringMap, insertItem: (item: DOMStringMap) => Promise<void> | void): void;
}

export function getQuillDefaultModules(): QuillModules {
  return {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'video'],
      ],
    },
  };
}
