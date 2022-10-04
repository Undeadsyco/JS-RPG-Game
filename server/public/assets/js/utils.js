function postData(url = '', data = {}) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include', //needed to pass cookies
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referer',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

function signIn() {
  const body = {
    email: document.forms[0].elements[0].value,
    password: document.forms[0].elements[1].value
  };

  postData('/login', body).then(res => {
    if (res.status !== 200) throw new Error(res.error);
    window.location.replace('/game.html');
  }).catch(err => {
    window.alert(err.message);
    window.location.replace('/index.html');
  })
}

function signUp() {
  const body = {
    email: document.forms[0].elements[0].value,
    password: document.forms[0].elements[1].value,
    username: document.forms[0].elements[2].value
  };

  postData('/signup', body).then(res => {
    if (res.status !== 200) throw new Error(res.error);
    window.alert('user created successfully');
    window.location.replace('/index.html');
  }).catch(err => {
    window.alert(err.message);
    window.location.replace('/signup.html');
  })
}

function forgotPassword() {
  const body = {
    email: document.forms[0].elements[0].value
  };

  postData('/forgot-password', body).then(res => {
    if (res.status !== 200) throw new Error(res.error);
    window.alert('password reset email sent');
    window.location.replace('/index.html');
  }).catch(err => {
    window.alert(err.message);
    window.location.replace('/forgotPassword.html');
  })
}

function resetPassword() {
  const password = document.forms[0].elements[1].value;
  const verifiedPassword = document.forms[0].elements[2].value;

  const body = {
    email: document.forms[0].elements[0].value,
    password,
    verifiedPassword,
    token: document.location.href.split('token=')[1]
  };

  if (password !== verifiedPassword) {
    window.alert("passwords don't match")
  } else {
    postData('/reset-password', body).then(res => {
      if (res.status !== 200) throw new Error(res.error);
      window.alert('password updated');
      window.location.replace('/index.html');
    }).catch(err => {
      window.alert(err.message);
      window.location.replace('/forgotPassword.html');
    })

  }

}