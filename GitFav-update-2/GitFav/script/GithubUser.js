export class GithubUser {
  static async search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    const data = await fetch(endpoint);
    const { name, login, public_repos, followers } = await data.json();
    return {
      name,
      login,
      public_repos,
      followers,
    };
  }
}
