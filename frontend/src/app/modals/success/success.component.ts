import { Component, Input, SimpleChanges } from '@angular/core';
import { KTModal } from '../../../metronic/core';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent {

  @Input() message!: string;


  show() {
    const modalEl = document.getElementById('success_modal');
    const modal = KTModal.getInstance(modalEl);
        if (modal) {

          modal.show();


        } else {
          console.error('KTModal instance not found.');
        }
  }

  
  hide() {
    const modalEl = document.getElementById('success_modal');
    const modal = KTModal.getInstance(modalEl);

    if (modal) {
      modal.hide();
      this.message = '';
    } else {
      console.error('KTModal instance not found.');
    }
  }

  get getMessage() {
    return this.message;
  }

 
}
