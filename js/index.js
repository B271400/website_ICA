// import content change function
import contentChange from "./contentChange.js"

//this is the footer part: different context, background color and font color when choose different button

//obtain the right part content
const content_el = document.getElementById("content")
// obtain the left part ul 
const footer_ul = document.getElementById("footer-ul")
// the content and id
const footer_content_obj = {
    "help":"The help part provides a user-firendly guide for biologists onhow to use this website's functionalities. The about part gives an overview of the website's design and implementation, aimed at a web developer audience. It explains the technologies used,the database structure and the logic begind each feature",
    "about":"about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about about ",
    "contact":"<p>email: xxxxx@ed.ac.uk</p><p>telephone: +44 07xxxxxxxxx</p><p>company address: University of Edinburgh</p><p>faculty: School of Biological Science</p>"
}

contentChange(footer_ul, content_el, footer_content_obj)


// click the button jump to that page
footer_ul.addEventListener("click", e=>{
    const targetLi = e.target.closest('li');
    if(targetLi && footer_ul.children){
        if(targetLi.id=="help"){
            window.location = "/~s2647596/help.html"
        }else if(targetLi.id=="about"){
            window.location = "/~s2647596/about.html"
        }
    }
})
