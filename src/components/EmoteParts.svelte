<script lang="ts">


    import { emoteMap } from '../ts/word-image-map';
    import type { Chat } from '../ts/typings/chat';
    import Emote from './Emote.svelte';
    import { emoteResponse } from '../ts/storage';
    
    
    export let text: string;
    
    
    
    function replaceEmotes(text: string): EmoteMessagePart[] {
      const words = text.split(/(\s+)/); // keep spaces
    
      return words.map((word) => {
        const emoteUrl = emoteMap[word];
        if (emoteUrl) {
          return { type: 'emote', src: emoteUrl, alt: word };
        }
        return { type: 'text', content: word };
      });
    }
    
    
    let emoteParts = replaceEmotes(text);

    $: if ($emoteResponse) {
        emoteParts = replaceEmotes(text);
    }
</script>
    
<span>
    {#each emoteParts as part}
        {#if part.type === 'text'}
            {@html part.content} <!-- Use {@html} if you want to preserve spacing like &nbsp; -->
        {:else if part.type === 'emote'}
            <Emote src={part.src} alt={part.alt}/>
        {/if}
    {/each}
</span>