// Simple HTTP interface

class EasyHTTP {
    async redirect(url) {
        window.location.href = url;
    }

    async get(url, id = null) {
        let tgtUrl = url
        if (id) { tgtUrl += '/' + id }
        let userToken = getCookie('userToken');
        const response = await fetch(tgtUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': userToken
            }
        });
        const resData = await response.json();
        return resData;
    }

    async delete(url, id) {
        let userToken = getCookie('userToken');
        await fetch(url + '/' + id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': userToken
            }
        });
    }

    async put(url, id, data) {
        const bodyJson = JSON.stringify(data);
        let userToken = getCookie('userToken');
        const response = await fetch(url + '/' + id, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': userToken
            },
            body: bodyJson
        });
        const resData = await response.json();
        return resData;
    }

    async post(url, data) {
        const bodyJson = JSON.stringify(data);
        let userToken = getCookie('userToken');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': userToken
            },
            body: bodyJson
        });
        const resData = await response.json();
        return resData;
    }
}

const http = new EasyHTTP;


function setCookie(cname, cvalue, exmins, additionalOptions) {
  const d = new Date();
  d.setTime(d.getTime() + (exmins * 60 * 1000));
  let expires = "expires = " + d.toUTCString();
  let cookie_str = cname + " = " + cvalue + " ; path = /; " + expires + "; " + additionalOptions;
  document.cookie = cookie_str;
}


function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


