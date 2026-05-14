// ===== LIBRARY MANAGEMENT SYSTEM =====

// ===== BOOK DATABASE =====

let books = JSON.parse(localStorage.getItem("books")) || [

  {
    id: 1,
    title: "C Programming",
    author: "Dennis Ritchie",
    stock: 10,
    category: "C"
  },

  {
    id: 2,
    title: "C++ Basics",
    author: "Bjarne Stroustrup",
    stock: 8,
    category: "C++"
  },

  {
    id: 3,
    title: "Java Mastery",
    author: "James Gosling",
    stock: 6,
    category: "Java"
  },

  {
    id: 4,
    title: "Advanced Java",
    author: "Herbert Schildt",
    stock: 5,
    category: "Java"
  },

  {
    id: 5,
    title: "C# Complete Guide",
    author: "Microsoft",
    stock: 7,
    category: "C#"
  },

  {
    id: 6,
    title: "Data Structures in C",
    author: "Yashwant Kanetkar",
    stock: 9,
    category: "C"
  },

  {
    id: 7,
    title: "OOP with C++",
    author: "Balagurusamy",
    stock: 4,
    category: "C++"
  },

  {
    id: 8,
    title: "Java for Beginners",
    author: "Herbert Schildt",
    stock: 10,
    category: "Java"
  },

  {
    id: 9,
    title: "C# Programming",
    author: "Rob Miles",
    stock: 6,
    category: "C#"
  },

  {
    id: 10,
    title: "Turbo C",
    author: "Kanetkar",
    stock: 5,
    category: "C"
  }

];


// ===== USER ISSUED BOOKS =====
// CURRENT LOGIN USER
const currentUser =
  localStorage.getItem("loggedUser");

// USER WISE BOOKS
let issuedBooks =
  JSON.parse(
    localStorage.getItem(
      "issuedBooks_" + currentUser
    )
  ) || [];
// ===== ISSUE RECORDS =====

let issueRecords =
  JSON.parse(
    localStorage.getItem("issueRecords")
  ) || [];

// ===== SAVE DATA =====

function saveData() {

  localStorage.setItem(
    "books",
    JSON.stringify(books)
  );

  localStorage.setItem(
    "issuedBooks_" + currentUser,
    JSON.stringify(issuedBooks)
  );

  localStorage.setItem(
    "issueRecords",
    JSON.stringify(issueRecords)
  );

}

// ===== SHOW USER PROFILE =====

document.addEventListener("DOMContentLoaded", () => {

  const profileName =
    document.getElementById("profileName");

  const profileId =
    document.getElementById("profileId");

  if (profileName) {

    profileName.innerText =
      localStorage.getItem("loggedUser") || "Guest";

  }

  if (profileId) {

    profileId.innerText =
      localStorage.getItem("userId") || "U000";

  }

});


// ===== RECOMMENDED BOOKS =====

function renderRecommendedBooks() {

  const container =
    document.getElementById("userBookList");

  if (!container) return;

  container.innerHTML = "";

  books.forEach(book => {

    const card =
      document.createElement("div");

    card.className = "book-card";

    card.innerHTML = `

      <h3>${book.title}</h3>

      <p><b>Author:</b> ${book.author}</p>

      <p><b>Category:</b> ${book.category}</p>

      <p><b>Available Stock:</b> ${book.stock}</p>

      <p>
      <b>Status:</b>

      ${book.stock > 0
        ? "Available"
        : "Out Of Stock"}

      </p>

      <button
      onclick="issueBook(${book.id})">

      ${book.stock > 0
        ? "Issue Book"
        : "Unavailable"}

      </button>

    `;

    container.appendChild(card);

  });

}


// ===== ISSUE BOOK =====

function issueBook(id) {

  const book =
    books.find(b => b.id === id);

  if (book.stock <= 0) {

    alert("Book Out Of Stock ❌");

    return;

  }

  book.stock--;

  issuedBooks.push(book);
  // ISSUE DATE
  let today = new Date();

  let issueDate =
    today.toLocaleDateString();

  // RETURN DATE (7 DAYS LATER)

  let returnDay =
    new Date();

  returnDay.setDate(
    returnDay.getDate() + 7
  );

  let returnDate =
    returnDay.toLocaleDateString();

  // SAVE RECORD

  issueRecords.push({

    username: currentUser,

    bookTitle: book.title,

    issueDate: issueDate,

    returnDate: returnDate,

    status: "Pending"

  });

  saveData();

  renderRecommendedBooks();

  renderMyBooks();

  renderAdminBooks();

  alert("Book Issued Successfully 📚");

}


// ===== RETURN BOOK =====

function returnBook(id) {

  const index =
    issuedBooks.findIndex(
      b => b.id === id
    );

  if (index !== -1) {

    const book =
      books.find(b => b.id === id);

    book.stock++;

    issuedBooks.splice(index, 1);
    // UPDATE STATUS

    let record =
      issueRecords.find(r =>

        r.username === currentUser &&

        r.bookTitle === book.title &&

        r.status === "Pending"

      );

    if (record) {

      record.status = "Returned";

    }

    saveData();

    renderRecommendedBooks();

    renderMyBooks();

    renderAdminBooks();

    alert("Book Returned Successfully ✅");

  }

}


// ===== MY BOOKS =====

function renderMyBooks() {

  const container =
    document.getElementById("myBooks");

  if (!container) return;

  container.innerHTML = "";

  if (issuedBooks.length === 0) {

    container.innerHTML = `

      <p
      style="
      color:#3e2723;
      font-size:18px;
      font-weight:bold;">

      No Books Issued Yet 📚

      </p>

    `;

    return;

  }

  issuedBooks.forEach(book => {

    const card =
      document.createElement("div");

    card.className = "book-card";

    card.innerHTML = `

      <h3>${book.title}</h3>

      <p><b>Author:</b> ${book.author}</p>

      <p style="color:red;">
      <b>Status:</b> Issued
      </p>

      <button
      onclick="returnBook(${book.id})">

      Return Book

      </button>

    `;

    container.appendChild(card);

  });

}


// ===== SEARCH BOOK =====

const searchInput =
  document.getElementById("searchInput");

if (searchInput) {

  searchInput.addEventListener("keyup", () => {

    const value =
      searchInput.value.toLowerCase();

    const container =
      document.getElementById("userBookList");

    container.innerHTML = "";

    const filteredBooks =
      books.filter(book =>
        book.title.toLowerCase().includes(value)
      );

    filteredBooks.forEach(book => {

      const card =
        document.createElement("div");

      card.className = "book-card";

      card.innerHTML = `

        <h3>${book.title}</h3>

        <p><b>Author:</b> ${book.author}</p>

        <p><b>Category:</b> ${book.category}</p>

        <p><b>Stock:</b> ${book.stock}</p>

        <button
        onclick="issueBook(${book.id})">

        ${book.stock > 0
          ? "Issue Book"
          : "Unavailable"}

        </button>

      `;

      container.appendChild(card);

    });

  });

}


// ===== ADMIN BOOKS =====

function renderAdminBooks() {

  const container =
    document.getElementById("adminBookList");

  if (!container) return;

  container.innerHTML = "";

  books.forEach(book => {

    const card =
      document.createElement("div");

    card.className = "book-card";

    card.innerHTML = `

      <h3>${book.title}</h3>

      <p><b>Author:</b> ${book.author}</p>

      <p><b>Category:</b> ${book.category}</p>

      <p><b>Stock:</b> ${book.stock}</p>

      <div class="actions">

        <button
        class="delete-btn"
        onclick="deleteBook(${book.id})">

        Delete

        </button>

      </div>

    `;

    container.appendChild(card);

  });

}


// ===== DELETE BOOK =====

function deleteBook(id) {

  books =
    books.filter(book => book.id !== id);

  saveData();

  renderAdminBooks();

}


// ===== ADD BOOK =====

const adminForm =
  document.getElementById("adminBookForm");

if (adminForm) {

  adminForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const title =
      document.getElementById("bookTitle").value;

    const author =
      document.getElementById("bookAuthor").value;

    const stock =
      document.getElementById("bookStock").value;

    const category =
      document.getElementById("bookCategory").value;

    books.push({

      id: Date.now(),

      title: title,

      author: author,

      stock: Number(stock),

      category: category

    });

    saveData();

    renderAdminBooks();

    adminForm.reset();

    alert("Book Added Successfully ✅");

  });

}


// ===== INITIAL RENDER =====

document.addEventListener("DOMContentLoaded", () => {

  renderRecommendedBooks();

  renderMyBooks();

  renderAdminBooks();

  renderIssueRecords();

});
// ===== ISSUE RECORD TABLE =====

function renderIssueRecords() {

  const tableBody =
    document.getElementById(
      "recordTableBody"
    );

  if (!tableBody) return;

  tableBody.innerHTML = "";

  issueRecords.forEach(record => {

    tableBody.innerHTML += `

      <tr>

        <td>${record.username}</td>

        <td>${record.bookTitle}</td>

        <td>${record.issueDate}</td>

        <td>${record.returnDate}</td>

        <td class="${record.status === "Pending"
        ? "pending"
        : "returned"
      }">

        ${record.status}

        </td>

      </tr>

    `;

  });

}