const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = baseHost + "/api/v1/alex-sopin/instapro";

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function getUserPosts({ token, userId }) {
  return fetch(postsHost + "/user-posts/" + userId, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
      description,
      imageUrl,
    }),
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Server errod");
    }

    if (response.status === 400) {
      throw new Error("Bad request");
    }
  });
}

export function like({ id, token }) {
  return fetch(postsHost + "/" + id + "/like", {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Server error");
      }

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      return response;
    })
    .then((response) => response.json());
}

export function dislike({ id, token }) {
  return fetch(postsHost + "/" + id + "/dislike", {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Server error");
      }

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      return response;
    })
    .then((response) => response.json());
}

export function deletePost({ id, token }) {
  return fetch(postsHost + "/" + id, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Server error");
      }

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      return response;
    })
    .then((response) => response.json());
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("This user already exists");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Wrong login or password");
    }
    return response.json();
  });
}

// upload picture to the clound, returns url of uploaded image
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}
