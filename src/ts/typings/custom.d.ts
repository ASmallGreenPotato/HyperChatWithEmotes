interface CustomEvent extends Event {
  detail?: any;
}

interface SimpleUserInfo {
  name: string;
  channelId: string;
}


interface TextPart {
  type: 'text';
  content: string;
}

interface EmotePart {
  type: 'emote';
  src: string;
  alt: string;
}

type EmoteMessagePart = TextPart | EmotePart;