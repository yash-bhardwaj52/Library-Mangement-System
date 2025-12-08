/* ===== script.js ===== */
// Fake book data
let books = [
  {id:1, title:"The Great Gatsby", author:"F. Scott Fitzgerald", status:"Available", desc:"A novel set in the Jazz Age about wealth, love, and the American Dream."},
  {id:2, title:"1984", author:"George Orwell", status:"Issued", desc:"A dystopian novel about totalitarian regime and surveillance."},
  {id:3, title:"To Kill a Mockingbird", author:"Harper Lee", status:"Available", desc:"A classic novel about race and justice in the Deep South."}
];

// Render books for user dashboard
function renderUserBooks(){
  const container = document.getElementById("userBookList");
  if(!container) return;
  container.innerHTML = "";
  books.forEach(book => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3><a href="bookDetails.html?id=${book.id}">${book.title}</a></h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Status:</strong> ${book.status}</p>
      ${book.status === 'Available' ? `<button onclick="issueBook(${book.id})">Issue</button>` : `<button onclick="returnBook(${book.id})">Return</button>`}
    `;
    container.appendChild(card);
  });
}

// Issue/Return functions
function issueBook(id){
  const book = books.find(b => b.id === id);
  if(book) book.status = "Issued";
  renderUserBooks();
}
function returnBook(id){
  const book = books.find(b => b.id === id);
  if(book) book.status = "Available";
  renderUserBooks();
}

// Search filter
const searchInput = document.getElementById("searchInput");
if(searchInput){
  searchInput.addEventListener("keyup", () => {
    const val = searchInput.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(val) ? "block" : "none";
    });
  });
}

// Render admin book list
function renderAdminBooks(){
  const container = document.getElementById("adminBookList");
  if(!container) return;
  container.innerHTML = "";
  books.forEach(book => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Status:</strong> ${book.status}</p>
      <button onclick="deleteBook(${book.id})">Delete</button>
    `;
    container.appendChild(card);
  });
}

function deleteBook(id){
  books = books.filter(b => b.id !== id);
  renderAdminBooks();
}

// Add new book from admin form
const adminForm = document.getElementById("adminBookForm");
if(adminForm){
  adminForm.addEventListener("submit", e => {
    e.preventDefault();
    let title = document.getElementById("bookTitle").value;
    let author = document.getElementById("bookAuthor").value;
    books.push({id: Date.now(), title, author, status:"Available", desc:"New Book"});
    adminForm.reset();
    renderAdminBooks();
  });
}

// Book Details page
function renderBookDetails(){
  const container = document.getElementById("bookDetailsContainer");
  if(!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const book = books.find(b => b.id === id);
  if(book){
    container.innerHTML = `
      <h1>${book.title}</h1>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Description:</strong> ${book.desc}</p>
      <p><strong>Status:</strong> ${book.status}</p>
      ${book.status === 'Available' ? `<button onclick="issueBook(${book.id})">Issue</button>` : `<button onclick="returnBook(${book.id})">Return</button>`}
    `;
  } else {
    container.innerHTML = `<p>Book not found.</p>`;
  }
}

// Run renders depending on page
document.addEventListener("DOMContentLoaded", () => {
  renderUserBooks();
  renderAdminBooks();
  renderBookDetails();
});
