// Sound utility for Tetris game using Web Audio API
// No external dependencies - uses native browser AudioContext

// Sound type definitions
export type SoundType =
  | 'move'
  | 'rotate'
  | 'softDrop'
  | 'hardDrop'
  | 'lock'
  | 'lineClear'
  | 'levelUp'
  | 'gameOver'
  | 'start'
  | 'pause';

// Audio context singleton (created on first user interaction)
let audioContext: AudioContext | null = null;

// Get or create audio context
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Sound configurations
const soundConfigs: Record<SoundType, { frequency: number; duration: number; type?: OscillatorType; slide?: number }> = {
  move: { frequency: 400, duration: 50, type: 'sine' },
  rotate: { frequency: 600, duration: 30, type: 'sine' },
  softDrop: { frequency: 200, duration: 40, type: 'square' },
  hardDrop: { frequency: 150, duration: 60, type: 'square' },
  lock: { frequency: 300, duration: 50, type: 'sine' },
  lineClear: { frequency: 400, duration: 200, type: 'sine', slide: 400 },
  levelUp: { frequency: 523, duration: 500, type: 'sine', slide: 523 },
  gameOver: { frequency: 400, duration: 1000, type: 'sawtooth', slide: -300 },
  start: { frequency: 440, duration: 300, type: 'sine', slide: 440 },
  pause: { frequency: 800, duration: 100, type: 'sine' },
};

// Play a single tone
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', slide: number = 0): void {
  const ctx = getAudioContext();
  
  // Resume context if suspended (browser policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  // Apply frequency slide if specified
  if (slide !== 0) {
    oscillator.frequency.linearRampToValueAtTime(frequency + slide, ctx.currentTime + duration / 1000);
  }

  // Envelope for smooth sound
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration / 1000);
}

// Play line clear sound with rising tone
function playLineClear(): void {
  const ctx = getAudioContext();
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // Play a chord for line clear
  const frequencies = [523, 659, 784]; // C5, E5, G5
  
  frequencies.forEach((freq, index) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    // Stagger the notes slightly
    const startTime = ctx.currentTime + index * 0.05;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
}

// Play level up sound (ascending arpeggio)
function playLevelUp(): void {
  const ctx = getAudioContext();
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  
  notes.forEach((freq, index) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    const startTime = ctx.currentTime + index * 0.1;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.4);
  });
}

// Play game over sound (descending slide)
function playGameOver(): void {
  const ctx = getAudioContext();
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8);

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.8);
}

// Play start sound
function playStart(): void {
  const ctx = getAudioContext();
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, ctx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.2);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
}

// Main play function
export function playSound(type: SoundType): void {
  const config = soundConfigs[type];
  
  switch (type) {
    case 'lineClear':
      playLineClear();
      break;
    case 'levelUp':
      playLevelUp();
      break;
    case 'gameOver':
      playGameOver();
      break;
    case 'start':
      playStart();
      break;
    default:
      playTone(config.frequency, config.duration, config.type, config.slide);
  }
}

// Initialize audio context on user interaction
export function initAudio(): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}