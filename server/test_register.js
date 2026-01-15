
async function testRegister() {
    try {
        const rand = Math.floor(Math.random() * 1000);
        const data = {
            name: `Test Student ${rand}`,
            email: `student${rand}@test.com`,
            password: 'password123',
            phone: '01000000000',
            parentPhone: '01111111111'
        };

        console.log('Sending data:', data);

        const response = await fetch('http://127.0.0.1:4000/api/auth/register-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', json);
    } catch (error) {
        console.log('Error:', error.message);
    }
}

testRegister();
