// Respond to all messages by sending the content back with a prefix.

import { Message } from "./hash_worker_messages.js";
import { AsyncSha256 } from "./sha-256.js";

// This assumes that all messages are strings.
onmessage = (e) => {
  const file = e.data;
  const reader = new FileReader();
    reader.onload = () => {
      // The result should always be a string in this case.
      const fileData = reader.result as string;

      const hasher = new AsyncSha256();
      hasher.async_digest(
        fileData,
        (hash) => {
          const message: Message = {hash, remaining: 0, currentTime: new Date().getTime()};
          postMessage(message);
        },
        (remaining) => {
          const message: Message = {hash: null, remaining, currentTime: new Date().getTime()};
          postMessage(message);
        },
      );
    };
    reader.readAsText(file);
};
