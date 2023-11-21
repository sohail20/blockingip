export async function getClientIp() {
  return fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((data) => data.ip);
}
