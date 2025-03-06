// outline of content  => click the sidebar move to that content part
//obtain the elements first
const nav_ul = document.getElementById("navigator-list")
const a_list = Array.from(nav_ul.getElementsByTagName("a"));
nav_ul.addEventListener("click", e=>{
    if(e.target.nodeName === "A"){
        // remove the class name of all a elements
        a_list.forEach(a_el => {
            a_el.classList.remove("active")
        });
        //add class name to target a element
        e.target.classList.add("active")
    }
},false)

// when scrolling down, change the classname of a element
//obtain the height of each div element
const section_list = document.querySelectorAll(".content>div")
const Height_list = Array.from(section_list).map(section => (section.offsetTop));
window.addEventListener("scroll", ()=>{
    let scrollY = window.scrollY;
    a_list.forEach(a_el => {
            a_el.classList.remove("active")
        });
    //use switch to determine which element should add class name
    let activeIndex = 0;
    for (let i = 0; i < Height_list.length; i++) {
        if (scrollY >= Height_list[i] && (i === Height_list.length - 1 || scrollY < Height_list[i + 1])) {
            activeIndex = i;
            break;
        }
    }
    switch (activeIndex) {
        case 0:
            a_list[0].classList.add("active");
            break;
        case 1:
            a_list[1].classList.add("active");
            break;
        case 2:
            a_list[2].classList.add("active");
            break;
        case 3:
            a_list[3].classList.add("active");
            break;
        case 4:
            a_list[4].classList.add("active");
            break;
        case 5:
            a_list[5].classList.add("active");
            break;
        default:
            break;
    }
    
},false)