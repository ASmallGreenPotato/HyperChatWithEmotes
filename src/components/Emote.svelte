<script lang="ts">
    export let src: string;;
    export let alt: string;
    let emoteDiv: HTMLDivElement;
    export function getEmoteDiv() {
        return emoteDiv;
    }
</script>


<div class="emote-container" bind:this={emoteDiv}>
    <img src={src} alt={alt} class="emote"/>
    <span class="emote-text" contenteditable="false">{alt}</span>
</div>

  
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