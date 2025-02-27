// import the content change function
import contentChange from "./contentChange.js"

// obtain elements
const father_el = document.getElementById("analysis-ul")
const content_el = document.getElementById("content_box")
const slider_el = document.getElementById("slider-box")
const id_content_obj = {
    "conservation":"introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function",
    "motif":"features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function",
    "property":"guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function",
    "integration":"integration integration integration guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function"
}

// change content and class name
contentChange(father_el, content_el,id_content_obj, slider_el, 4)

//click the button => jump to that page
father_el.addEventListener("click",e=>{
    const targetLi = e.target.closest('li');
    if(targetLi && father_el.children){
        window.location = `/~s2647596/${targetLi.id}.html`
    }
}, true)

