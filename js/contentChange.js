// write a function for color and content change when mouse enter
const contentChange = (father_el, content_el, id_content_obj, slider_el="", pic_num=3)=>{
    father_el.addEventListener("mouseover", e=>{
        const targetLi = e.target.closest('li');
        //if targetli is the child element of father_el
        if(targetLi && father_el.children){
            for(let el of father_el.children){
                if(el.nodeName==='LI' ){
                    if(targetLi==el){
                        // add class name for the li element your mouse entered
                        el.classList.add("active_box")
                        el.children[0].src = "./imgs/active_box.png"
                    }else{
                        // remove all this class name for other li elements
                        el.classList.remove("active_box")
                        el.children[0].src = "./imgs/original_box.png"
                    }
                }
            }
    
                // set the content in content element
                for(const [id, content] of Object.entries(id_content_obj)){
                    if(targetLi.id==id){
                        content_el.innerHTML = content
                    }
                }

                // slider move 
                if(slider_el){
                    let n = targetLi.dataset.n
                    let pic_width = 100/pic_num
                    slider_el.style.transform = `translateX(-${(n)*pic_width}%)`
                    slider_el.style.transition = "all 1s linear 0s"
                }

            }

    }, true)
}

// export this function
export default contentChange