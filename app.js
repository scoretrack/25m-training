// 25m Pistol PWA - Main Application
// ISSF 25m Pistol Training Timer

class PistolTimer {
    constructor() {
        this.currentMode = null;
        this.currentSeries = 1;
        this.currentShot = 1;
        this.isPaused = false;
        this.isRunning = false;
        this.timer = null;
        this.timeRemaining = 0;
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeSpeech();
    }

    initializeElements() {
        // Screens
        this.homeScreen = document.getElementById('homeScreen');
        this.competitionScreen = document.getElementById('competitionScreen');
        
        // Competition elements
        this.competitionTitle = document.getElementById('competitionTitle');
        this.stageInfo = document.getElementById('stageInfo');
        this.shotInfo = document.getElementById('shotInfo');
        this.mainTimer = document.getElementById('mainTimer');
        this.statusMessage = document.getElementById('statusMessage');
        this.progressBar = document.getElementById('progressBar');
        this.shotsGrid = document.getElementById('shotsGrid');
        
        // Buttons
        this.backBtn = document.getElementById('backBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.startBtn = document.getElementById('startBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
    }

    attachEventListeners() {
        // Menu buttons
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.startMode(mode);
            });
        });

        // Control buttons
        this.backBtn.addEventListener('click', () => this.goHome());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.startBtn.addEventListener('click', () => this.startCompetition());
        this.nextBtn.addEventListener('click', () => this.nextShot());
        this.resumeBtn.addEventListener('click', () => this.togglePause());
    }

    initializeSpeech() {
        // Pre-load audio context for better performance
        this.audioContext = null;
        this.canSpeak = 'speechSynthesis' in window;
        
        if (this.canSpeak) {
            // Initialize on first user interaction
            document.addEventListener('click', () => {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
            }, { once: true });
        }
    }

    speak(text, priority = false) {
        if (!this.canSpeak || this.isPaused) return;
        
        // Cancel previous speech if priority
        if (priority && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        window.speechSynthesis.speak(utterance);
    }

    playBeep(frequency = 800, duration = 200) {
        if (!this.audioContext || this.isPaused) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    startMode(mode) {
        this.currentMode = mode;
        this.currentSeries = 1;
        this.currentShot = 1;
        this.isPaused = false;
        this.isRunning = false;
        
        // Set title
        const titles = {
            precision: 'Precision',
            rapid: 'Rapid Fire',
            ranking: 'Ranking',
            medal: 'Medal Match'
        };
        this.competitionTitle.textContent = titles[mode];
        
        // Initialize mode
        this.initializeMode();
        
        // Show competition screen
        this.homeScreen.classList.remove('active');
        this.competitionScreen.classList.add('active');
        
        // Reset UI
        this.updateDisplay();
        this.createShotsGrid();
    }

    initializeMode() {
        const configs = {
            precision: {
                series: 6,
                shotsPerSeries: 5,
                timePerSeries: 300 // 5 minutes
            },
            rapid: {
                series: 6,
                shotsPerSeries: 5,
                timePerShot: 3 // 3 seconds
            },
            ranking: {
                series: 2,
                shotsPerSeries: 5,
                timePerShot: 4 // 4 seconds
            },
            medal: {
                series: 4,
                shotsPerSeries: 5,
                timePerShot: 3 // 3 seconds
            }
        };
        
        this.config = configs[this.currentMode];
    }

    createShotsGrid() {
        this.shotsGrid.innerHTML = '';
        const totalShots = this.config.shotsPerSeries;
        
        for (let i = 1; i <= totalShots; i++) {
            const shot = document.createElement('div');
            shot.className = 'shot-indicator';
            shot.textContent = i;
            shot.dataset.shot = i;
            this.shotsGrid.appendChild(shot);
        }
    }

    startCompetition() {
        this.isRunning = true;
        this.startBtn.style.display = 'none';
        
        if (this.currentMode === 'precision') {
            this.startPrecisionSeries();
        } else {
            this.startRapidSequence();
        }
    }

    startPrecisionSeries() {
        this.timeRemaining = this.config.timePerSeries;
        this.statusMessage.textContent = 'Shooting';
        this.statusMessage.className = 'status-message active';
        
        this.speak('Load', true);
        
        setTimeout(() => {
            this.speak('Attention');
            this.playBeep(600, 1000);
        }, 3000);
        
        setTimeout(() => {
            this.speak('Start');
            this.playBeep(1000, 500);
            this.startPrecisionTimer();
        }, 6000);
    }

    startPrecisionTimer() {
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.timeRemaining--;
                this.updateDisplay();
                
                // Warning at 30 seconds
                if (this.timeRemaining === 30) {
                    this.mainTimer.classList.add('warning');
                }
                
                // Danger at 10 seconds
                if (this.timeRemaining === 10) {
                    this.mainTimer.classList.remove('warning');
                    this.mainTimer.classList.add('danger');
                }
                
                if (this.timeRemaining <= 0) {
                    this.endPrecisionSeries();
                }
            }
        }, 1000);
        
        // Show next button for manual progression
        this.nextBtn.style.display = 'block';
    }

    endPrecisionSeries() {
        clearInterval(this.timer);
        this.mainTimer.classList.remove('warning', 'danger');
        this.speak('Stop', true);
        this.playBeep(600, 1000);
        this.statusMessage.textContent = 'Series Complete';
        this.statusMessage.className = 'status-message';
        this.nextBtn.style.display = 'none';
        
        // Mark all shots as completed
        document.querySelectorAll('.shot-indicator').forEach(shot => {
            shot.classList.add('completed');
        });
        
        if (this.currentSeries < this.config.series) {
            setTimeout(() => {
                this.currentSeries++;
                this.currentShot = 1;
                this.createShotsGrid();
                this.updateDisplay();
                this.statusMessage.textContent = 'Ready for next series';
                this.startBtn.textContent = 'Start Series ' + this.currentSeries;
                this.startBtn.style.display = 'block';
                this.isRunning = false;
            }, 3000);
        } else {
            this.completionMessage();
        }
    }

    startRapidSequence() {
        this.currentShot = 1;
        this.updateDisplay();
        this.statusMessage.textContent = 'Get Ready';
        
        this.speak('Load', true);
        
        setTimeout(() => {
            this.speak('Attention');
            this.playBeep(600, 1000);
            this.prepareForRapid();
        }, 3000);
    }

    prepareForRapid() {
        // Random delay between 4-7 seconds after "Attention"
        const delay = 4000 + Math.random() * 3000;
        
        setTimeout(() => {
            this.executeRapidFire();
        }, delay);
    }

    executeRapidFire() {
        const timePerShot = this.config.timePerShot;
        this.statusMessage.textContent = 'FIRE';
        this.statusMessage.className = 'status-message alert';
        this.playBeep(1000, 200);
        
        // Update shot indicators in sequence
        const shotInterval = setInterval(() => {
            if (!this.isPaused) {
                // Mark current shot
                const currentShotEl = document.querySelector(`.shot-indicator[data-shot="${this.currentShot}"]`);
                if (currentShotEl) {
                    currentShotEl.classList.add('current');
                }
                
                this.timeRemaining = timePerShot * (this.config.shotsPerSeries - this.currentShot + 1);
                this.updateDisplay();
                
                setTimeout(() => {
                    if (currentShotEl) {
                        currentShotEl.classList.remove('current');
                        currentShotEl.classList.add('completed');
                    }
                    
                    if (this.currentShot >= this.config.shotsPerSeries) {
                        clearInterval(shotInterval);
                        this.endRapidSeries();
                    } else {
                        this.currentShot++;
                    }
                }, timePerShot * 1000);
            }
        }, timePerShot * 1000);
        
        this.timer = shotInterval;
    }

    endRapidSeries() {
        this.speak('Stop', true);
        this.playBeep(600, 1000);
        this.statusMessage.textContent = 'Series Complete';
        this.statusMessage.className = 'status-message';
        
        if (this.currentSeries < this.config.series) {
            setTimeout(() => {
                this.currentSeries++;
                this.currentShot = 1;
                this.createShotsGrid();
                this.updateDisplay();
                this.statusMessage.textContent = 'Ready for next series';
                this.startBtn.textContent = 'Start Series ' + this.currentSeries;
                this.startBtn.style.display = 'block';
                this.isRunning = false;
            }, 3000);
        } else {
            this.completionMessage();
        }
    }

    nextShot() {
        // Manual progression for precision
        if (this.currentMode === 'precision' && this.currentShot < this.config.shotsPerSeries) {
            const shotEl = document.querySelector(`.shot-indicator[data-shot="${this.currentShot}"]`);
            if (shotEl) {
                shotEl.classList.add('completed');
            }
            this.currentShot++;
            this.updateDisplay();
        }
    }

    completionMessage() {
        this.isRunning = false;
        this.statusMessage.textContent = 'Competition Complete!';
        this.statusMessage.className = 'status-message active';
        
        setTimeout(() => {
            this.startBtn.textContent = 'Return to Menu';
            this.startBtn.style.display = 'block';
            this.startBtn.onclick = () => this.goHome();
        }, 2000);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseBtn.textContent = '▶';
            this.statusMessage.textContent = 'Paused';
            this.statusMessage.className = 'status-message';
            this.resumeBtn.style.display = 'block';
            this.startBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
        } else {
            this.pauseBtn.textContent = '⏸';
            this.statusMessage.textContent = 'Shooting';
            this.statusMessage.className = 'status-message active';
            this.resumeBtn.style.display = 'none';
            
            if (this.currentMode === 'precision') {
                this.nextBtn.style.display = 'block';
            }
        }
    }

    updateDisplay() {
        // Update series and shot info
        this.stageInfo.textContent = `Series ${this.currentSeries} of ${this.config.series}`;
        this.shotInfo.textContent = `Shot ${this.currentShot} of ${this.config.shotsPerSeries}`;
        
        // Update timer
        if (this.currentMode === 'precision') {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            this.mainTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            this.mainTimer.textContent = `${this.timeRemaining}s`;
        }
        
        // Update progress bar
        const totalShots = this.config.series * this.config.shotsPerSeries;
        const completedShots = (this.currentSeries - 1) * this.config.shotsPerSeries + (this.currentShot - 1);
        const progress = (completedShots / totalShots) * 100;
        this.progressBar.style.setProperty('--progress', `${progress}%`);
        
        // Highlight current shot
        document.querySelectorAll('.shot-indicator').forEach((shot, index) => {
            shot.classList.remove('current');
            if (index + 1 === this.currentShot && this.isRunning) {
                shot.classList.add('current');
            }
        });
    }

    goHome() {
        // Stop any running timers
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Cancel speech
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        
        // Reset state
        this.isRunning = false;
        this.isPaused = false;
        this.currentMode = null;
        
        // Reset buttons
        this.startBtn.textContent = 'Start';
        this.startBtn.onclick = () => this.startCompetition();
        this.startBtn.style.display = 'block';
        this.nextBtn.style.display = 'none';
        this.resumeBtn.style.display = 'none';
        this.pauseBtn.textContent = '⏸';
        
        // Reset timer display
        this.mainTimer.classList.remove('warning', 'danger');
        
        // Show home screen
        this.competitionScreen.classList.remove('active');
        this.homeScreen.classList.add('active');
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Initialize app
const app = new PistolTimer();
