import React, { useEffect, useState } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repos, setRepos] = useState([]);
  const [newRepoTitle, setnewRepoTitle] = useState("");
  const [newRepoUrl, setnewRepoUrl] = useState("");
  const [newRepoTechs, setnewRepoTechs] = useState("");

  useEffect(() => {
    api.get("/repositories").then((response) => {
      setRepos(response.data);
    });
  }, []);

  function handleAddRepository() {
    const title = newRepoTitle === "" ? "Sem título" : newRepoTitle;
    const url = newRepoUrl === "" ? "sem url" : newRepoUrl;
    const techs =
      newRepoTechs === "" ? ["sem tecnologias"] : newRepoTechs.split(", ");

    api
      .post("/repositories", {
        title: title,
        url: url,
        techs: techs,
      })
      .then((res) => {
        setRepos([...repos, res.data]);

        document.querySelector("#new-repo-title").value = "";
        document.querySelector("#new-repo-url").value = "";
        document.querySelector("#new-repo-techs").value = "";
      });
  }

  async function handleRemoveRepository(id) {
    api.delete(`/repositories/${id}`).then((res) => {
      document.querySelector(`#repo-${id}`).remove();
    });
  }

  return (
    <div>
      <h1>Repositórios:</h1>
      <ul data-testid="repository-list">
        {repos.map((repo) => {
          return (
            <li key={repo.id} id={`repo-${repo.id}`}>
              <button
                className="rmv-btn"
                onClick={() => handleRemoveRepository(repo.id)}
              >
                Remover
              </button>
              <div>
                <h3>
                  <b>{repo.title}</b>
                </h3>
                <p>
                  <i>{repo.url}</i>
                </p>
                <p className="tech-list">{repo.techs.join(", ")}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <li>
        <button className="add-btn" onClick={handleAddRepository}>
          Adicionar
        </button>
        <div>
          <input
            id="new-repo-title"
            type="text"
            placeholder="título"
            onKeyUp={(e) => setnewRepoTitle(e.target.value)}
          />
          <input
            id="new-repo-url"
            type="text"
            placeholder="url"
            onKeyUp={(e) => setnewRepoUrl(e.target.value)}
          />
          <input
            id="new-repo-techs"
            type="text"
            placeholder="tecnologias"
            onKeyUp={(e) => setnewRepoTechs(e.target.value)}
          />
        </div>
      </li>
    </div>
  );
}

export default App;
