"use client";

/**
 * Tiny WebAudio sound engine — everything synthesized in the browser,
 * no audio files, no licenses. Off by default; started only from a user
 * gesture (browser autoplay policies require it anyway).
 *
 * - ambient: two soft detuned triangle oscillators (A2 + E3 fifth) through
 *   a lowpass, with a slow LFO "breathing" the gain — a quiet room tone.
 * - tick: short high blip for link/button hovers.
 * - click: two-step confirmation blip for presses.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientNodes: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  enabled = false;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  enable() {
    const ctx = this.ensureContext();
    if (this.enabled) return;
    this.enabled = true;

    const pad = ctx.createGain();
    pad.gain.value = 0;
    // fade the room tone in over 2s
    pad.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.Q.value = 0.4;

    // slow breathing on the pad volume
    this.lfo = ctx.createOscillator();
    this.lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0.012;
    this.lfo.connect(lfoDepth);
    lfoDepth.connect(pad.gain);
    this.lfo.start();

    for (const freq of [110, 164.81]) {
      // A2 + E3 — an open fifth, calm and unmusical enough to disappear
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.detune.value = Math.random() * 6 - 3;
      osc.connect(filter);
      osc.start();
      this.ambientNodes.push(osc);
    }
    filter.connect(pad);
    pad.connect(this.master!);
    this.padGain = pad;
  }
  private padGain: GainNode | null = null;

  disable() {
    if (!this.enabled || !this.ctx) return;
    this.enabled = false;
    const t = this.ctx.currentTime;
    this.padGain?.gain.cancelScheduledValues(t);
    this.padGain?.gain.linearRampToValueAtTime(0, t + 0.6);
    const nodes = [...this.ambientNodes, this.lfo].filter(Boolean) as OscillatorNode[];
    this.ambientNodes = [];
    this.lfo = null;
    setTimeout(() => nodes.forEach((n) => n.stop()), 700);
  }

  private blip(freq: number, duration: number, volume: number) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  tick() {
    this.blip(1400, 0.06, 0.04);
  }

  click() {
    this.blip(900, 0.08, 0.06);
    setTimeout(() => this.blip(1350, 0.09, 0.05), 70);
  }
}

export const sound = new SoundEngine();
