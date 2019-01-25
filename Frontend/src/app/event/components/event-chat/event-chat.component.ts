import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Chat } from '../../../models/chat.model';

@Component({
  selector: 'app-event-chat',
  templateUrl: './event-chat.component.html',
  styleUrls: ['./event-chat.component.scss']
})
export class EventChatComponent implements OnInit {
  @Input() chats: Chat[];
  @Output() message = new EventEmitter<string>();
  messageForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createMessageForm();
  }

  createMessageForm() {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  sendMessage() {
    this.message.emit(this.messageForm.getRawValue());
    this.messageForm.reset();
  }

}
