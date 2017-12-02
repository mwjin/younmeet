import { Headers } from '@angular/http';


export function getCSRFHeaders(): Headers {
  const token = document.cookie.split('csrftoken=')[1].split(';')[0];
  return new Headers({
    'Content-Type': 'application/json',
    'X-CSRFToken': token
  });
}
