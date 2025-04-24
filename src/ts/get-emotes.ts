type EmoteMap = Record<string, string>;

export async function get7TVEmotes(): Promise<EmoteMap> {
  try {
    const res = await fetch('https://7tv.io/v3/emote-sets/global');
    const data = await res.json();
    const emoteMap: EmoteMap = {};

    data.emotes.forEach((emote: any) => {
      const base = emote.data.host.url;
      const file = emote.data.host.files.find((f: any) => f.name.includes('3x'));
      if (file) {
        emoteMap[emote.name] = `https:${base}/${file.name}`;
      }
    });

    return emoteMap;
  } catch (err) {
    console.error('[7TV] Failed to fetch global emotes:', err);
    return {};
  }
}

export async function getBTTVEmotes(): Promise<EmoteMap> {
  try {
    const res = await fetch('https://api.betterttv.net/3/cached/emotes/global');
    const data = await res.json();
    const emoteMap: EmoteMap = {};

    data.forEach((emote: any) => {
      const url = `https://cdn.betterttv.net/emote/${emote.id}/3x.webp`;
      emoteMap[emote.code] = url;
    });

    return emoteMap;
  } catch (err) {
    console.error('[BTTV] Failed to fetch global emotes:', err);
    return {};
  }
}

export async function getFFZEmotes(): Promise<EmoteMap> {
  try {
    const res = await fetch('https://api.frankerfacez.com/v1/set/global');
    const data = await res.json();
    const emoteMap: EmoteMap = {};

    const sets = data.sets;
    for (const setId in sets) {
      const emotes = sets[setId].emoticons;
      emotes.forEach((emote: any) => {
        const urls = emote.urls;
        const size = urls['4'] || urls['2'] || urls['1'];
        const url = size.startsWith('http') ? size : `https:${size}`;
        emoteMap[emote.name] = url;
      });
    }

    return emoteMap;
  } catch (err) {
    console.error('[FFZ] Failed to fetch global emotes:', err);
    return {};
  }
}

export async function fetch7TVEmotesFromUserId(userId: string): Promise<EmoteMap> {
  const query = {
    operationName: "UserActiveEmotes",
    query: `
      query UserActiveEmotes($id: ID!, $page: Int!) {
        users {
          user(id: $id) {
            style {
              activeEmoteSet {
                emotes(page: $page, perPage: 1000) {
                  items {
                    alias
                    emote {
                      id
                      name: defaultName
                      images {
                        url
                        scale
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      id: userId,
      page: 1
    }
  };

  try {
    const res = await fetch("https://api.7tv.app/v4/gql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(query)
    });

    const json = await res.json();
    const emotes = json?.data?.users?.user?.style?.activeEmoteSet?.emotes?.items || [];
    const emoteMap: EmoteMap = {};

    for (const item of emotes) {
      const name = item.alias || item.emote.name;
      const bestImage = item.emote.images.find((img: any) => img.scale === 3) || item.emote.images[0];
      if (bestImage) {
        emoteMap[name] = bestImage.url;
      }
    }

    console.log(`[7TV] Loaded ${Object.keys(emoteMap).length} emotes for user ID ${userId}`);
    return emoteMap;
  } catch (err) {
    console.error(`[7TV] Failed to fetch emotes:`, err);
    return {};
  }
}

export async function getEmotes(): Promise<EmoteMap> {
  const [bttv, seventv, ffz, seventvmiia] = await Promise.all([
    getBTTVEmotes(),
    get7TVEmotes(),
    getFFZEmotes(),
    fetch7TVEmotesFromUserId("01GN8JN6X800006ZWMT1XQ1NRH")
  ]);

  const EMOTE_MAP: EmoteMap = {
    ...bttv,
    ...seventv,
    ...ffz,
    ...seventvmiia
  };

  console.log('[ALL EMOTES]', EMOTE_MAP);
  return EMOTE_MAP;
}