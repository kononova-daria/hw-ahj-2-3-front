function urlParameters(parameters) {
  const queryParameters = new URLSearchParams();
  for (const key in parameters.query) {
    if (Object.prototype.hasOwnProperty.call(parameters.query, key)) {
      queryParameters.append(key, parameters.query[key]);
    }
  }
  return `?${queryParameters}`;
}

export default function createRequests(parameters) {
  return new Promise((resolve, reject) => {
    // const URL = 'https://hw-ahj-2-3.herokuapp.com/';
    const URL = 'http://localhost:8120/';
    const xhr = new XMLHttpRequest();

    xhr.open(parameters.method, URL + urlParameters(parameters));
    if (parameters.method === 'POST' || parameters.method === 'PUT') {
      xhr.send(JSON.stringify(parameters.requestBody));
    } else {
      xhr.send();
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          if (xhr.response) {
            const data = JSON.parse(xhr.response);
            resolve(data);
          }
        } catch (e) {
          reject(e);
        }
      } else reject(new Error(`${xhr.status}: ${xhr.responseText}`));
    });
  });
}
