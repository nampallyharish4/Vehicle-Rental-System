document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate password length
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return; // Stop execution if password is invalid
    }

    // Send request to server to validate email and password
    fetch('/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
          alert('Login successful! Redirecting to the homepage...');
          setTimeout(() => {
            window.location.href = '../home/home.html'; // Redirect to the home page
          }, 2000); // 2-second delay
        } else {
          alert('Invalid email or password. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error validating user:', error);
        alert('An error occurred during login. Please try again later.');
      });
  });
});