document.addEventListener("DOMContentLoaded", function () {
    const inputBookTitle = document.getElementById("inputBookTitle");
    const inputBookAuthor = document.getElementById("inputBookAuthor");
    const inputBookYear = document.getElementById("inputBookYear");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const bookSubmit = document.getElementById("bookSubmit");
    const bookRead = document.getElementById("bookRead")
    const searchBookTitle = document.getElementById("searchBookTitle");
    const searchSubmit = document.getElementById("searchSubmit");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    // Menginisiasi variabel buku dari localStorage atau menginiasi sendiri jika belum ada
    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Menampilkan buku pada tiap rak berdasarkan nilai key isComplete
    function displayBookshelf(filteredBooks = books) {
        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        // Menambahkan elemen html untuk item buku tiap bookshelf
        filteredBooks.forEach((book) => {
            const bookItem = document.createElement("article");
            bookItem.classList.add("book_item");
            const bookTitle = document.createElement("h3");
            bookTitle.textContent = book.title;
            const author = document.createElement("p");
            author.textContent = `Penulis: ${book.author}`;
            const year = document.createElement("p");
            year.textContent = `Tahun: ${book.year}`;
            const action = document.createElement("div");
            action.classList.add("action");

            const moveButton = document.createElement("button");
            moveButton.classList.add("green");
            moveButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
            moveButton.addEventListener("click", () => {
                toggleReadStatus(book.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("red");
            deleteButton.textContent = "Hapus buku";
            deleteButton.addEventListener("click", () => {
                deleteBook(book.id);
            });

            action.appendChild(moveButton);
            action.appendChild(deleteButton);

            bookItem.appendChild(bookTitle);
            bookItem.appendChild(author);
            bookItem.appendChild(year);
            bookItem.appendChild(action);

            // Menambahkan buku sesuai dengan bookshelf (isComplate)
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        });
    }

    // Menambahkan buku baru
    function addBook(title, author, year, isComplete) {
        const newBook = {
            id: +new Date(), // timestamp saat ini dalam milidetik sejak "epoch (1/1/1970)"
            title,
            author,
            year,
            isComplete,
        };
        books.push(newBook);
        localStorage.setItem("books", JSON.stringify(books));
        displayBookshelf();
    }

    // Menghapus buku
    function deleteBook(bookId) {
        const bookIndex = books.findIndex((book) => book.id === bookId);
        if (bookIndex !== -1) {
            const isConfirmed = confirm("Anda yakin ingin menghapus buku ini?");
            if (isConfirmed) {
                books.splice(bookIndex, 1);
                localStorage.setItem("books", JSON.stringify(books));
                displayBookshelf();
            }
        }
    }

    // mengganti status membaca buku
    function toggleReadStatus(bookId) {
        const bookIndex = books.findIndex((book) => book.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = !books[bookIndex].isComplete;
            localStorage.setItem("books", JSON.stringify(books));
            displayBookshelf();
        }
    }

    // Menghandle perubahan status pada checkbox form
    inputBookIsComplete.addEventListener("change", function () {
        const buttonText = inputBookIsComplete.checked
            ? "Selesai dibaca"
            : "Belum selesai dibaca";
        bookRead.innerHTML = buttonText;
    });

    // Menghandle penambahan buku baru
    bookSubmit.addEventListener("click", function (e) {
        e.preventDefault();
        const title = inputBookTitle.value;
        const author = inputBookAuthor.value;
        const year = inputBookYear.value;
        const isComplete = inputBookIsComplete.checked;

        // Memeriksa apakah input telah diisi
        if (title.trim() === "" || author.trim() === "" || year.trim() === "") {
            alert("Harap isi semua isian sebelum menambahkan buku.");
            inputBookTitle.focus();
            return;
        }

        addBook(title, author, year, isComplete);

        // Reset form
        inputBookTitle.value = "";
        inputBookAuthor.value = "";
        inputBookYear.value = "";
        inputBookIsComplete.checked = false;
    });

    // Menghandle pencarian buku
    searchSubmit.addEventListener("click", function (e) {
        e.preventDefault();
        const searchTerm = searchBookTitle.value.toLowerCase();
        const filteredBooks = books.filter((book) =>
            book.title.toLowerCase().includes(searchTerm)
        );
        displayBookshelf(filteredBooks);
    });


    // Menampilkan buku
    displayBookshelf();
});