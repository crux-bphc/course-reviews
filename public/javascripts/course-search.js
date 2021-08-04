function spaceToScore(str) {
  return str.replaceAll(" ", "_");
}

function filterCourses(query) {
  const re = new RegExp(query.trim(), "i");

  const result = courses.filter((item) => {
    if (
      item.course_code.match(re) ||
      item.course_name.match(re) ||
      item.instructors.match(re)
    ) {
      return true;
    }
    return false;
  });

  return result;
}

function renderSearchResults(query) {
  const found = filterCourses(query.trim());
  let msg = "";
  if (found.length === 0) {
    msg = `<b class="search-error">No courses found matching "${query}".</b> Course missing? Use the link in the footer to request.`;
  } else {
    let tableRows = "";
    for (let item of found) {
      tableRows += `<a  href="/courses/${
        spaceToScore(item.course_code) + "/" + spaceToScore(item.course_name)
      }" ><li><div class="row"><div class="col-9 course-name">
        <img src="/book.png" class="middle" width=32 alt="book icon"/>
      ${item.course_code} &nbsp;<b>${
        item.course_name
      }</b><br/><small class="ins">${
        item.instructors
      }</small></div><div class="col-3 course-link"><span class="btn float block text-center">Reviews</span><div class="clearfix"></div></div></li></a>`;
    }
    msg = `<ul class="results">
    ${tableRows}</div></ul>`;
  }

  document.getElementById("results").innerHTML = msg;
}

document
  .getElementById("course-search")
  .addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      doSearch();
    }
  });

function doSearch() {
  const query = document.getElementById("course-search").value;
  renderSearchResults(query);
}
