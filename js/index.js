document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form')
  const userList = document.getElementById('user-list')
  const reposList = document.getElementById('repos-list')

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const searchValue = document.getElementById('search').value
    searchUsers(searchValue)
  })

  async function searchUsers(search) {
    try {
      const response = await fetch(`https://api.github.com/search/users?q=${search}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      const data = await response.json()
      displayUsers(data.items)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  function displayUsers(users) {
    userList.innerHTML = ''
    reposList.innerHTML = ''
    users.forEach(user => {
      const userItem = document.createElement('li')
      userItem.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
        <a href="${user.html_url}" target="_blank">${user.login}</a>
        <button data-username="${user.login}">View Repos</button>
        <ul class="repos-list" id="repos-${user.login}" style="display: none;"></ul>
      `
      userList.appendChild(userItem)

      const viewReposButton = userItem.querySelector('button')
      viewReposButton.addEventListener('click', () => {
        const reposList = document.getElementById(`repos-${user.login}`)
        if (reposList.style.display === 'none') {
          fetchRepos(user.login)
          reposList.style.display = 'block'
        } else {
          reposList.style.display = 'none'
        }
      })
    })
  }

  async function fetchRepos(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      const data = await response.json()
      displayRepos(username, data)
    } catch (error) {
      console.error('Error fetching repos:', error)
    }
  }

  function displayRepos(username, repos) {
    const reposList = document.getElementById(`repos-${username}`)
    reposList.innerHTML = ''
    repos.forEach(repo => {
      const repoItem = document.createElement('li')
      repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`
      reposList.appendChild(repoItem)
    })
  }
})