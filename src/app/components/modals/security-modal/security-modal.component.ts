import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-security-modal',
  templateUrl: './security-modal.component.html',
  styleUrls: ['./security-modal.component.scss']
})
export class SecurityModalComponent {
  @Output() close = new EventEmitter<void>();
}
