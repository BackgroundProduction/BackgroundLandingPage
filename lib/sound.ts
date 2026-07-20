"use client";

/**
 * Tiny WebAudio sound engine. Off by default; started only from a user
 * gesture (browser autoplay policies require it anyway).
 *
 * - ambient: the background music track, looped, routed through WebAudio
 *   so it shares the master gain with the UI blips and can fade in/out.
 * - tick: short high blip for link/button hovers.
 * - click: two-step confirmation blip for presses.
 */
const AMBIENT_SRC = "/assets/sound/bg-bgmusic.mp3";
const AMBIENT_GAIN = 0.35;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private el: HTMLAudioElement | null = null;
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

    // The <audio> element is created once and reused — createMediaElementSource
    // may only be called a single time per element.
    if (!this.el) {
      this.el = new Audio(AMBIENT_SRC);
      this.el.loop = true;
      this.el.preload = "auto";
      const src = ctx.createMediaElementSource(this.el);
      const pad = ctx.createGain();
      pad.gain.value = 0;
      src.connect(pad);
      pad.connect(this.master!);
      this.padGain = pad;
    }

    const t = ctx.currentTime;
    this.padGain!.gain.cancelScheduledValues(t);
    this.padGain!.gain.setValueAtTime(this.padGain!.gain.value, t);
    // fade the track in over 2s
    this.padGain!.gain.linearRampToValueAtTime(AMBIENT_GAIN, t + 2);
    void this.el.play().catch(() => {
      /* blocked before a gesture — the toggle retries on the next click */
    });
  }
  private padGain: GainNode | null = null;

  disable() {
    if (!this.enabled || !this.ctx) return;
    this.enabled = false;
    const t = this.ctx.currentTime;
    this.padGain?.gain.cancelScheduledValues(t);
    this.padGain?.gain.setValueAtTime(this.padGain.gain.value, t);
    this.padGain?.gain.linearRampToValueAtTime(0, t + 0.6);
    const el = this.el;
    // pause only after the fade, so it doesn't cut off
    setTimeout(() => {
      if (!this.enabled) el?.pause();
    }, 700);
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
