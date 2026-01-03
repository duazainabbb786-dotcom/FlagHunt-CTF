const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: body });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function test() {
    const user = JSON.stringify({
        name: "Test User",
        email: "test" + Date.now() + "@test.com",
        password: "password123"
    });

    console.log("Testing Register...");
    try {
        const regRes = await postRequest('/register', user);
        console.log("Register Status:", regRes.statusCode);
        console.log("Register Body:", regRes.body);

        if (regRes.statusCode === 201) {
            console.log("Testing Login...");
            const loginData = JSON.stringify({
                email: JSON.parse(user).email,
                password: "password123"
            });
            const loginRes = await postRequest('/login', loginData);
            console.log("Login Status:", loginRes.statusCode);
            console.log("Login Body:", loginRes.body);
        }

    } catch (e) {
        console.error("Register Error:", e);
    }
}

test();
