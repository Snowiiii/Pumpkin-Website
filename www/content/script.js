// Open the modal and display the clicked image
function openModal(image) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    modal.style.display = "block";
     modalImage.src = image.src;
     modalImage.style.transform = "scale(1)";

     document.addEventListener("keydown", closeModalOnEscape);
 }

 // Close the modal
 function closeModal() {
     const modal = document.getElementById("imageModal");
     modal.style.display = "none";

     document.removeEventListener("keydown", closeModalOnEscape);
 }

 // Function to close modal when Escape key is pressed
 function closeModalOnEscape(event) {
     if (event.key === "Escape") {
         closeModal();
     }
 }