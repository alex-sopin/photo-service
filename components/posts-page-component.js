import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, toggleUserLike, user } from "../index.js";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { sanitizeHtml } from "../helpers.js";

export function renderPostsPageComponent({ appEl, singleUserView }) {
  const tasksHtml = posts
    .map((post) => {
      return `
          <li class="post">
          ${
            singleUserView
              ? ""
              : `
          <div class="post-header" data-user-id="${post.user.id}">
                <img src="${
                  post.user.imageUrl
                }" class="post-header__user-image">
                <p class="post-header__user-name">${sanitizeHtml(
                  post.user.name
                )}</p>
            </div>
          `
          }
            
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.id}" class="like-button">
                ${
                  post.isLiked
                    ? '<img src="./assets/images/like-active.svg">'
                    : '<img src="./assets/images/like-not-active.svg">'
                }
              </button>
              <p class="post-likes-text">
                Liked by   ${
                  post.likes.length < 2
                    ? `<strong>${
                        post.likes.length === 0
                          ? "0"
                          : post.likes.map(({ name }) => name).join(", ")
                      }</strong>`
                    : `<strong>${
                        post.likes[
                          Math.floor(Math.random() * post.likes.length)
                        ].name
                      }</strong> и <strong>and ${(
                        post.likes.length - 1
                      ).toString()}</strong>`
                }
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${sanitizeHtml(post.user.name)}</span>
              ${sanitizeHtml(post.description)}
            </p>
            <p class="post-date">
              ${formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: "ago",
              })} 
            </p>
          </li>`;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>

                ${
                  singleUserView && posts[0]
                    ? ` <div class="posts-user-header">
                    <img src="${
                      posts[0].user.imageUrl
                    }" class="posts-user-header__user-image">
                    <p class="posts-user-header__user-name">${sanitizeHtml(
                      posts[0].user.name
                    )}</p>
                </div>`
                    : ""
                }

                ${posts.length === 0 ? "There is no posts" : ""}

                <ul class="posts">
                <!-- Posts list is rendered by JS -->
                ${tasksHtml}
                
                </ul>
                <br />
               
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      if (!user) {
        alert("Only authorized users can add likes");
        return;
      }
      toggleUserLike({ postId: likeEl.dataset.postId });
    });
  }
}
