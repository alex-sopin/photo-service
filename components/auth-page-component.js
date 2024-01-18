import { loginUser, registerUser } from "../api.js";
import { POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAuthPageComponent({ appEl, setUser, user, goToPage }) {
  let isLoginMode = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${
                  isLoginMode
                    ? "Log In in&nbsp;Instapro"
                    : "Sign Up in&nbsp;Instapro"
                }
                </h3>
              <div class="form-inputs">
    
                  ${
                    !isLoginMode
                      ? `
                      <div class="upload-image-container"></div>
                      <input type="text" id="name-input" class="input" placeholder="Name" />
                      `
                      : ""
                  }
                  
                  <input type="text" id="login-input" class="input" placeholder="Login" />
                  <input type="password" id="password-input" class="input" placeholder="Password" />
                  
                  <div class="form-error"></div>
                  
                  <button class="button" id="login-button">${
                    isLoginMode ? "Log In" : "Sing up"
                  }</button>
              </div>
            
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? "Don't have an account?" : "Have an account?"}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? "Sign Up." : "Log In."}
                  </button>
                </p> 
               
              </div>
          </div>
      </div>    
`;

    appEl.innerHTML = appHtml;

    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user,
      goToPage,
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("login-button").addEventListener("click", () => {
      setError("");

      if (isLoginMode) {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;

        if (!login) {
          alert("Enter login");
          return;
        }

        if (!password) {
          alert("Enter password");
          return;
        }

        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      } else {
        const login = document.getElementById("login-input").value;
        const name = document.getElementById("name-input").value;
        const password = document.getElementById("password-input").value;
        if (!name) {
          alert("Enter name");
          return;
        }
        if (!login) {
          alert("Enter login");
          return;
        }

        if (!password) {
          alert("Enter password");
          return;
        }

        registerUser({
          login: login,
          password: password,
          name: name,
          imageUrl,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      }
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };

  renderForm();
}
