// import the content change function
import contentChange from "./contentChange.js"

// obtain elements
const father_el = document.getElementById("about-ul")
const content_el = document.getElementById("content-box")
const slider_el = document.getElementById("slider-box")
const id_content_obj = {
    "overview":"introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function introduction of this function",
    "tech":"technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack technology stack",
    "data":"data data data data content data content balblablabl data data data data content data content balblablabl data data data data content data content balblablabl  data data data data content data content balblablabl  data data data data content data content balblablabl  data data data data content data content balblablabl  data data data data content data content balblablabl "
}

// change content and class name
contentChange(father_el, content_el,id_content_obj, slider_el)