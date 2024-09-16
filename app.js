const imageUpload = document.getElementById("imageUpload");
const imageContainer = document.getElementById("imageContainer");
let selectedImages = [];

imageUpload.addEventListener("change", (event) => {
  const files = Array.from(event.target.files);
  selectedImages = files;

  // Clear existing images in container
  imageContainer.innerHTML = "";

  // Display selected images with a remove button
  files.forEach((file, index) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("image-wrapper");

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    imgWrapper.appendChild(img);

    // Add remove button to each image
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = () => removeImage(index);
    imgWrapper.appendChild(removeBtn);

    imageContainer.appendChild(imgWrapper);
  });

  // Make images draggable for reordering
  new Sortable(imageContainer, {
    animation: 150,
    onEnd: function () {
      // Reorder selectedImages based on the order of elements
      const reorderedImages = Array.from(
        imageContainer.querySelectorAll("img")
      ).map((img) => {
        return selectedImages.find(
          (file) => URL.createObjectURL(file) === img.src
        );
      });
      selectedImages = reorderedImages;
    },
  });
});

// Function to remove an image
function removeImage(index) {
  selectedImages.splice(index, 1);
  // Re-render the image container
  renderImages();
}

// Re-render images after removal
function renderImages() {
  imageContainer.innerHTML = "";
  selectedImages.forEach((file, index) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("image-wrapper");

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    imgWrapper.appendChild(img);

    // Add remove button to each image
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = () => removeImage(index);
    imgWrapper.appendChild(removeBtn);

    imageContainer.appendChild(imgWrapper);
  });
}

// Generate PDF
document.getElementById("generatePdfButton").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  selectedImages.forEach((file, index) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function () {
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (img.height * imgWidth) / img.width;

      if (index > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);

      if (index === selectedImages.length - 1) {
        pdf.save("output.pdf");
      }
    };
  });
});
