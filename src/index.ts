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

window.onload = () => {
  const playSafari = document.querySelector<HTMLButtonElement>("#play_safari");
  if (!isSafari()) {
    playSafari.disabled = true;
    document.querySelector<HTMLDivElement>("#not-supported").style.display = "block"; 
  } else {
    const wrapper = document.querySelector<HTMLDivElement>("#wrapper");
    const src = `https://lambda-ssl.eyevinn.technology/stitch/master.m3u8?payload=ewogICAgICAidXJpIjogImh0dHBzOi8vbWFpdHYtdm9kLmxhYi5leWV2aW5uLnRlY2hub2xvZ3kvVklOTi5tcDQvbWFzdGVyLm0zdTgiLAogICAgICAiYnJlYWtzIjogWwogICAgICAgIHsgInBvcyI6IDAsICJkdXJhdGlvbiI6IDE1MDAwLCAidXJsIjogImh0dHBzOi8vbWFpdHYtdm9kLmxhYi5leWV2aW5uLnRlY2hub2xvZ3kvYWRzL2Fwb3RlYS0xNXMubXA0L21hc3Rlci5tM3U4IiB9LAogICAgICAgIHsgInBvcyI6IDU1MDAwLCAiZHVyYXRpb24iOiAxNTAwMCwgInVybCI6ICJodHRwczovL21haXR2LXZvZC5sYWIuZXlldmlubi50ZWNobm9sb2d5L2Fkcy9hcG90ZWEtMTVzLm1wNC9tYXN0ZXIubTN1OCIgfQogICAgICBdCn0=&i=1`;
    playSafari.addEventListener("click", () => {
      wrapper.style.display = "block";
      playNative(src);
    });
  }
};
