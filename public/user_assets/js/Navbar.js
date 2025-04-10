document.addEventListener("DOMContentLoaded", function () {
   
    let currentPath = window.location.pathname;//Detects Current Page

    let navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
            link.style.color = "#007bff"; // Change this to your desired color
            link.style.fontWeight = "bold"; // Optional: Make the active link bold  
        } else {
            link.classList.remove("active");
        }
    }); 
});