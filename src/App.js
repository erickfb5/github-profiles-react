import { useState } from "react";
import axios from "axios";

import "./App.css";

const APIURL = "https://api.github.com/users/";

const App = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.elements.search.value.trim();
    if (username) {
      try {
        const { data } = await axios(`${APIURL}${username}`);
        setUser(data);
        const { data: repoData } = await axios(
          `${APIURL}${username}/repos?sort=created
`
        );
        setRepos(repoData.slice(0, 5));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setUser(null);
          setRepos([]);
        } else {
          console.error(error);
        }
      }
    } else {
      setUser(null);
      setRepos([]);
    }
  };

  return (
    <div>
      <form className="user-form" onSubmit={handleSubmit}>
        <input type="text" id="search" placeholder="Search a Github User" />
      </form>

      <main id="main">
        {user ? (
          <div className="card">
            <div>
              <img src={user.avatar_url} alt={user.name} className="avatar" />
            </div>
            <div className="user-info">
              <h2>{user.name || user.login}</h2>
              {user.bio && <p>{user.bio}</p>}
              <ul>
                <li>
                  {user.followers} <strong>Followers</strong>
                </li>
                <li>
                  {user.following} <strong>Following</strong>
                </li>
                <li>
                  {user.public_repos} <strong>Repos</strong>
                </li>
              </ul>

              <div id="repos">
                {repos.map((repo) => (
                  <a
                    href={repo.html_url}
                    target="_blank"
                    key={repo.id}
                    className="repo"
                  >
                    {repo.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <h1>No profile with this username</h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
