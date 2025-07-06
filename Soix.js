// SOIX 5.1 TEST (No Jesse branding, pure engine-level test)
async function startSoixTest() {
  // Start Tone.js audio context
  await Tone.start();
  console.log("🧪 SOIX Test Started");

  // Get Web Audio context from Tone.js
  const audioContext = Tone.getContext().rawContext;

  // Determine output capability
  const maxChannels = audioContext.destination.maxChannelCount;
  const surround = maxChannels >= 6;
  const outputCount = surround ? 6 : 2;

  console.log(`🔊 Output Channels: ${outputCount} (${surround ? "5.1" : "Stereo"} Mode)`);

  // Create audio merger for all channels
  const outputMerger = audioContext.createChannelMerger(outputCount);

  // Label channels
  const channelNames = surround
    ? ["Front Left", "Front Right", "Center", "Sub", "Rear Left", "Rear Right"]
    : ["Left", "Right"];

  // Create and route synths
  const synths = [];
  for (let i = 0; i < outputCount; i++) {
    const synth = new Tone.Synth().connect(outputMerger, 0, i);
    synths.push(synth);
  }

  outputMerger.connect(audioContext.destination);

  // Test function: announce each channel in sequence
  window.soixTestRun = function () {
    console.log("▶️ Running Soix Speaker Test...");
    for (let i = 0; i < outputCount; i++) {
      setTimeout(() => {
        console.log(`📢 ${channelNames[i]}`);
        synths[i].triggerAttackRelease("C4", "8n");
      }, i * 500);
    }
  };
}