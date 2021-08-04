const voted = new Set();

function upvote(feedbackId) {
  if (voted.has(feedbackId)) {
    alert("Cant vote twice.");
    return;
  }

  voted.add(feedbackId);
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
