import {
  addPost,
  deletePost,
  dislike,
  getPosts,
  getUserPosts,
  like,
} from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();

export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const toggleUserLike = ({ postId }) => {
  const index = posts.findIndex((post) => post.id === postId);

  if (posts[index].isLiked) {
    dislike({ token: getToken(), id: postId }).then((updatedPost) => {
      posts[index].likes = updatedPost.post.likes;
      posts[index].isLiked = false;
      renderApp();
    });
  } else {
    like({ token: getToken(), id: postId }).then((updatedPost) => {
      posts[index].likes = updatedPost.post.likes;
      posts[index].isLiked = true;
      renderApp();
    });
  }
};

export const deleteUserPost = ({ postId }) => {
  deletePost({
    id: postId,
    token: getToken(),
  }).then(() => {
    goToPage(POSTS_PAGE);
  });
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getUserPosts({ token: getToken(), userId: data.userId }).then(
        (newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        }
      );
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("page doesn't exist");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      user,
      goToPage,
      onAddPostClick({ description, imageUrl }) {
        goToPage(LOADING_PAGE);

        addPost({
          token: getToken(),
          description,
          imageUrl,
        })
          .then(() => {
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.error(error);
            goToPage(ADD_POSTS_PAGE);
            alert(error.message);
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      user,
      goToPage,
      posts,
      singleUserView: false,
      toggleLike: toggleUserLike,
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      user,
      goToPage,
      posts,
      singleUserView: true,
      toggleLike: toggleUserLike,
    });
  }
};

goToPage(POSTS_PAGE);
