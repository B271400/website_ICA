// when upload the file, activate change event
const upload_file = (file_el, upload_url)=>{
    //return a promise
    return new Promise((resolve, reject)=>{
        file_el.addEventListener("change", async ()=>{
            const file = file_el.files[0]
            if(file){
                const file_data = new FormData()
                file_data.append("file_upload",file)
                try {
                    fetch(upload_url,{
                        method:"post",
                        body:file_data
                    }).then(response=>{
                        if(response.ok){
                            return response.json()
                        }else{
                            throw new Error(`http code error:${response.status}`)
                        }
                    }).then(data=>{
                        if(data.status=="error"){
                            throw new Error(data.message)
                        }else{
            
                            alert("upload the file successfully!")
                            resolve("success")
                        }
                    })
                } catch (err){
                    alert(err);
                    reject("error")
                }
            }
        
        },true)
    })
}

export default upload_file;