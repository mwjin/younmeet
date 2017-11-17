export function getCSRFHeaders(): Headers {
  let cookie = document.cookie.split('=')[1];
  console.log(cookie);
  return new Headers({
    'Content-Type': 'application/json',
    'X-CSRFTOKEN': cookie
  });
}
