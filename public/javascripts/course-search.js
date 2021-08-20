function spaceToScore(str) {
  return str.replaceAll(" ", "_");
}

function searchParams() {
  const currUri = new URL(document.location);
  const query = currUri.searchParams.get("query");
  console.log(query);
  if (query && query.length > 0) {
    document.getElementById("course-search").value = query;
    doSearch();
  }
}

function initialRender() {
  const results = document.getElementById("results");

  for (item of courses) {
    const elem = document.createElement("div");
    elem.id = item.course_code;
    // elem.classList.add("hidden");
    elem.classList.add("resultItem");
    elem.innerHTML = `<a  href="/courses/${
      spaceToScore(item.course_code) + "/" + spaceToScore(item.course_name)
    }" ><div class="row"><div class="col-9 course-name">
      <img src="/book.png" class="middle" width=32 height=32 alt="book icon"/>
    ${item.course_code} &nbsp;<b>${
      item.course_name
    }</b><br/><small class="ins">${
      item.instructors
    }</small></div><div class="col-3 course-link"><span class="btn float block text-center">Reviews</span><div class="clearfix"></div></div></a>`;
    results.appendChild(elem);
  }

  searchParams();
}

function filterCourses(query) {
  const re = new RegExp(query.trim(), "i");
  let found = false;
  courses.forEach((item) => {
    if (
      item.course_code.match(re) ||
      item.course_name.match(re) ||
      item.instructors.match(re)
    ) {
      document.getElementById(item.course_code).classList.remove("hidden");
      found = true;
    } else {
      document.getElementById(item.course_code).classList.add("hidden");
    }
  });

  return found;
}

function renderSearchResults(query) {
  const found = filterCourses(query);
  const notFound = document.getElementById("notFound");
  if (found) {
    notFound.classList.add("hidden");
  } else {
    notFound.classList.remove("hidden");
  }
}

document.getElementById("course-search").value = "";
initialRender();

let searchTimeout;

document
  .getElementById("course-search")
  .addEventListener("keyup", function (e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(doSearch, 300);
  });

function doSearch() {
  const query = document.getElementById("course-search").value;
  renderSearchResults(query);
}
