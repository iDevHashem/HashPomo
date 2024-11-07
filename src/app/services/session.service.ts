import { Injectable } from '@angular/core';

interface Session {
  type: 'Pomodoro' | 'Short Break' | 'Long Break';
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessions: Session[] = [];
  dailyGoal: number = 4; // Default daily goal

  constructor() {
    this.loadSessions();
  }

  recordSession(type: Session['type'], startTime: Date, endTime: Date, duration: number): void {
    const session: Session = { type, startTime, endTime, duration };
    this.sessions.push(session);
    this.saveSessions();
  }

  getPomodoroCount(): number {
    return this.sessions.filter(session => session.type === 'Pomodoro').length;
  }

  getIntervalCount(longBreakInterval: number): number {
    return Math.ceil(this.getPomodoroCount() / longBreakInterval);
  }

  private loadSessions(): void {
    const storedSessions = localStorage.getItem('sessions');
    if (storedSessions) {
      this.sessions = JSON.parse(storedSessions);
    }
  }

  private saveSessions(): void {
    localStorage.setItem('sessions', JSON.stringify(this.sessions));
  }

  resetSessions(): void {
    this.sessions = [];
    localStorage.removeItem('sessions');
  }

  // Pomodoro Round
  setPomodoroRound(): void {
    let round = this.getPomodoroRound();
    round = round + 1;

    localStorage.setItem('pomodoroRound', round.toString());
  }

  getPomodoroRound(): number {
    let round = localStorage.getItem('pomodoroRound');

    if (!round) {
      round = '0';
      localStorage.setItem('pomodoroRound', round);
    }

    return parseInt(round, 10);
  }

  resetPomodoroRound(): void {
    localStorage.removeItem('pomodoroRound');
  }

}
