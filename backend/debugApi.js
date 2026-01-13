import http from 'http';
import fs from 'fs';

const getDoctors = () => {
    const req = http.get('http://localhost:5002/api/doctors', (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            fs.writeFileSync('debug_output.txt', '--- DOCTORS LIST ---\n' + data + '\n');

            try {
                const json = JSON.parse(data);
                if (json.doctors && json.doctors.length > 0) {
                    const firstId = json.doctors[0]._id;
                    fs.appendFileSync('debug_output.txt', `\nFirst Doctor ID found: ${firstId}\n`);
                    fetchDoctor(firstId);
                } else {
                    fs.appendFileSync('debug_output.txt', '\nNo doctors found in data array\n');
                }
            } catch (e) {
                fs.appendFileSync('debug_output.txt', `\nError parsing JSON: ${e.message}\n`);
            }
        });
    });

    req.on('error', (err) => {
        fs.writeFileSync('debug_output.txt', `Error fetching doctors: ${err.message}`);
    });
};

const fetchDoctor = (id) => {
    const req = http.get(`http://localhost:5002/api/doctors/${id}`, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            fs.appendFileSync('debug_output.txt', '\n--- INDIVIDUAL DOCTOR ---\nStatus: ' + res.statusCode + '\n' + data);
        });
    });
    req.on('error', (err) => {
        fs.appendFileSync('debug_output.txt', `\nError fetching single doctor: ${err.message}`);
    });
}

getDoctors();
