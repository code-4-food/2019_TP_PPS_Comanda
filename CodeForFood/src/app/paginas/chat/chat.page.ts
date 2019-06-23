import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { ChatsService } from 'src/app/servicios/chats.service';
import { MessagingService } from "../../servicios/messaging.service";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  message;

  constructor(private messagingService: MessagingService) { }

  ngOnInit() {
    const userId = '1ClIQ2pnLecjg8mOVn0rEHVsP6n1';
    this.messagingService.requestPermission(userId)
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage
  }

}
