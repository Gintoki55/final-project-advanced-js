let currentPage = 1
let lastPage = 1

setupUI()

///======= infinite scrolle   pagination ========== ///
window.onscroll = function(ev) {
    const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if(endOfPage && currentPage < lastPage){
        currentPage = currentPage+1
        getPosts(currentPage)
    }
};

function getPosts(page = 1){
    toggleLoader(true)
    axios.get(`${url}posts?limit=5&page=${page}`)
    .then(function (response) {
        console.log(response);
        lastPage = response.data.meta.last_page
        console.log(lastPage)
        posts = response.data.data
        for(let post of posts){  

           

            // show or hide (edit) button
            let user = getCurentUser()
            let isMyPost = user != null && post.author.id == user.id
            
            let BtnContent = ``

            if(isMyPost){                                                                                                       // important !!    // important !!
                BtnContent = `<button class='btn btn-outline-secondary' style='float:right;' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                <button class="btn btn-outline-danger mx-2" style="float:right;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>`
            }
            const author = post.author
            // important !!
            let postTitle = ""

            if(post.title != null){
                postTitle = post.title
            }
            let content = 
            `<div class="card shadow">
                <div class="card-header">
                    <span onclick="userClicked(${author.id})" style="cursor:pointer;">
                        <img src="${author.profile_image}" class="border rounded-circle border-2" style="width: 40px; height: 40px;" id="avatar-post">
                        <b class="mx-2" style="vertical-align: middle;">${author.username}</b>
                    </span>
                 
                    ${BtnContent}
                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;">
                    <img src="${post.image}" class="w-100" id="img">
                    <div class="text-secondary mt-2">${post.created_at}</div>
                    <h5 class="card-title" id="title">${postTitle}</h5>
                    <p class="card-text" id="body">${post.body}</p>
                    <hr>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <span>(${post.comments_count}) comments
                        <span id="post-tags-${post.id}">

                        </span>
                    </span>
                </div>
            </div>`

             posts_container.innerHTML += content
             let currentPosttagsId = `post-tags-${post.id}`
             document.getElementById(currentPosttagsId).innerHTML = ""
            for(const tag of post.tags){
                let tagsContent = 
                `<button class="btn btn-sm rounded-5" style="background-color:grey; color:white;">
                    ${tag.name}
                </button>`

                document.getElementById(currentPosttagsId).innerHTML += tagsContent
            }
        }
       
       
    })
    .catch(function (error) {
        console.log(error);
    }).finally(()=>{
        toggleLoader(false)
    })

   
}
getPosts()



function createPostBtn(){
    toggleLoader(true)
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""

    let body = document.getElementById('body-post');
    let title = document.getElementById('title-post');
    let image = document.getElementById('image-post');
    let avatar = document.getElementById('avatar-post');
    let token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("title", title.value)
    formData.append("body", body.value,)
    formData.append("image", image.files[0])

    let headers = {
        authorization: `Bearer ${token}`
    }

    let baseUrl = `${url}posts`

    if(isCreate){
        baseUrl = `${url}posts`
        showAleart("post added successfuly", "success")
    }else{
        formData.append("_method", "put")

        baseUrl =`${url}posts/${postId}`
        showAleart("post Update successfuly", "success")
    }

    axios.post(baseUrl,formData,{
        headers : headers
    })
    .then(function (response) {

        console.log(response)
        const modal = document.getElementById('create-post-modal');
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        
    })
    .catch(function (error) {
        showAleart(error.response.data.message, "danger")
    }).finally(()=>{
        toggleLoader(false)
    });
   
}


function postClicked(id){
    // you can use local or window storage
    // localStorage.setItem("id", id)
    window.location = `post.html?postId=${id}`
}


// important !!
function editPostBtnClicked(postObject){
   let post = JSON.parse(decodeURIComponent(postObject))
   console.log(post)
   document.getElementById("post-id-input").value = post.id
    document.getElementById('post-modal-title').innerHTML = "Edit Post"
    document.getElementById('title-post').value = post.title
    document.getElementById('body-post').value = post.body
    document.getElementById('btnCreate').innerHTML = "Update"
   let postModal = new bootstrap.Modal(document.getElementById('create-post-modal'),{})
   postModal.toggle()
}

// important !!
function addBtnClicked(){

    document.getElementById("post-id-input").value = ''
     document.getElementById('post-modal-title').innerHTML = "Create A NEW Post"
     document.getElementById('title-post').value =""
     document.getElementById('body-post').value = ""
     document.getElementById('btnCreate').innerHTML = "Create"
    let postModal = new bootstrap.Modal(document.getElementById('create-post-modal'),{})
    postModal.toggle()
}


function deletePostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    // important !!
    document.getElementById('delete-id-post').value = post.id
    // important !
    let postModal = new bootstrap.Modal(document.getElementById('modal-confirm-delete'),{})
    postModal.toggle()
}


function confirmDeletePostBtn(){
    toggleLoader(true)
    let postId = document.getElementById('delete-id-post').value;
    const baseUrl = `${url}posts/${postId}`
    let token = localStorage.getItem("token")

    axios.delete(baseUrl, {
      headers: {
        "authorization": `Bearer ${token}`,
      }
    })

    .then(function (response) {
    
      showAleart("you Delete Post!", "danger")
      const modal = document.getElementById('modal-confirm-delete');
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      getPosts()
    })
    .catch(function (error) {
        showAleart(error.response.data.message, "danger")
    }).finally(()=>{
        toggleLoader(false)
    });
      
  }


function userClicked(id){

    window.location = `profile.html?userid=${id}`
}

