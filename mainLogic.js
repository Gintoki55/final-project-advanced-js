const url = 'https://tarmeezacademy.com/api/v1/'
    let username = document.getElementById('username');
    let created_at = document.getElementById('created_at');
    let title = document.getElementById('title');
    let body = document.getElementById('body');
    let image = document.getElementById('img');
    let posts_container = document.getElementById('posts-container');


// important !!
function setupUI(){
    let token = localStorage.getItem("token");

    const loginDiv = document.getElementById('logget-in-div');
    const logoutDiv = document.getElementById('logout-div');
    const addBtn = document.getElementById('addBtn');

    let nav_username = document.getElementById('nav-username');
    let nav_image = document.getElementById('nav-image');

    

    const user = getCurentUser()

    if (token == null){

        if(addBtn != null){
            addBtn.style.setProperty("display", "none", "important")
        }
       
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important") 
    }else{

        if(addBtn != null){
            addBtn.style.setProperty("display", "block", "important")
        }

        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")

        nav_username.innerHTML = user.username
        nav_image.src = user.profile_image
    }
}

// important !!
function getCurentUser(){
    let user = null

    const storageUser  = localStorage.getItem("user")
    if (storageUser != null){
        user = JSON.parse(storageUser)
    }

    return user
}

// important !!
function showAleart(customMessage, color="success"){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }

    
    appendAlert(customMessage, color)


    //todo: hide aleart 
    
    // setTimeout(function(){
    //     const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
    //     alert.close()
    // },2000)
}

//=========== AUTH ======== ///
function login(){
    toggleLoader(true)
    let username = document.getElementById('username');
    let password = document.getElementById('password');

    axios.post(`${url}login`, {
        "username" : username.value,
        "password" : password.value
    })
    .then(function (response) {
        
        console.log(response.data.token);
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        console.log()           
        const modal = document.getElementById('login-modal');
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAleart("logged in successfuly", "success")
        setupUI()
    })
    .catch(function (error) {
        showAleart(error.response.data.message, "danger")
        const modal = document.getElementById('login-modal');
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
    }).finally(()=>{
        toggleLoader(false)
    });
    
}

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAleart("logged out successfuly" , "secondary")
    setupUI()
}


function signup(){
    toggleLoader(true)
    let re_name = document.getElementById('re-name');
    let re_username = document.getElementById('re-username');
    let re_password = document.getElementById('re-password');
    let re_image = document.getElementById('re-image');

    let formData =  new FormData()
    formData.append("image", re_image.files[0])
    formData.append("name", re_name.value)
    formData.append("username", re_username.value)
    formData.append("password", re_password.value)

    axios.post(`${url}register`, formData)
    .then(function (response) {
        console.log(response.data.token);
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById('signup-modal');
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAleart("New User Register successfuly")
        setupUI()
        
    })
    .catch(function (error) {
        showAleart(error.response.data.message, "danger");
        const modal = document.getElementById('signup-modal');
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
    }).finally(()=>{
        toggleLoader(false)
    });
}



function profileClicked(){
    const user = getCurentUser()

    window.location = `profile.html?userid=${user.id}`
}

function toggleLoader(show = true){
    
    if(show){
        document.getElementById('loader').style.visibility = 'visible'
    }else{
        document.getElementById('loader').style.visibility = 'hidden'
    }

}