document.addEventListener('DOMContentLoaded', function () {
  document
    .querySelector('form')
    .addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent form submission

      const email = document.getElementById('email').value;
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
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          const successModal = new bootstrap.Modal(
            document.getElementById('loginModal'),
            {
              keyboard: false,
            }
          );

          // Show the success modal
          successModal.show();

          // Redirect to the main.html page after modal is displayed
          setTimeout(function () {
            window.location.href = '../home/home.html';
          }, 2000); // 2-second delay before redirecting
        } else {
          const errorModal = new bootstrap.Modal(
            document.getElementById('errorModal'),
            {
              keyboard: false,
            }
          );

          // Show the error modal
          errorModal.show();
        }
      })
      .catch((error) => {
        console.error('Error validating user:', error);
        const errorModal = new bootstrap.Modal(
          document.getElementById('errorModal'),
          {
            keyboard: false,
          }
        );

        // Show the error modal
        errorModal.show();
      });
    });
});