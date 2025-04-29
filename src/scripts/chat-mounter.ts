import Hyperchat from '../components/Hyperchat.svelte';
import tailwind from 'smelte/src/tailwind.css?inline';
import { isLiveTL } from '../ts/chat-constants';


import { addEmotes } from '../ts/word-image-map';
import { getEmotes } from '../ts/get-emotes'

import InputPanel from '../components/InputPanel.svelte';
import { emoteResponse } from '../ts/storage';



async function getInputBox<T extends Element>(
  iframeSelector: string,
  innerSelector: string,
  timeout = 10000,
  pollInterval = 200 // How often to check for the iframe in ms
): Promise<T> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const tryFind = () => {
      const iframe = window.top?.document.querySelector<HTMLIFrameElement>(iframeSelector);

      if (iframe && iframe.contentDocument) {
        const doc = iframe.contentDocument;
        const target = doc.querySelector<T>(innerSelector);
        
        if (target) {
          resolve(target); // Found the target inside the iframe
        } else if (Date.now() - startTime > timeout) {
          reject(new Error("Timeout waiting for element inside iframe"));
        } else {
          // Keep trying if we haven't found the target yet
          requestAnimationFrame(tryFind);
        }
      } else if (Date.now() - startTime > timeout) {
        reject(new Error("Timeout waiting for iframe"));
      } else {
        // Keep trying to find the iframe if it's not yet found
        setTimeout(tryFind, pollInterval); // Retry after a short delay
      }
    };

    tryFind();
  });
}



async function replaceInputBox(){

  //Hook into input box

  console.log("Before")
  const inputSelector = "#panel-pages"
  const iframeSelector = "iframe#chatframe"

  try {
    const inputParent = await getInputBox<HTMLDivElement>(iframeSelector, inputSelector);
    console.log('✅ Found input element:', inputParent);
    try{
      const inputPanel = inputParent.querySelector("#input-panel")
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newInputPanel = new InputPanel({
        target: inputParent,
        props: {
          ytInputParent: inputParent,
          ytInputPanel: inputPanel,
        }
      });
      newInputPanel.activate();
    } catch (err){
      console.error("Other error: ", err);
    }

  } catch (err) {
    console.error('❌ Failed to find chat input:', err);
  }
  console.log("After")
}

async function fetchEmotes(){
  console.log("fetchEmotes");
  //Get emotes
  let emotes = await getEmotes();
  addEmotes(emotes);

  emoteResponse.set(true);

}


const mount = (): void => {
  console.log('[HyperChat] mounted hyperchat as content script');

  document.querySelector('#player')?.remove();

  document.documentElement.style.cssText = 'background-color: transparent !important;';
  document.body.style.cssText = 'background-color: transparent !important;';

  const font = document.createElement('link');
  font.href = (
    'https://fonts.googleapis.com/css' +
    '?family=Roboto:100,300,400,500,700,900' +
    '|Material+Icons&display=swap'
  );
  font.rel = 'stylesheet';
  document.head.appendChild(font);

  const style = document.createElement('style');
  style.innerHTML = tailwind;
  document.head.appendChild(style);

  console.log(new Hyperchat({
    target: document.body
  }));
  setTimeout(() => {
    document.querySelector('yt-live-chat-app')?.remove();
  }, 1);
};

if (isLiveTL) {
  fetchEmotes();
  replaceInputBox();
  mount();
}
else {
  setTimeout(() => {
    if (document.querySelector('.hyperchat-root') === null) {
      fetchEmotes();
      replaceInputBox();
      mount();
    }
  }, 500);
}
