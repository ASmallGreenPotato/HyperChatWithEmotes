export const emoteMap: Record<string, string> = {
    'lol': 'https://cdn.7tv.app/emote/01HG6WH3X8000C4YPN80CPEJFS/4x.avif',
    'Ok': 'https://cdn.7tv.app/emote/01HDXH46PG000DR138X30ZPN7N/4x.avif'
  };

  

export function getEmoteMap() {
    return emoteMap;
  }
  
export function addEmotes(newEmotes: Record<string, string>) {
    Object.assign(emoteMap, newEmotes);
}