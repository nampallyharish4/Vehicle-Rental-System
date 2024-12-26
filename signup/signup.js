document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      alert('All fields are required.');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Submit the form
    alert('Signup successful! Redirecting...');
    setTimeout(function () {
      form.submit(); // Submit the form to the server
    }, 2000); // Optional delay before submission
  });
});
