// Simple HTTP interface

class EasyHTTP {
  redirect(url) {
    window.location.href = url;
  }

  checkStatusCode(response, resData) {
    if (response.status === 403) {
      if (resData.detail.slice(0, 6) === 'Auth: ') {
        this.redirect('/signout?message=' + resData.detail);
      }
      else {
        this.redirect('/?message=' + resData.detail);
      }
    }
  }

  async get(url, id = null) {
    let tgtUrl = url
    if (id) { tgtUrl += '/' + id }
    const response = await fetch(tgtUrl, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const resData = await response.json();
    this.checkStatusCode(response, resData);
    return resData;
  }

  async delete(url, id) {
    await fetch(url + '/' + id, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  async put(url, id, data) {
    let tgtUrl = url
    if (id) { tgtUrl += '/' + id }
    const bodyJson = JSON.stringify(data);
    const response = await fetch(tgtUrl, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: bodyJson
    });
    const resData = await response.json();
    this.checkStatusCode(response, resData);
    return resData;
  }

  async post(url, data) {
    const bodyJson = JSON.stringify(data);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: bodyJson
    });
    const resData = await response.json();
    this.checkStatusCode(response, resData);
    return resData;
  }
}

const http = new EasyHTTP;

