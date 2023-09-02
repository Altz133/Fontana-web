import {Injectable} from '@angular/core';
import {API_CONFIG} from '../../api-config/api-config';
import {BackendRequestService} from "../../services/backend-request.service";

@Injectable({
  providedIn: 'root'
})
export class PanicButtonService {

  constructor(private backendRequestService: BackendRequestService) {
  }

  closeConnection() {
    return this.backendRequestService.requestPOST(`${API_CONFIG.PANIC_BUTTON}`, {});
  }
}
