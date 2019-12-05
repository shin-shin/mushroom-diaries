document.addEventListener('DOMContentLoaded', function () {
//     var elems = document.querySelectorAll('.collapsible');
//     var instances = M.Collapsible.init(elems);
// });

var elem = document.querySelector('.collapsible.expandable');
  var instance = M.Collapsible.init(elem, {
    accordion: false
  });

const dd = document.querySelectorAll('.text a');
dd.forEach(function (d) {
    d.addEventListener("click", function (event) {
        console.log(event.target.parentNode.parentNode);
        let parent = event.target.parentNode.parentNode;
        parent.querySelector(`.text`).classList = "hide";
        parent.querySelector(`.edit`).classList = "";
    })
})
// document.querySelectorAll('.text a').addEventListener("click", function (e) {
//         document.querySelector(`.text`).classList = "hide";
//         document.querySelector(`.edit`).classList = "";
//     })

})


