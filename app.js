const API_BASE = "https://crudcrud.com/api/d0deb085bc304001873386f22b2b938b/candystore"; // Replace with your CrudCrud endpoint

const form = document.getElementById("candy-form");
const candyList = document.getElementById("candy-list");
const status = document.getElementById("status");

// Add candy
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const candy = {
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    price: parseFloat(document.getElementById("price").value),
    quantity: parseInt(document.getElementById("quantity").value)
  };

  try {
    await axios.post(API_BASE, candy);
    form.reset();
    loadCandies();
    setStatus("Candy added!", "success");
  } catch (err) {
    setStatus("Error adding candy", "error");
  }
});

// Load candies
async function loadCandies() {
  try {
    const res = await axios.get(API_BASE);
    renderCandies(res.data);
  } catch (err) {
    setStatus("Error loading candies", "error");
  }
}

// Render table
function renderCandies(candies) {
  candyList.innerHTML = "";
  candies.forEach(candy => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${candy.name}</td>
      <td>${candy.description}</td>
      <td>${candy.price.toFixed(2)}</td>
      <td>${candy.quantity}</td>
      <td>
        <button onclick="buyCandy('${candy._id}', ${candy.quantity}, 1)">Buy1</button>
        <button onclick="buyCandy('${candy._id}', ${candy.quantity}, 2)">Buy2</button>
        <button onclick="buyCandy('${candy._id}', ${candy.quantity}, 3)">Buy3</button>
      </td>
    `;

    candyList.appendChild(tr);
  });
}

// Buy logic
async function buyCandy(id, currentQty, amount) {
  if (currentQty < amount) {
    setStatus("Not enough stock!", "error");
    return;
  }

  try {
    const res = await axios.get(`${API_BASE}/${id}`);
    const updated = { ...res.data, quantity: res.data.quantity - amount };
    delete updated._id; // CrudCrud requires _id to be removed before PUT

    await axios.put(`${API_BASE}/${id}`, updated);
    loadCandies();
    setStatus(`Bought ${amount} candy!`, "success");
  } catch (err) {
    setStatus("Error buying candy", "error");
  }
}

// Status helper
function setStatus(msg, type) {
  status.textContent = msg;
  status.style.color = type === "error" ? "red" : "green";
}

// Initial load
loadCandies();