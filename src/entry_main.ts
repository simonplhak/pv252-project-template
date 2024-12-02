import {
  allComponents,
  provideFluentDesignSystem,
} from "@fluentui/web-components";
import { SocketCanvasElement } from "./socket_canvas.js";
// Make everything use microsoft fluent by default.
provideFluentDesignSystem().register(allComponents);

/* 

Useful types (you don't have to use them explicitly, 
they serve as documentation for what the protocol is doing) 

*/

interface Point {
  x: number,
  y: number,
}

interface WelcomeMessage {
  // The size of the remote canvas.
  x: number,
  y: number,
  data: [number]
}

interface UpdateMessage {
  point: Point,
  value: boolean,
}

let welcomeMessage: WelcomeMessage | null = null;

const compute_xy = (index: number): Point => {
  const x = Math.floor(index / welcomeMessage!.x);
  const y = index % welcomeMessage!.x;
  return {x: x, y: y};
}

// Create a websocket connection. 
// More info at https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
const socket = new WebSocket("ws:socket.zavazadlo.unsigned-short.com");
socket.onmessage = (m) => {
  if (!welcomeMessage) {
    welcomeMessage = JSON.parse(m.data);
    welcomeMessage!.data.forEach((value, index) => {
      const point = compute_xy(index);
      canvas.setPixel(point.x, point.y, value === 1);
    });
  } else {
    const updateMessages: UpdateMessage[] = JSON.parse(m.data);
    updateMessages.forEach((updateMessage) => {
      canvas.setPixel(updateMessage.point.x, updateMessage.point.y, updateMessage.value);
    });
  }
}

// Example of how to use the canvas element:
let canvas = new SocketCanvasElement();
canvas.width = 128;
canvas.height = 128;
canvas.ondraw = (x,y) => {
  if (!welcomeMessage) {
    return;
  }
  socket.send(JSON.stringify({point: {x,y}, value: canvas.getValue()}));
}
document.querySelector("#container")!.appendChild(canvas);

// We can only draw into canvas once it is actually shown, hence we postpose the draw operation.
setTimeout(() => {
  for (let x=0; x<128; x++) {
    canvas.setPixel(x,x,true);
  }
});

// Sending update message with the 
setInterval(() => {
  if (socket.readyState === WebSocket.OPEN && welcomeMessage) {
    socket.send(JSON.stringify({point: {x: 0, y: 0}, value: welcomeMessage!.data[0] === 1}));
  }
}, 600);
