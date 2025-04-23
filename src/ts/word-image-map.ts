export const emoteMap: Record<string, string> = {};

  

export function getEmoteMap() {
    return emoteMap;
  }
  
export function addEmotes(newEmotes: Record<string, string>) {
    Object.assign(emoteMap, newEmotes);
}