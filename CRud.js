const API_URL = "https://67920e29cf994cc680487b7f.mockapi.io/data";
const form = document.getElementById("data-form");
const dataList = document.getElementById("data-list");

// Fetch and display data
async function fetchData() {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderData(data);
}

// Render data with an additional column for images
function renderData(data) {
    dataList.innerHTML = `
    <li class="table-header">
      <span>ID</span>
      <span>Name</span>
      <span>Email</span>
      <span>Image</span>
      <span>Actions</span>
    </li>
  `; // Table header row

  data.reverse().map((item, index) => {
        const li = document.createElement("li");
        li.classList.add("table-row");
        li.innerHTML = `
      <span>${index + 1}</span>
      <span>${item.name}</span>
      <span>${item.email}</span>
      <span><img src="${item.image}" alt="${item.name}" class="table-image" /></span>
      <span>
        <button class="edit" onclick="editData(${item.id}, '${item.name}', '${item.email}', '${item.image}')">Edit</button>
        <button class="delete" onclick="deleteData(${item.id})">Delete</button>
      </span>
    `;
        dataList.appendChild(li);
    });
}


// Convert image file to Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);  // Resolve with Base64 string
        reader.onerror = (error) => reject(error);    // Reject if error occurs
        reader.readAsDataURL(file);                   // Convert image to Base64
    });
}

// Add or update data
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const imageFile = document.getElementById("image").files[0]; // Get selected file

    let image = "";
    if (imageFile) {
        image = await convertToBase64(imageFile); // Convert the image to Base64 if a file is selected
    }

    const body = { name, email, image };

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    }

    form.reset();
    fetchData();
});

// Delete data
async function deleteData(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchData();
}

// Edit data
function editData(id, name, email, image) {
    document.getElementById("id").value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    // For editing, you'll want to let users update the image as well, so reset the file input:
    document.getElementById("image").value = "";  // Clear file input (users can upload a new image)
}

// Initialize
fetchData();
