import { Headers } from '@angular/http';

// TODO: Tesing is currently not using this
// Fix: To use mockCSRFHeaders

export function mockCSRFHeaders(): Headers {
  return new Headers({
    'Content-Type': 'application/json',
    'X-CSRFToken': 'WpgvsFvxDhVaLKUX5bqeG4nJEg92RnevjaY9jUF7pTwBAZGXslIT19atGdrYNwq5'
  });
}
