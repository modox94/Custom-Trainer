import { get } from "lodash";

const fetchOpts = {
  method: "GET",
  mode: "cors",
  headers: { "Content-Type": "application/json" },
};

if (!window.electron) {
  const host = get(window, ["location", "host"]);

  let ws;
  const subscriptions = {};
  const unsubscribe = (event, cb) => {
    subscriptions[event] = (subscriptions[event] || []).filter(
      cbEl => cbEl !== cb,
    );
  };

  ws = new WebSocket(`wss://${host}`);

  const onclose = event => {
    const isSecure = get(event, ["currentTarget", "url"], "").startsWith(
      "wss://",
    );
    console.log(`Can't open ${isSecure ? "wss" : "ws"} connection.`);

    if (isSecure) {
      ws = new WebSocket(`ws://${host}`);
    } else {
      ws = new WebSocket(`wss://${host}`);
    }

    ws.onclose = onclose;
    ws.onmessage = onmessage;
  };

  const onmessage = e => {
    console.log("onmessage");
    const { data: rawData } = e || {};
    let data;

    try {
      data = JSON.parse(rawData);
    } catch (error) {
      console.log("Invalid ws data", error);
      return;
    }

    const { event, payload } = data;

    if (subscriptions[event]?.length > 0) {
      subscriptions[event].forEach(cb => cb(payload));
    }
  };

  ws.onclose = onclose;
  ws.onmessage = onmessage;

  window.electron = {
    ipcRenderer: {
      on: (event, cb) => {
        if (subscriptions[event]) {
          subscriptions[event].push(cb);
        } else {
          subscriptions[event] = [cb];
        }

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(Object.keys(subscriptions)));
        }

        return () => unsubscribe(event, cb);
      },
      invoke: async (event, ...args) => {
        const origin = get(window, ["location", "origin"]);
        const fetchUrl = new URL("/invoke", origin);

        const response = await fetch(fetchUrl, {
          ...fetchOpts,
          method: "POST",
          body: JSON.stringify({ event, args }),
        });

        return await response.json();
      },
      send: async (event, ...args) => {
        const origin = get(window, ["location", "origin"]);
        const fetchUrl = new URL("/send", origin);

        await fetch(fetchUrl, {
          ...fetchOpts,
          method: "POST",
          body: JSON.stringify({ event, args }),
        });
      },
    },
  };
}
