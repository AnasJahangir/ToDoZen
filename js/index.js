import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  doc,
  setDoc,
  db,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "./config/firebase.js";

const spinner = () => {
  const spinnerHTLM = document.getElementById("spinner");
  if (spinnerHTLM.style.display != "none") {
    spinnerHTLM.style.display = "none";
  } else {
    spinnerHTLM.style.display = "flex";
  }
};

let flag = true;
onAuthStateChanged(auth, (user) => {
  spinner();
  if (user) {
    spinner();
    if (flag) {
      const uid = user.uid;
      location.href = "https://todozenapp.netlify.app/home";
      localStorage.setItem("uid", uid);
    }
  }
});
const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    let pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });
});

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); //preventing form submit
    forms.classList.toggle("show-signup");
  });
});

// JavaScript to handle image upload
document
  .getElementById("uploadFile")
  .addEventListener("change", function (event) {
    let file = event.target.files[0];
    let maxSize = 1024 * 1024; // 1MB in bytes

    if (file) {
      if (file && file.size > maxSize) {
        alert("Please select an image smaller than 1MB.");
        this.value = "";
        document.getElementById("userImage").src =
          "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png";
      } else {
        let reader = new FileReader();
        reader.onload = function (e) {
          document
            .getElementById("userImage")
            .setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  });

document.getElementById("userImage").addEventListener("click", () => {
  document.getElementById("uploadFile").click();
});

const signupBtn = document.getElementById("signup-btn");

const signup = () => {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for basic email validation
  const fullName = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("conformPassword");

  if (fullName.value) {
    if (emailRegex.test(email.value)) {
      if (password.value.length >= 6 && password.value.length <= 8) {
        if (password.value == confirmPassword.value) {
          flag = false;
          signupBtn.disabled = true;
          signupBtn.innerHTML = `
          <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span class="ms-2" role="status">Loading...</span>
          `;
          createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
              const uploadFile = document.getElementById("uploadFile");
              const user = userCredential.user;
              if (uploadFile.files[0]) {
                const storageRef = ref(
                  storage,
                  `userimgs/${user.uid}/${user.uid}`
                );
                const uploadTask = uploadBytesResumable(
                  storageRef,
                  uploadFile.files[0]
                );
                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    const progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    switch (snapshot.state) {
                      case "paused":
                        break;
                      case "running":
                        break;
                    }
                  },
                  (error) => {
                    alert(error);
                    signupBtn.disabled = false;
                    signupBtn.innerHTML = `
                    Signup
                    `;
                  },
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      (downloadURL) => {
                        async function me() {
                          await setDoc(doc(db, "users", user.uid), {
                            name: fullName.value,
                            email: user.email,
                            uid: user.uid,
                            photo: downloadURL,
                          });
                          localStorage.setItem("uid", user.uid);
                          location.href = "https://todozenapp.netlify.app/home";
                          flag = true;
                        }
                        me();
                      }
                    );
                  }
                );
              } else {
                async function me() {
                  await setDoc(doc(db, "users", user.uid), {
                    name: fullName.value,
                    email: user.email,
                    uid: user.uid,
                    photo: null,
                  });
                  localStorage.setItem("uid", user.uid);
                  location.href = "https://todozenapp.netlify.app/home";
                  flag = true;
                }
                me();
              }
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              signupBtn.disabled = false;
              signupBtn.innerHTML = `
              Signup
              `;
              Swal.fire({
                icon: "error",
                title: error,
                text: "Something went wrong!",
              });
            });
        } else {
          Swal.fire({
            icon: "error",
            title: "Passwords do not match.",
            text: "Something went wrong!",
          });
        }
      } else {
        alert("");
        Swal.fire({
          icon: "error",
          title: "Password should be between 6 and 8 characters long.",
          text: "Something went wrong!",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid email address format.",
        text: "Something went wrong!",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Please fill in your name.",
      text: "Something went wrong!",
    });
  }
};

signupBtn.addEventListener("click", () => {
  signup();
});

const signinBtn = document.getElementById("signinBtn");

const signin = () => {
  const email = document.getElementById("lemail");
  const password = document.getElementById("lpassword");
  signinBtn.disabled = true;
  signinBtn.innerHTML = `
  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
  <span class="ms-2" role="status">Loading...</span>
  `;
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("uid", user.uid);
      location.href = "https://todozenapp.netlify.app/home";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      Swal.fire({
        icon: "error",
        title: errorMessage,
        text: "Something went wrong!",
      });
      signinBtn.disabled = false;
      signinBtn.innerHTML = `
  Login
  `;
    });
};

signinBtn.addEventListener("click", () => {
  signin();
});

const googleWith = () => {
  flag = false;
  spinner();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photo: user.photoURL,
        });
        localStorage.setItem("uid", user.uid);
        location.href = "https://todozenapp.netlify.app/home";
        flag = true;
        spinner();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: error,
          text: "Something went wrong!",
        });
      }
    })
    .catch((error) => {
      spinner();
      Swal.fire({
        icon: "error",
        title: error,
        text: "Something went wrong!",
      });
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};
const googleLogin = document.getElementById("googleLogin");

googleLogin.addEventListener("click", () => {
  googleWith();
});

const googleSignup = document.getElementById("googleSignup");

googleSignup.addEventListener("click", () => {
  googleWith();
});
