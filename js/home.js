import {
  auth,
  doc,
  collection,
  addDoc,
  db,
  onAuthStateChanged,
  signOut,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy,
  deleteDoc,
  updateDoc,
  deleteUser,
} from "./config/firebase.js";

const todosId = [];

const spinner = (flag) => {
  const spinnerHTLM = document.getElementById("spinner");
  if (!flag) {
    spinnerHTLM.style.display = "none";
  } else {
    spinnerHTLM.style.display = "flex";
  }
};

spinner(true);

onAuthStateChanged(auth, async (user) => {
  spinner(true);
  if (!user) {
    localStorage.clear();
    location.href = "./index.html";
  } else {
    const docRef = doc(db, "users", user.uid);
    const q = query(collection(docRef, "todos"), orderBy("time"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const todos = document.getElementById("incomplete-tasks");
          todos.innerHTML += `  
          <li>
          <input type="checkbox" ${
            change.doc.data().task ? "" : "checked "
          } onclick="taskCheck('${change.doc.id}',this)">
          <label class="${change.doc.data().task ? "" : "completed-label"}">${
            change.doc.data().value
          }</label>
          <input type="text" class="form-control" value="${
            change.doc.data().value
          }">
          <button class="btn btn-primary m-0 mx-3"  onclick="editTodo('${
            change.doc.id
          }',this)">Edit</button>
          <button class="btn btn-danger m-0" onclick="deleteTodo('${
            change.doc.id
          }',this)">Delete</button>
          </li>
          `;
          todosId.push(change.doc.id);
        }
      });
    });
    try {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const { email, name, photo, uid } = docSnap.data();
        const userImg = document.getElementById("homeUserImg");
        const userName = document.getElementById("userName");
        userName.innerText = `${name}`;
        if (photo) {
          userImg.src = `${photo}`;
        }
      } else {
        spinner(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }

  spinner(false);
});

const addTodoBtn = document.getElementById("addTodos");

const addTodo = async () => {
  const taskValue = document.getElementById("new-task");
  const uid = localStorage.getItem("uid");
  if (taskValue.value) {
    const docRef = doc(db, "users", uid);
    const colRef = collection(docRef, "todos");
    addDoc(colRef, {
      value: taskValue.value,
      time: serverTimestamp(),
      task: true,
    });
    taskValue.value = "";
  }
};

addTodoBtn.addEventListener("click", () => {
  addTodo();
});

const deleteTodo = async (id, btn) => {
  btn.parentElement.remove();
  try {
    const uid = localStorage.getItem("uid");
    const docRef = doc(db, "users", uid, "todos", id);
    await deleteDoc(docRef);
  } catch (error) {}
};

const editTodo = async (id, btn) => {
  // const updateValue = prompt(
  //   "Enter New Value",
  //   btn.parentElement.children[1].innerText
  // );
  if (
    btn.parentElement.classList.contains("editMode") &&
    btn.parentElement.children[2].value.trim()
  ) {
    btn.parentElement.classList.remove("editMode");
    btn.innerText = "Edit";

    btn.parentElement.children[1].innerText =
      btn.parentElement.children[2].value.trim();
    try {
      const uid = localStorage.getItem("uid");
      const docRef = doc(db, "users", uid, "todos", id); // Reference to the specific todo document
      await updateDoc(docRef, {
        value: btn.parentElement.children[2].value.trim(),
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  } else {
    btn.innerText = "Update";
    btn.parentElement.classList.add("editMode");
  }
};

const deleteAll = () => {
  spinner(true);
  document.getElementById("incomplete-tasks").innerHTML = "";
  let myPromise = new Promise(async function (myResolve, myReject) {
    const uid = localStorage.getItem("uid");
    try {
      for (let i = 0; i < todosId.length; i++) {
        const docRef = doc(db, "users", uid, "todos", todosId[i]);
        await deleteDoc(docRef);
      }
    } catch (error) {
      myReject(error);
    }
    myResolve("hogaya");
    myReject("nhi Hoya");
  });

  myPromise.then(
    (value) => {
      spinner(false);
    },
    (value) => {
      spinner(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  );
};

const deleteAllBtn = document.getElementById("deleteAll");
deleteAllBtn.addEventListener("click", () => {
  deleteAll();
});

const signoutbtn = document.getElementById("signout");

signoutbtn.addEventListener("click", () => {
  Swal.fire({
    title: "Do you want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0a58ca",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Yes, logout it!",
  }).then((result) => {
    if (result.isConfirmed) {
      signOut(auth)
        .then(() => {
          localStorage.clear();
          location.href = "./index.html";
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    }
  });
});

const taskCheck = async (id, check) => {
  if (check.parentElement.children[1].classList.contains("completed-label")) {
    try {
      check.parentElement.children[1].classList.remove("completed-label");
      const uid = localStorage.getItem("uid");
      const docRef = doc(db, "users", uid, "todos", id);
      await updateDoc(docRef, {
        task: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  } else {
    try {
      check.parentElement.children[1].classList.add("completed-label");
      const uid = localStorage.getItem("uid");
      const docRef = doc(db, "users", uid, "todos", id); // Reference to the specific todo document
      await updateDoc(docRef, {
        task: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }
};

window.deleteTodo = deleteTodo;
window.editTodo = editTodo;
window.deleteAll = deleteAll;
window.taskCheck = taskCheck;
