import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  dailyGoal: number;

  constructor() {
    this.workDuration = 25;
    this.shortBreakDuration = 5;
    this.longBreakDuration = 15;
    this.autoStartBreaks = false;
    this.autoStartPomodoros = false;
    this.longBreakInterval = 4;
    this.dailyGoal = 4;
  }

  ngOnInit(): void {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      this.workDuration = settings.workDuration;
      this.shortBreakDuration = settings.shortBreakDuration;
      this.longBreakDuration = settings.longBreakDuration;
      this.autoStartBreaks = settings.autoStartBreaks;
      this.autoStartPomodoros = settings.autoStartPomodoros;
      this.longBreakInterval = settings.longBreakInterval;
      this.dailyGoal = settings.dailyGoal;
    }
  }

  saveSettings(): void {
    const settings = {
      workDuration: this.workDuration,
      shortBreakDuration: this.shortBreakDuration,
      longBreakDuration: this.longBreakDuration,
      autoStartBreaks: this.autoStartBreaks,
      autoStartPomodoros: this.autoStartPomodoros,
      longBreakInterval: this.longBreakInterval,
      dailyGoal: this.dailyGoal
    };
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved!');
  }
}
