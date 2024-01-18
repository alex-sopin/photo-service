import { goToPage, logout, user } from "../index.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";
import { sanitizeHtml } from "../helpers.js";

export function renderHeaderComponent({ element }) {
  element.innerHTML = `
  <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      ${user ? `<div title="Add post" class="add-post-sign"></div>` : "Log In"}
      </button>
      ${
        user
          ? `<button title="${sanitizeHtml(
              user.name
            )}" class="header-button logout-button">Log out</button>`
          : ""
      }  
      </button>
  </div>
  
`;

  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".logout-button")?.addEventListener("click", logout);

  return element;
}
