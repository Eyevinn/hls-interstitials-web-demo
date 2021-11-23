import { patchNativeInterstitials } from "./native";

function isSafari() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("safari") && !ua.includes("chrome");
}

function playNative(src: string) {
  const master = document.querySelector<HTMLVideoElement>("#master");
  const minion = document.querySelector<HTMLVideoElement>("#minion");

  patchNativeInterstitials(master, minion);

  master.src = src;
}

const DEMO_PAYLOAD = {
  uri: "https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8",
  breaks: [
    {
      pos: 0,
      duration: 10000,
      url: "http://lab.cdn.eyevinn.technology/probably-the-best-10s.mp4/manifest.m3u8",
    },
    {
      pos: 20000,
      duration: 10000,
      url: "http://lab.cdn.eyevinn.technology/probably-the-best-10s.mp4/manifest.m3u8",
    },
    {
      pos: 100000,
      duration: 10000,
      url: "http://lab.cdn.eyevinn.technology/probably-the-best-10s.mp4/manifest.m3u8",
    },
  ],
};

window.onload = () => {
  const playSafari = document.querySelector<HTMLButtonElement>("#play_safari");
  if (!isSafari()) {
    playSafari.disabled = true;
    document.querySelector<HTMLDivElement>("#not-supported").style.display =
      "block";
  } else {
    const wrapper = document.querySelector<HTMLDivElement>("#wrapper");
    const src = `https://lambda-ssl.eyevinn.technology/stitch/master.m3u8?payload=${btoa(
      JSON.stringify(DEMO_PAYLOAD)
    )}&i=1`;
    playSafari.addEventListener("click", () => {
      wrapper.style.display = "block";
      playNative(src);
    });
  }
};
