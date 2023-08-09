import { GithubUser } from "./GithubUser.js";

// Classe para manipulação de dados:

class Favorites {
  constructor(root) {
    root = document.querySelector(root);

    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(userName) {
    try {
      const user = await GithubUser.search(userName);
      const userExist = this.entries.find((entry) => entry.login === userName);

      if (userExist) {
        throw new Error("Usuário já favoritado!");
      }

      if (user.login === undefined) {
        throw new Error("usuario não encontrado!");
      }

      this.entries = [user, ...this.entries];

      this.update();
      this.save();
    } catch (err) {
      alert(err.message);
    }
  }
}

// Classe para a visualização
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = document.querySelector("tbody");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const onAdd = document.querySelector("#search button");

    onAdd.onclick = () => {
      const { value } = document.querySelector("#search input");

      this.add(value);
    };
  }

  creatRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
  <td class="user">
    <img src="" alt="" />
    <a href="" target="_blank">
      <p></p>
      <span></span>
    </a>
  </td>
  <td class = "reposHTML">
  </td>
  <td class = "followersHTML">
  </td>
  <td>
  <button class="toRemove">Remover</button>
  </td>
    `;

    return tr;
  }

  update() {
    this.removeAllTr();
    this.entries.forEach((user) => {
      const row = this.creatRow();
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;

      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user a p").textContent = user.name;
      row.querySelector(".user a span").textContent = "/" + user.login;
      row.querySelector(".reposHTML").textContent = user.public_repos;
      row.querySelector(".followersHTML").textContent = user.followers;
      this.tbody.append(row);
    });
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
