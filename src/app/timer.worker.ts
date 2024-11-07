/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { interval } = data;
  let count = 0;

  function tick() {
    postMessage({ count });
    count++;
  }

  setInterval(tick, interval);
});
