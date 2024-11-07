import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  workDuration: number = 25;
  shortBreakDuration: number = 5;
  longBreakDuration: number = 15;
  autoStartBreaks: boolean = false;
  autoStartPomodoros: boolean = false;
  longBreakInterval: number = 4;
  dailyGoal: number = 4;

  constructor() {
    this.loadSettings();
  }

  loadSettings(): void {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      this.workDuration = settings.workDuration || 25;
      this.shortBreakDuration = settings.shortBreakDuration || 5;
      this.longBreakDuration = settings.longBreakDuration || 15;
      this.autoStartBreaks = settings.autoStartBreaks || false;
      this.autoStartPomodoros = settings.autoStartPomodoros || false;
      this.longBreakInterval = settings.longBreakInterval || 4;
      this.dailyGoal = settings.dailyGoal || 4;
    }
  }

  saveSettings(settings: any): void {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
}
