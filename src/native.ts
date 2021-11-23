function enableMetadataTrack(master: HTMLMediaElement) {
  const track = Array.from(master.textTracks).find(
    (track) => track.kind === "metadata"
  );
  if (track) {
    track.mode = "hidden";
  }
}

export function patchNativeInterstitials(
  master: HTMLMediaElement,
  minion: HTMLMediaElement
) {
  const playedCues = [];
  minion.style.visibility = "hidden";

  const onAddTrack = ({ track }: TrackEvent) => {
    if (track && track.kind === "metadata") {
      track.mode = "hidden";
      track.addEventListener("cuechange", async (evt) => {
        const cue: any = Array.from(track.activeCues).find(
          (cue: any) =>
            cue.value?.key === "X-ASSET-LIST" ||
            cue.value?.key === "X-ASSET-URI"
        );
        if (cue?.value?.data && !playedCues.includes(cue.startTime)) {
          const { key, data } = cue.value;
          let manifest = data;
          if (key === "X-ASSET-LIST") {
            const interstitialData = await fetch(data).then(
              (response) => (response.ok ? response.json() : null),
              () => null
            );
            manifest = interstitialData?.ASSETS?.[0]?.URI;
          }
          if (manifest) {
            playedCues.push(cue.startTime);

            minion.style.visibility = "visible";
            master.pause();
            minion.src = manifest;
            minion.play();
          }
        }
      });
    }
  };

  const onChange = () => {
    enableMetadataTrack(master);
  };

  master.textTracks.addEventListener("change", onChange);
  master.textTracks.addEventListener("addtrack", onAddTrack);

  const onMinionEnded = () => {
    minion.style.visibility = "hidden";
    minion.src = null;
    minion.load();
    master.play();
  };

  minion.addEventListener("ended", onMinionEnded);

  return () => {
    master.removeEventListener("change", onChange);
    master.removeEventListener("addTrack", onAddTrack);

    minion.removeEventListener("ended", onMinionEnded);
  };
}
