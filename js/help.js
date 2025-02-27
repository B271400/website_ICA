// import the content change function
import contentChange from "./contentChange.js"

// obtain elements
const father_el = document.getElementById("help-ul")
const content_el = document.getElementById("content_box")
const slider_el = document.getElementById("slider-box")
const id_content_obj = {
    "overview":"introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function",
    "features":"features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function features of this funciton features of this function",
    "guide":"guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function guide of this function"
}

// change content and class name
contentChange(father_el, content_el,id_content_obj, slider_el)