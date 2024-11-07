import { Injectable } from '@angular/core';

interface Session {
  type: 'Pomodoro' | 'Short Break' | 'Long Break';
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
}

interface DailyReport {
  date: string;
  pomodoroCount: number;
  shortBreakCount: number;
  longBreakCount: number;
  totalFocusTime: number; // in seconds
  totalBreakTime: number; // in seconds
}


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private sessions: Session[] = [];

  constructor() {
    this.loadSessions();
  }

  generateFakeData(): void {
    const sessions: Session[] = JSON.parse(localStorage.getItem('sessions') || '[]');
    const sessionTypes = ['Pomodoro', 'Short Break', 'Long Break'];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Generate data for the last 30 days

    for (let i = 0; i < 50; i++) {
      const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
      const startTime = new Date(startDate);
      startTime.setMinutes(startDate.getMinutes() + Math.floor(Math.random() * 60));
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + Math.floor(Math.random() * 60));
      const duration = Math.floor(Math.random() * 60) + 1;

      sessions.push({ type: sessionType as Session['type'], startTime, endTime, duration });
      startDate.setMinutes(startDate.getMinutes() + Math.floor(Math.random() * 120));
    }

    localStorage.setItem('sessions', JSON.stringify(sessions));
  }

  private loadSessions(): void {
    const storedSessions = localStorage.getItem('sessions');
    if (storedSessions) {
      this.sessions = JSON.parse(storedSessions);
    }
  }

  getDailyReports(): DailyReport[] {
    const dailyReports: { [key: string]: DailyReport } = {};

    this.sessions.forEach(session => {
      const dateKey = new Date(session.startTime).toISOString().split('T')[0];

      if (!dailyReports[dateKey]) {
        dailyReports[dateKey] = {
          date: dateKey,
          pomodoroCount: 0,
          shortBreakCount: 0,
          longBreakCount: 0,
          totalFocusTime: 0,
          totalBreakTime: 0,
        };
      }

      if (session.type === 'Pomodoro') {
        dailyReports[dateKey].pomodoroCount++;
        dailyReports[dateKey].totalFocusTime += session.duration;
      } else {
        if (session.type === 'Short Break') {
          dailyReports[dateKey].shortBreakCount++;
        } else {
          dailyReports[dateKey].longBreakCount++;
        }
        dailyReports[dateKey].totalBreakTime += session.duration;
      }
    });

    return Object.values(dailyReports);
  }

  getTotalFocusHours(): number {
    return this.sessions
      .filter(session => session.type === 'Pomodoro')
      .reduce((total, session) => total + session.duration, 0) / 3600;
  }

  getDaysAccessed(): number {
    const daysAccessed = new Set(
      this.sessions.map(session => new Date(session.startTime).toISOString().split('T')[0])
    );
    return daysAccessed.size;
  }

  getCurrentDayStreak(): number {
    const days = new Set(
      this.sessions.map(session => new Date(session.startTime).toISOString().split('T')[0])
    );
    const sortedDays = Array.from(days).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (let i = sortedDays.length - 1; i >= 0; i--) {
      if (new Date(sortedDays[i]).toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}
