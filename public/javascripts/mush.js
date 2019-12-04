document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);
});

const dd = document.querySelectorAll('.text a');
dd.forEach(function (e) {
    e.addEventListener("click", function () {
        document.querySelector(`.text`).classList = "hide";
        document.querySelector(`.edit`).classList = "";
    })
})

