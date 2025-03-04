//obtain the form element , tip box and the button
const form_el = document.getElementById("search-form")
const tip_outer_box = document.getElementById("tip-outer-box")
const start_btn = document.getElementById("start-btn")
const section_box = document.getElementById("section-box")
const url = "/~s2647596/php/search.php"

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
    if(form_el.search_protein.value && form_el.search_species.value){

        //change to loading page
        form_el.style.display = "none"
        var loading_el = document.createElement("div")
        loading_el.className = "loading sprite-right3"
        section_box.appendChild(loading_el)

        //send the values to the server
        //obtain input data
        var input_data = new FormData(form_el)

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
        }).then(result => {
            if(result.status=="error"){
                throw new Error(result.message)
            }else{
                if(result["uni_id"]){
                    let downloadURL = `/~s2647596/results/seq_${result["uni_id"]}/original_seq.fasta`
                    // console.log(downloadURL)
                    //when receive the result
                    section_box.innerHTML=`
                        <div class = "sprite-right2 success-pic"></div>
                        <div class = "success-msg more-sugar-font">
                            <p>Target sequence is found!</p>
                            <p>Here is your tracking ID: <span id="id-text">seq_${result["uni_id"]}</span></p>
                            <p>Keep it for history track/ further analysis</p>
                            <p>now you can:</p></div>
                        <ul class = "success-choice-list more-sugar-font">
                            <li>
                                <img src="./imgs/heart_box.png"/>
                                <a href="${downloadURL}" download><p>download sequence</p><p>FASTA format</p></a>
                            </li>
                            <li>
                                <img src="./imgs/heart_box.png"/>
                                <a href="/~s2647596/analysis.html"><p>Further analysis</p></a>
                            </li>
                        </ul>`

                     //obtain the track box and copy the tracking id to clipboard
                    document.getElementById("id-text").addEventListener("click",function(){
                        navigator.clipboard.writeText(`seq_${result["uni_id"]}`).then(()=>{
                            alert("tracking id copied")
                        }).catch(err=>{
                            alert("copy error" + err)
                        })
                    })   
                }
            }

        }).catch(err=>{
            console.log(err)
            //handle error
            //change the style back
            form_el.style.display = "block"
            section_box.removeChild(loading_el)
            tip_outer_box.innerHTML = `<div class="sprite-right1 failed-pic"></div><div class="failed-word-box"><p>Sorry!</p><p>${err}</p><p>please try again</p></div>`
            stat = "failed"
        })

    }else{
        // if user did not enter the species name or protien name
        // change the tips
        tip_outer_box.style.color = "white"
        if(form_el.search_protein.value){
            tip_outer_box.innerHTML = "<div class='arrow sprite-middle2'></div><div class='sprite-left3 word-box' id='tip-box'><p>please enter the</p><b>species name</b></div>"
        }else if(form_el.search_species.value){
            tip_outer_box.innerHTML = "<div class='arrow sprite-middle2'></div><div class='sprite-left3 word-box' id='tip-box'><p>please enter the</p><b>protein name</b></div>"
        }else{
            tip_outer_box.innerHTML = "<div class='arrow sprite-middle2'></div><div class='sprite-left3 word-box' id='tip-box'><p>please enter the</p><b>protein and species name</b></div>"
        }
    }
},true)