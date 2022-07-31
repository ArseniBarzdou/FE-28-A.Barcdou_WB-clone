
const modalImage = document.querySelector(".js-modal-image");
const modalOpen = document.querySelector(".js-modal");
const modalClose = document.querySelector(".js-close");
const imageList = document.querySelectorAll(".js-img-thumb");

Array.from(imageList).forEach(item => {
  item.addEventListener("click", e => {
    modalOpen.classList.add("open");
    modalImage.src = e.target.src;
  });
});

modalClose.addEventListener("click", () => {
  modalOpen.classList.remove("open");
});