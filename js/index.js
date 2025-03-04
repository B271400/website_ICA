// import content change function
import contentChange from "./contentChange.js"

//this is the footer part: different context, background color and font color when choose different button

//obtain the right part content
const content_el = document.getElementById("content")
// obtain the left part ul 
const footer_ul = document.getElementById("footer-ul")
// the content and id
const footer_content_obj = {
    "help":"This page is designed to provide a clear and user-friendly guide on how to use the key functionalities of this website. Whether you are a biologist looking to analyze protein sequences or a researcher exploring motif patterns, this guide will walk you through the features step by step.",
    "about":`This page provides an overview of the design and implementation of this website, offering insights into its development process and underlying technologies. Unlike the Help Page, which focuses on user functionality, the About Page is aimed at web developers who are interested in the website's architecture and logic. `,
    "contact":`<p>GitHub link: <a href="#">https://github....com</a></p><p>email: sxxxxxx@ed.ac.uk</p><p>telephone: +44 07xxxxxxxxx</p><p>company address: University of Edxxxxx</p><p>faculty: School of Biological Science</p><p>Available Hours: Monday - Friday, 9 AM - 5 PM (GMT)<p><p>Response Time: Typically within 24-48 hours</p>`
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

//click the button to copy the tracking id 
const copy_id_btn = document.getElementById("copy-id")
const example_id = "seq_exampleAves"
copy_id_btn.addEventListener("click",function(){
    navigator.clipboard.writeText(example_id).then(()=>{
        alert("tracking id copied")
    }).catch(err=>{
        alert("copy error" + err)
    })
})