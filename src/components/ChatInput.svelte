<script lang="ts">


    import { emoteMap } from '../ts/word-image-map';
    import type { EmoteMessagePart, TextPart, EmotePart } from '../ts/typings/custom';
    import Emote from './Emote.svelte';
    import { onMount } from 'svelte';
    let editableDiv: HTMLDivElement;

    let iframe = window.top?.document.querySelector<HTMLIFrameElement>("iframe#chatframe");

    function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function handleKeyUp(event: KeyboardEvent) {
        console.log('KeyUp:', event.key);

        if (event.key !== ' ') return; // Only run when spacebar is hit

        const selection = iframe?.contentWindow?.getSelection();
        if (!selection || selection.rangeCount === 0) {
        console.log('No selection available');
        return;
        }

        const range = selection.getRangeAt(0);
        console.log('Range:', range);

        const { container, offset } = getTextNodeAndOffset(editableDiv);
        if (!container) {
        console.log('No text node container found');
        return;
        }

        const text = container.textContent ?? '';
        console.log('Container text:', text);
        console.log('Caret offset:', offset);

        const textBeforeCaret = text.slice(0, offset);
        console.log('Text before caret:', `"${textBeforeCaret}"`);

        const words = textBeforeCaret.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        console.log('Last word detected:', `"${lastWord}"`);

        if (emoteMap[lastWord]) {
        console.log('Emote found for word:', lastWord);
        replaceWordWithEmote(container, lastWord, emoteMap[lastWord], offset);
        } else {
        console.log('No emote match');
        }
    }

    function getTextNodeAndOffset(root: Node) {
        const selection = iframe?.contentWindow?.getSelection();
        if (!selection || selection.rangeCount === 0) return { container: null, offset: 0 };
        const range = selection.getRangeAt(0);
        return { container: range.startContainer, offset: range.startOffset };
    }

    function replaceWordWithEmote(textNode: Node, trigger: string, imgUrl: string, caretOffset: number) {
        const text = textNode.textContent ?? '';
        console.log('Replacing word:', trigger, 'in text:', `"${text}"`);

        const index = text.lastIndexOf(trigger, caretOffset - 1);
        if (index === -1) {
            console.log('Trigger not found in text');
            return;
        }

        const before = text.slice(0, index);
        const after = text.slice(index + trigger.length);

        console.log('Before:', `"${before}"`);
        console.log('After:', `"${after}"`);

        const newTextBefore = document.createTextNode(before + ' ');
        const newTextAfter = document.createTextNode(after);

        const parent = textNode.parentNode;
        if (!parent) {
            console.log('No parent found for text node');
            return;
        }

        // Create Emote component dynamically
        const emoteComponent = new Emote({
            target: parent,
            props: {
            src: imgUrl,
            alt: trigger
            },
            intro: false
        });

        const emoteDiv = emoteComponent.getEmoteDiv();
        if (!emoteDiv) {
            console.log('Emote div not found');
            return;
        }

        // Insert the new elements into the DOM
        parent.insertBefore(newTextBefore, textNode);
        parent.insertBefore(emoteDiv, textNode);
        parent.insertBefore(newTextAfter, textNode);
        parent.removeChild(textNode);

        console.log('Inserted emote and replaced text.');

        // Move the caret to after the emote and the space
        const selection = iframe?.contentWindow?.getSelection();
        if (selection) {
            const range = document.createRange();

            // Insert an explicit space node if needed
            const spaceNode = document.createTextNode(' ');
            parent.insertBefore(spaceNode, newTextAfter);

            // Place caret after the space
            range.setStart(spaceNode, 1); // After the space
            range.collapse(true);

            selection.removeAllRanges();
            selection.addRange(range);
            console.log('Caret moved after emote and space.');
        }
    }


</script>

<div bind:this={editableDiv} on:keyup={handleKeyUp} contenteditable="true" class="editor" spellcheck="false"></div>

<style>
    .editor {
        border: 1px solid #ccc;
        padding: 8px;
        min-height: 2em;
        line-height: 2em;
        font-size: 1em;
    }
</style>
