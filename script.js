const form = document.querySelector("form");
const input = document.querySelector('input[type="text"]');
const repoList = document.getElementById("repo-list");
const followerList = document.getElementById("follower-list");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  input.value = input.value.trim();
  if (input.value) {
    const [repoRes, follRes] = await Promise.all([
      fetch(`https://api.github.com/users/${input.value}/repos`),
      fetch(`https://api.github.com/users/${input.value}/followers  `),
    ]);
    const [repoData, follData] = await Promise.all([
      repoRes.json(),
      follRes.json(),
    ]);
    if (repoRes.ok) {
      repoData.forEach((repo) => {
        const li = document.createElement("li");
        li.className = "repo-item";
        const repoName = document.createElement("p");
        const nameLink = document.createElement("a");
        nameLink.innerText = repo.name;
        nameLink.href = repo.html_url;
        nameLink.target = "_blank";
        nameLink.className = "repo-name";
        repoName.appendChild(nameLink);
        li.appendChild(repoName);
        const watchers = document.createElement("p");
        watchers.innerText = `Watchers: ${repo.watchers}`;
        watchers.className = "watcher";
        li.appendChild(watchers);
        const openIssues = document.createElement("p");
        openIssues.className = "open-issue";
        openIssues.innerText = `Open Issues: ${repo.open_issues}`;
        li.appendChild(openIssues);

        repoList.appendChild(li);
      });
    } else {
      const message = document.createElement("p");
      message.className = "message";
      message.innerText = repoData.message;
      repoList.appendChild(message);
    }

    if (follRes.ok) {
      follData.forEach((fol) => {
        const li = document.createElement("li");
        li.className = "follower-item";
        const avatar = document.createElement("img");
        avatar.src = fol.avatar_url;
        avatar.alt = fol.login;
        avatar.width = 50;
        avatar.className = "avatar";
        li.appendChild(avatar);
        const follLink = document.createElement("a");
        follLink.className = "follower-link";
        follLink.href = `https://www.github.com/${fol.login}`;
        follLink.target = "_blank";
        follLink.innerText = fol.login;
        li.appendChild(follLink);
        followerList.appendChild(li);
      });
    } else {
      const message = document.createElement("p");
      message.className = "message";
      message.innerText = repoData.message;
      followerList.appendChild(message);
    }
  }
  input.value = "";
});
