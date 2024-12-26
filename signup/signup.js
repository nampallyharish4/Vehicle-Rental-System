document.addEventListener('DOMContentLoaded', function () {
    document
      .querySelector('form')
      .addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword =
          document.getElementById('confirmPassword').value;

        // Validate inputs
        if (
          name === '' ||
          email === '' ||
          password === '' ||
          confirmPassword === ''
        ) {
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
          const errorModal = new bootstrap.Modal(
            document.getElementById('errorModal'),
            { keyboard: false }
          );

          // Show the error modal for password mismatch
          errorModal.show();
          return;
        }

        // Simulate successful registration (Replace with server-side logic)
        const successModal = new bootstrap.Modal(
          document.getElementById('registerModal'),
          { keyboard: false }
        );

        // Show the success modal
        successModal.show();

        // Redirect to login.html after registration
        setTimeout(function () {
          window.location.href = '../home/home.html';
        }, 2000); // 2-second delay before redirecting
      });
  });