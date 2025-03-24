The Login.jsx file is a crucial part of the web application's authentication system. It is designed to handle user login functionality, providing a seamless and secure way for users to access their accounts. This component leverages several libraries and hooks to manage form state, handle form submission, and provide user feedback. Below is a detailed explanation of the code and its functionality.

Import Statements
The component begins by importing essential libraries and modules:

React: The core library for building user interfaces.
axios: A promise-based HTTP client for making API requests.
formik: A library for managing form state and validation.
useNavigate: A hook from react-router-dom for programmatic navigation.
Swal: SweetAlert2, a library for creating beautiful, customizable alert dialogs.
Login.css: A CSS file for styling the login component.
Component Definition
The Login function is a React functional component. It uses the useNavigate hook to get a navigation function that allows for programmatic navigation. This is essential for redirecting users to different parts of the application after successful login.

Alert Function
The component configures a Toast constant using SweetAlert2 to create toast notifications. These notifications appear at the top-right corner of the screen and disappear after 2 seconds. The didOpen function adds event listeners to pause and resume the timer when the user hovers over the toast. This provides a user-friendly way to display success or error messages.


initialValues: Sets the initial values for the form fields, specifically the email and password fields.
validate: A function that validates the form values. It checks if the password is at least 8 characters long and returns an error message if it is not. This ensures that users provide a sufficiently strong password.
onSubmit: An asynchronous function that handles form submission. It makes a POST request to the login API endpoint using axios. If the login is successful and a token is received, the token is stored in localStorage, a success toast is displayed, and the user is navigated to the home page. If the login fails, an error toast is displayed. This function ensures that the login process is secure and provides immediate feedback to the user.
JSX Structure
The component returns a JSX structure that includes several elements:

login-container: A div that wraps the entire login component, providing a container for styling purposes.
login-card: A div that contains the login form and additional elements, styled to look like a card.
h2: A heading that welcomes the user, making the interface more friendly and inviting.
form: The login form. It uses login.handleSubmit to handle form submission. This form includes:
input (Email): An input field for the email address. It uses login.values.Email for its value and login.handleChange to handle changes. This ensures that the form state is managed by Formik.
input (Password): An input field for the password. It uses login.values.Password for its value and login.handleChange to handle changes. This field is also managed by Formik.
span: A span that displays validation errors for the password field. This provides immediate feedback to the user if the password does not meet the validation criteria.
input (Submit): A submit button for the form. This button triggers the form submission process.
formFooter: A div that contains links for password recovery and account creation. These links provide additional options for users who may have forgotten their password or need to create a new account.
text-center: A div that displays example login credentials for testing purposes. This is useful for demonstration purposes and helps users understand the expected input format.
