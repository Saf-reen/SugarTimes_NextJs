import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/auth/send-email-otp', {
      email: 'nithin21091a05a5@gmail.com', // use a registered test email
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Message:", err.message);
  }
}

test();
