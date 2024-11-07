import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  interval: any;
  isRunning: boolean = false;
  minutes: number;
  seconds: number;

  constructor() {
    this.minutes = 25; // Default work duration
    this.seconds = 0;
  }

  startTimer(callback: () => void): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.interval = setInterval(() => {
        if (this.seconds === 0) {
          if (this.minutes === 0) {
            this.stopTimer();
            callback();
          } else {
            this.minutes--;
            this.seconds = 59;
          }
        } else {
          this.seconds--;
        }
      }, 1000);
    }
  }

  pauseTimer(): void {
    if (this.isRunning) {
      this.stopTimer();
    }
  }

  resetTimer(workDuration: number): void {
    this.stopTimer();
    this.minutes = workDuration;
    this.seconds = 0;
  }

  private stopTimer(): void {
    this.isRunning = false;
    clearInterval(this.interval);
  }

  setTime(minutes: number, seconds: number): void {
    this.minutes = minutes;
    this.seconds = seconds;
  }

  getTime(): { minutes: number, seconds: number } {
    return { minutes: this.minutes, seconds: this.seconds };
  }
}
