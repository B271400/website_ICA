//obtain the form element , tip box and the button
const form_el = document.getElementById("search-form")
const tip_outer_box = document.getElementById("tip-outer-box")
const start_btn = document.getElementById("start-btn")
const section_box = document.getElementById("section-box")
const url = "/~s2647596/php/history.php"

//this variable save the status, if change to other status, activate focus event
let stat="original"
//if focus on the input box, change the content back to original
form_el.addEventListener("focus",()=>{
    if(stat != "original"){
        tip_outer_box.style.color="black"
        tip_outer_box.innerHTML = "<div class='arrow sprite-middle2'></div><div class='sprite-left3 word-box' id='tip-box'><p>click the search icon</p><p>to start</p></div>"
        stat = "original"
    }
},true)

//check the input box content when click on the start button
start_btn.addEventListener("click",()=>{
    stat = "original"
    if(form_el.seq_id.value){

        //change to loading page
        form_el.style.display = "none"
        var loading_el = document.createElement("div")
        loading_el.className = "loading sprite-right3"
        section_box.appendChild(loading_el)

        //send the values to the server
        //obtain input data
        var input_data = new FormData()
        input_data.append("tracking_id",form_el.seq_id.value)

        //send data
        fetch(url, {
            method:"post",
            body:input_data
        }).then(response=>{
            if(response.ok){
                return response.json()
            }else{
                throw new Error(`http code error:${response.status}`)
            }
        }).then(data => {
            if(data.status=="error"){
                throw new Error(data.message)
            }else{
                console.log(data)
            }

        }).catch(err=>{
            //handle error
            //change the style back
            form_el.style.display = "block"
            section_box.removeChild(loading_el)
            tip_outer_box.innerHTML = `<div class="sprite-right1 failed-pic"></div><div class="failed-word-box"><p>Sorry!</p><p>${err}</p><p>please try again</p>`
            stat = "failed"
        })

    }else{
        // if user did not enter the species name or protien name
        // change the tips
        tip_outer_box.style.color = "white"
        tip_outer_box.innerHTML = "<div class='arrow sprite-middle2'></div><div class='sprite-left3 word-box' id='tip-box'><p>please enter the</p><b>sequence id</b></div>"
    }
},true)