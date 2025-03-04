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
                section_box.innerHTML = `<div class="result-id">tracking id: ${data.search_result[0].unique_id}</div>
                                        <div class="seq-download">
                                            <a href="${data.search_result[0].file_dir}" download>sequence download</a>
                                        </div>`
                if(data.analysis_type == "has_analysis"){
                    //table header
                    section_box.innerHTML += `<table class="result-table more-sugar-font">
                                                    <thead class="gangalin-font">
                                                        <tr>
                                                            <th>
                                                                <div>
                                                                    <img src="./imgs/heart.png" />
                                                                    <p>analysis type</p>
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div>
                                                                    <img src="./imgs/heart.png" />
                                                                    <p>result download</p>
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div>
                                                                    <img src="./imgs/heart.png" />
                                                                    <p>extra information</p>
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="table-body"></tbody></table>`
                    //obtain tbody to add content
                    let tableBody = document.getElementById("table-body")
                    tableBody.innerHTML = ""

                    //add motif result
                    if (Array.isArray(data.motif_result) && data.motif_result.length > 0) {
                        //save the motif names in a lise
                        const motif_list = (data.motif_result[0].motif_list).split(";")

                        let motif_html = `<tr>
                                                <td class="analysis_type">
                                                    <p>Motif search</p>
                                                </td>
                                                <td class="result-download">
                                                    <div>
                                                        <a href="${data.motif_result[0].motif_zip_dir}" download>result_link</a>
                                                        <img src="./imgs/heart_box.png" />
                                                    </div>
                                                </td>
                                                <td class="extra-info" id="extra-info-box">
                                                    <div class="motif-result">
                                                        <p>Total sequence: ${data.motif_result[0].total_seq_num}</p>
                                                        <p>sequence with motif: ${data.motif_result[0].motif_seq_num}</p>
                                                        <p>****************************</p>
                                                        <p>motif found: </p>`

                        for(let motif_name of motif_list){
                            motif_html += `<p>${motif_name}</p>`
                        }
                        motif_html += `</div></td></tr>`

                        tableBody.innerHTML += motif_html

                    }

                    //add conservation result
                    if (Array.isArray(data.conservation_result) && data.conservation_result.length > 0) {
                        let conservation_html = `<tr>
                                                    <td class="analysis_type">
                                                        <p>conservation plot</p>
                                                    </td>
                                                    <td class="result-download">
                                                        <div>
                                                            <a href="${data.conservation_result[0].conservation_zip_dir}" download>result_link</a>
                                                            <img src="./imgs/heart_box.png" />
                                                        </div>
                                                    </td>
                                                    <td class="extra-info" id="extra-info-box">
                                                        <div class="conservation-result">
                                                            <img src="${data.conservation_result[0].conservation_plot}" />
                                                        </div>
                                                    </td>
                                                </tr>`
                        tableBody.innerHTML += conservation_html
                    }

                    //add tree result
                    if (Array.isArray(data.tree_result) && data.tree_result.length > 0) {
                        let tree_html = `<tr>
                                            <td class="analysis_type">
                                                <p>phylogenetic tree</p>
                                            </td>
                                            <td class="result-download">
                                                <div>
                                                    <a href="${data.tree_result[0].tree_zip_dir}" download>result_link</a>
                                                    <img src="./imgs/heart_box.png" />
                                                </div>
                                            </td>
                                            <td class="extra-info" id="extra-info-box">
                                                <div class="tree-result more-sugar-font">
                                                    <div class="result-download">
                                                        <img src="./imgs/download_box.png" />
                                                        <a href="${data.tree_result[0].tree_file}" download>
                                                            <p>download Newick-format tree data</p>
                                                            <p>use it to visualise phylogeny on iTOL</p>
                                                        </a>
                                                    </div>
                                                    <a class="result-upload" href="https://itol.embl.de/upload.cgi" target="_blank">link to iTOL</a>
                                                </div>
                                            </td>
                                        </tr>`
                        tableBody.innerHTML += tree_html
                    }

                }else{
                    //only sequence records, no analysis records
                    section_box.innerHTML += `<div class="no-analysis-tip">
                                                <p>no analysis records!</p>
                                                <p>you can download your sequence or try further analysis!</p>
                                                <div>
                                                    <img src="./imgs/heart_box.png" />
                                                    <a href="/~s2647596/analysis.html">further analysis</a>
                                                </div>
                                            </div>`

                }

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