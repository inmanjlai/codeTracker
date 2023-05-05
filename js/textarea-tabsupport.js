const textarea = document.querySelector(".form-container textarea");

textarea.addEventListener("keydown", (e) => {
    if (e.keyCode === 9) {
        e.preventDefault();

        textarea.setRangeText(
            "    ",
            textarea.selectionStart,
            textarea.selectionStart,
            "end"
        );
    }
});
