//user click that element, change the className
// obtain the banner elements
const banner_ul = document.getElementById("banner-ul")
const a_els = document.querySelectorAll("#banner-ul a")
banner_ul.addEventListener("click", e =>{
    if(e.target.nodeName === "A"){
        //remove all the class name
        for(let a of a_els.values()){
            a.classList.remove("current-li")
        }
        //add active classname for current element
        e.target.classList.add("current-li")
    }
}, false);

//change the className when user scoll down to that part
//obtain the section elements
const search_el = document.getElementById("search-guide")
const analysis_el = document.getElementById("analysis-guide")
const tracking_el = document.getElementById("tracking-guide")

const analysis_position = search_el.offsetHeight
const tracking_position = analysis_position + analysis_el.offsetHeight
//scrolling event
window.addEventListener("scroll", ()=>{
    //remove all the class name
    for(let a of a_els.values()){
        a.classList.remove("current-li")
    }
    if(window.scrollY < analysis_position){
        //add class name to first a element
        a_els[0].classList.add("current-li")
    }else if(window.scrollY >= tracking_position){
        a_els[2].classList.add("current-li")
    }else{
        a_els[1].classList.add("current-li")
    }
}, false);