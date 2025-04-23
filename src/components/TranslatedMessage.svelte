<script lang="ts">

  import { emoteMap } from '../ts/word-image-map';


  import { refreshScroll, translatorClient, translateTargetLanguage } from '../ts/storage';
  import Icon from './common/Icon.svelte';
  import { Theme } from '../ts/chat-constants';

  export let forceTLColor: Theme = Theme.YOUTUBE;

  export let text: string;
  let translatedMessage = '';
  let translatedLanguage = '';
  let showOriginal = false;

  $: if ($translateTargetLanguage && $translatorClient) {
    $translatorClient.translate(text, $translateTargetLanguage).then(result => {
      if (result !== text) {
        translatedLanguage = $translateTargetLanguage;
        translatedMessage = result;
        $refreshScroll = true;
      }
    });
  }

  $: showTL = Boolean(translatedMessage && !showOriginal && translatedMessage.trim() !== text.trim());

  $: if ($translateTargetLanguage !== translatedLanguage) {
    translatedMessage = '';
    translatedLanguage = '';
  }

  $: translatedColor = forceTLColor === Theme.DARK
    ? 'text-translated-dark'
    : `text-translated-light ${forceTLColor === Theme.YOUTUBE ? 'dark:text-translated-dark' : ''}`;

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

let emoteParts = replaceEmotes(text);
</script>

<span
  class={showTL ? translatedColor : ''}
  class:cursor-pointer={translatedMessage}
  class:entrance-animation={translatedMessage}
  on:click={() => {
    if (translatedMessage) {
      showOriginal = !showOriginal;
      $refreshScroll = true;
    }
  }}
>
  <span>
    {#each emoteParts as part}
    {#if part.type === 'text'}
      {@html part.content} <!-- Use {@html} if you want to preserve spacing like &nbsp; -->
    {:else if part.type === 'img'}
      <img src={part.src} alt={part.alt} style="height: 1em; display: inline;" />
    {/if}
  {/each}
  </span>

  {#if translatedMessage}
    <span class="shifted-icon">
      <Icon xs={true} block={false}>
        translate
      </Icon>
    </span>
  {/if}
</span>

<style>
  .shifted-icon  :global(.material-icons) {
    transform: translateY(1px);
  }
</style>
