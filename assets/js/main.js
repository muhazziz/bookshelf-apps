document.addEventListener("DOMContentLoaded", () => {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const dialog = document.getElementById("dialog");
  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");

  const BOOKS_KEY = "BOOKSHELF_APPS";
  let books = JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];
  console.log("Books from localStorage:", books);
  let bookToDelete = null;

  const saveBooksToLocalStorage = () => {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  };

  const generateId = () => +new Date();

  const createBookItem = ({ id, title, author, year, isComplete }) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Penulis: ${author}`;

    const bookYear = document.createElement("p");
    bookYear.innerText = `Tahun: ${year}`;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("green");
    toggleButton.innerText = isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    toggleButton.addEventListener("click", () => {
      toggleBookCompletion(id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("blue");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", () => {
      editBook(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", () => {
      bookToDelete = id;
      dialog.classList.remove("hidden");
    });

    actionContainer.append(toggleButton, editButton, deleteButton);
    bookItem.append(bookTitle, bookAuthor, bookYear, actionContainer);

    return bookItem;
  };

  const renderBooks = () => {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    books.forEach((book) => {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelfList.append(bookItem);
      } else {
        incompleteBookshelfList.append(bookItem);
      }
    });
  };

  const addBook = (title, author, year, isComplete) => {
    const newBook = {
      id: generateId(),
      title,
      author,
      year: parseInt(year),
      isComplete,
    };

    books.push(newBook);
    saveBooksToLocalStorage();
    renderBooks();
  };

  const toggleBookCompletion = (id) => {
    const book = books.find((book) => book.id === id);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToLocalStorage();
      renderBooks();
    }
  };

  const removeBook = (id) => {
    books = books.filter((book) => book.id !== id);
    saveBooksToLocalStorage();
    renderBooks();
    dialog.classList.add("hidden");
  };

  const editBook = (id) => {
    const book = books.find((book) => book.id === id);
    if (book) {
      document.getElementById("inputBookTitle").value = book.title;
      document.getElementById("inputBookAuthor").value = book.author;
      document.getElementById("inputBookYear").value = book.year;
      document.getElementById("inputBookIsComplete").checked = book.isComplete;

      removeBook(id);
    }
  };

  inputBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    addBook(title, author, year, isComplete);

    inputBookForm.reset();
  });

  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();

    console.log("Search Title:", searchTitle);

    if (searchTitle) {
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTitle)
      );
      console.log("Filtered Books:", filteredBooks);

      incompleteBookshelfList.innerHTML = "";
      completeBookshelfList.innerHTML = "";

      filteredBooks.forEach((book) => {
        const bookItem = createBookItem(book);
        if (book.isComplete) {
          completeBookshelfList.append(bookItem);
        } else {
          incompleteBookshelfList.append(bookItem);
        }
      });
    } else {
      renderBooks();
    }
  });

  confirmDelete.addEventListener("click", () => {
    if (bookToDelete !== null) {
      removeBook(bookToDelete);
      bookToDelete = null;
    }
  });

  cancelDelete.addEventListener("click", () => {
    dialog.classList.add("hidden");
    bookToDelete = null;
  });

  renderBooks();
});
