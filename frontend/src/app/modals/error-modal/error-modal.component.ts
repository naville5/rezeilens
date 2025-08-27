import { Component, Input } from '@angular/core';
import { KTModal } from '../../../metronic/core';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
})
export class ErrorModalComponent {
  @Input() message!: string;

  show() {
    const modalEl = document.getElementById('error_modal');
    const modal = KTModal.getInstance(modalEl);

    if (modal) {
      modal.show();
    } else {
      console.error('KTModal instance not found.');
    }
  }

  hide() {
    const modalEl = document.getElementById('error_modal');
    const modal = KTModal.getInstance(modalEl);

    if (modal) {
      modal.hide();
    } else {
      console.error('KTModal instance not found.');
    }
  }

  get getMessage() {
    return this.message;
  }

  ngoninit() {}
}
