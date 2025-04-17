// Khởi tạo audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'achievement':
            const time = audioContext.currentTime;
            oscillator.type = 'triangle';
            
            oscillator.frequency.setValueAtTime(523.25, time);
            oscillator.frequency.setValueAtTime(659.25, time + 0.1);
            oscillator.frequency.setValueAtTime(783.99, time + 0.2);
            oscillator.frequency.setValueAtTime(1046.50, time + 0.3);
            
            gainNode.gain.setValueAtTime(0.3, time);
            gainNode.gain.setValueAtTime(0.3, time + 0.1);
            gainNode.gain.setValueAtTime(0.3, time + 0.2);
            gainNode.gain.setValueAtTime(0.3, time + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.8);
            
            oscillator.start(time);
            oscillator.stop(time + 0.8);
            
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                
                const time2 = audioContext.currentTime;
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(1568.0, time2);
                osc2.frequency.exponentialRampToValueAtTime(2093.0, time2 + 0.2);
                
                gain2.gain.setValueAtTime(0.2, time2);
                gain2.gain.exponentialRampToValueAtTime(0.01, time2 + 0.4);
                
                osc2.start(time2);
                osc2.stop(time2 + 0.4);
            }, 400);
            break;
            
        case 'plant':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
        case 'grow':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(262, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(330, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
            
        case 'ready':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(784, audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(1047, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
            
        case 'harvest':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1760, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.4);
            
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(1047, audioContext.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(784, audioContext.currentTime + 0.2);
                gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                osc2.start();
                osc2.stop(audioContext.currentTime + 0.3);
            }, 100);
            break;
            
        case 'open':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(262, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(392, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
            
        case 'close':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(392, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(262, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
            
        case 'error':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
    }
}