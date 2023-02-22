// Simple HTTP interface

class EasyHTTP {
    async redirect(url) {
        window.location.href = url;
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
        if (response.status === 403) this.redirect('/signout');
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
        const bodyJson = JSON.stringify(data);
        const response = await fetch(url + '/' + id, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: bodyJson
        });
        const resData = await response.json();
        if (response.status === 403) this.redirect('/signout');
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
        if (response.status === 403) this.redirect('/signout');
        return resData;
    }
}

const http = new EasyHTTP;

