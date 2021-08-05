function setCookie(cname, cvalue, exdays = 365) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=None; Secure";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const voted = new Set();

function upvote(feedbackId) {
  const votes = getCookie("myVotes");
  if (voted.has(feedbackId) || votes.includes(feedbackId)) {
    alert("Cant vote twice.");
    return;
  }

  voted.add(feedbackId);
  setCookie("myVotes", votes + "," + feedbackId);
  fetch(`/course/upvote?feedbackId=${feedbackId}`);
  const ele = document.getElementById("votes-" + feedbackId);
  let curr = parseInt(ele.innerText.trim());
  curr += 10;
  ele.innerText = curr;
}

function downvote(feedbackId) {
  if (voted.has(feedbackId)) {
    alert("Cant vote twice.");

    return;
  }

  voted.add(feedbackId);
  fetch(`/course/downvote?feedbackId=${feedbackId}`);
  const ele = document.getElementById("votes-" + feedbackId);
  let curr = parseInt(ele.innerText.trim());
  curr -= 10;
  ele.innerText = curr;
}
