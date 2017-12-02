export function getCSRFHeaders(): Headers {
  const cookie = document.cookie.split('csrftoken=')[1].split(';')[0];
  return new Headers({
    'Content-Type': 'application/json',
    'X-CSRFTOKEN': cookie
  });
}
