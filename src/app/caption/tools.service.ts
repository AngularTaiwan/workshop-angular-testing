import { Injectable } from '@angular/core';
import { HubService } from './hub.service';
import { Subject, bindCallback } from 'rxjs';
import { CommandModel } from './command.interface';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  message$ = new Subject<CommandModel>();
  constructor(private hubService: HubService) {}

  init() {
    this.addReceiveCommand();
  }

  addReceiveCommand() {
    this.hubService.registerMethods(
      'ReceiveCommand',
      (receivedMessage: string) => {
        this.message$.next(JSON.parse(receivedMessage));
      }
    );
  }

  sendCommand(command) {
    this.hubService.invokeCommand('SendCommand', command);
  }
}
