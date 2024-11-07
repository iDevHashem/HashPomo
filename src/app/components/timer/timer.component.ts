import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SessionService } from 'src/app/services/session.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TimerService } from 'src/app/services/timer.service';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  progressValue: number = 0;
  timerStatus: string = 'Pomodoro'; // Current timer status
  isBreak: boolean = false; // Flag indicating if currently in a break

  showToast: boolean = false;
  toast = {
    title: 'Pomodoro',
    message: 'Time to work!',
    type: 'success',
  }

  dailyGoal: number = 0;

  counters = {
    pomodoro: 0,
    shortBreak: 0,
    longBreak: 0,
    round: 0,
    dailyGoal: 0,
    goal: 0,
  }


  private worker!: Worker;
  public count: number = 0;

  private alarmSound!: HTMLAudioElement;


  constructor(
    public timerService: TimerService,
    private sessionService: SessionService,
    private settingsService: SettingsService,
    private titleService: Title
  ) {}

  ngOnInit(): void {

    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../../timer.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        this.count = data.count;
      };

      this.worker.postMessage({ interval: 1000 });
    } else {
      console.error('Web Workers are not supported in this environment.');
    }

    this.loadSettings();
    this.resetTimer();

    setInterval(() => {
      this.updateProgress();
    }, 1000);
    // this.startTimerIfNeeded();
  }

  ngOnDestroy() {
    if (this.worker) {
      this.worker.terminate();
    }
  }

  roundCounter() {
    this.counters.round = this.settingsService.longBreakInterval;
    this.counters.pomodoro = this.sessionService.getPomodoroRound()
    this.counters.dailyGoal = this.settingsService.dailyGoal;

    this.getDailyProgress()

  }



  private loadSettings(): void {
    this.settingsService.loadSettings();
    this.roundCounter();

    this.updateProgress();
  }

  private startTimerIfNeeded(): void {
    const { minutes, seconds } = this.timerService.getTime();
    if (minutes || seconds) {
      this.startTimer();
    }
  }

  alarmSoundPlay(): void {
    this.alarmSound = new Audio();
    this.alarmSound.src = '../../../assets/audio/alarm_clock_2.mp3'; // Path to your audio file
    this.alarmSound.load();

    this.alarmSound.play();
  }

  startTimer(): void {
    if (this.timerStatus == 'Pomodoro') {
      this.sessionService.setPomodoroRound();
    }

    if (this.timerStatus == 'Long Break') {
      this.sessionService.resetPomodoroRound();
    }

    this.timerService.startTimer(() => {

      if (this.timerStatus == 'Pomodoro') {
        this.showToast = true;
        this.toast.title = 'Your Pomodoro has timed out';
        this.toast.message = 'Time to take a short break!';
        this.toast.type = 'success';
        setTimeout(() => {
          this.showToast = false;
        }, 3000);

        this.alarmSoundPlay();

      }

      if (this.timerStatus == 'Short Break') {
        this.showToast = true;
        this.toast.title = 'Your Short Break has timed out';
        this.toast.message = 'Time to get back to work!';
        this.toast.type = 'success';
        setTimeout(() => {
          this.showToast = false;
        }, 3000);

        this.alarmSoundPlay();
      }

      if (this.timerStatus == 'Long Break') {
        this.showToast = true;
        this.toast.title = 'Your Long Break has timed out';
        this.toast.message = 'Time to get back to work!';
        this.toast.type = 'success';
        setTimeout(() => {
          this.showToast = false;
        }, 3000);

        this.alarmSoundPlay();
      }

      this.recordSession();
      this.startNextPomodoroOrBreak();

    });
  }

  pauseTimer(): void {
    this.timerService.pauseTimer();
  }

  resetTimer(): void {
    this.timerService.resetTimer(this.settingsService.workDuration);
    this.timerStatus = 'Pomodoro';
    this.sessionService.resetPomodoroRound();
    this.updateProgress();
  }

  skipTimer(): void {
    this.timerService.resetTimer(0);
    this.startNextPomodoroOrBreak();
  }

  private recordSession(): void {
    const { minutes, seconds } = this.timerService.getTime();
    const duration = (this.settingsService.workDuration * 60) - ((minutes * 60) + seconds);
    this.sessionService.recordSession(
      this.timerStatus as 'Pomodoro' | 'Short Break' | 'Long Break',
      new Date(), new Date(), duration
    );

  }

  private startNextPomodoroOrBreak(): void {
    this.roundCounter();

    if (this.timerStatus === 'Pomodoro') {
      this.timerStatus = this.isBreak
        ? 'Pomodoro'
        : this.sessionService.getPomodoroRound() == this.settingsService.longBreakInterval
        ? 'Long Break'
        : 'Short Break';
    } else {
      this.timerStatus = 'Pomodoro';
    }

    this.isBreak = this.timerStatus !== 'Pomodoro';
    this.timerService.resetTimer(
      this.isBreak
        ? this.timerStatus === 'Long Break'
          ? this.settingsService.longBreakDuration
          : this.settingsService.shortBreakDuration
        : this.settingsService.workDuration
    );

    if (this.isBreak && this.settingsService.autoStartBreaks) {
      this.startTimer();
    } else if (!this.isBreak && this.settingsService.autoStartPomodoros) {
      this.startTimer();
    }
  }

  private updateProgress(): void {
    const { minutes, seconds } = this.timerService.getTime();
    const totalSeconds = this.isBreak
      ? this.settingsService.shortBreakDuration * 60
      : this.settingsService.workDuration * 60;
    const remainingSeconds = (minutes * 60) + seconds;
    this.progressValue = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  }

  getDailyProgress(): void {
    const dailyGoal = this.settingsService.dailyGoal;

    console.log(this.settingsService.dailyGoal);
    if (dailyGoal === 0) this.counters.goal =  0;
    const pomodorosToday = this.sessionService.sessions.filter(session =>
      session.type === 'Pomodoro' && new Date(session.startTime).toDateString() === new Date().toDateString()
    ).length;

    this.counters.goal = pomodorosToday;
    // return pomodorosToday; //(pomodorosToday / dailyGoal) * 100;
  }


  getFormattedTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.titleService.setTitle(`${mins}:${secs < 10 ? '0' : ''}${secs} - ${this.timerStatus}`);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
