import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { delay, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CommandModel } from '../command.interface';
import { ToolsService } from '../tools.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, OnDestroy {
  message$ = this.service.message$;
  messages: CommandModel[] = [];
  tasks$ = new Subject<Observable<any>>();
  remover$ = of('').pipe(delay(3000), tap(() => this.messages.shift()));
  destroy$ = new Subject();

  constructor(private service: ToolsService) {}

  ngOnInit() {
    this.service.init();
    this.tasks$.pipe(mergeMap(task => task)).subscribe();
    this.message$.subscribe(value => {
      this.messages.push({ ...value });
      this.tasks$.next(this.remover$);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
