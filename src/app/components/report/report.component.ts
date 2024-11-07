import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  totalFocusHours: number = 0;
  daysAccessed: number = 0;
  dayStreak: number = 0;
  dailyReports: any[] = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    // this.reportsService.generateFakeData();

    this.totalFocusHours = this.reportsService.getTotalFocusHours();
    this.daysAccessed = this.reportsService.getDaysAccessed();
    this.dayStreak = this.reportsService.getCurrentDayStreak();
    this.dailyReports = this.reportsService.getDailyReports();
  }
}
