export function getCSRFHeaders(): Headers {
  let cookie = document.cookie.split('csrftoken=')[1].split(';')[0];
  console.log(cookie);
  return new Headers({
    'Content-Type': 'application/json',
    'X-CSRFToken': cookie
  });
}
