<script lang="ts">


import { emoteMap } from '../ts/word-image-map';


export let text;

type EmotePiece = { type: 'text', content: string } | { type: 'img', src: string, alt: string };

function replaceEmotes(text: string): EmotePiece[] {
  const words = text.split(/(\s+)/); // keep spaces

  return words.map((word) => {
    const emoteUrl = emoteMap[word];
    if (emoteUrl) {
      return { type: 'img', src: emoteUrl, alt: word };
    }
    return { type: 'text', content: word };
  });
}

console.log(emoteMap);

let emoteParts = replaceEmotes(text);
</script>

<span>
    {#each emoteParts as part}
    {#if part.type === 'text'}
        {@html part.content} <!-- Use {@html} if you want to preserve spacing like &nbsp; -->
    {:else if part.type === 'img'}
        <div class="emote-container">
            <img src={part.src} alt={part.alt} class="emote" />
            <span class="emote-text">{part.alt}</span>
        </div>
    {/if}
    {/each}
</span>

<style>
.emote{
    height: 2em;
    display: inline;
}
.emote-container{
    height: 2em;
    display: inline;
    position: relative;
}
.emote-container:hover .emote-text {
    visibility: visible;
    opacity: 1;
}
.emote-text {
    visibility: hidden;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 4px 8px;
    position: absolute;
    z-index: 10;
    bottom: 125%; /* show above the image */
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
}
</style>