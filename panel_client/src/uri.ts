export default class URI {
	private base = 'http://localhost:5000/api';
	#adminLogIn = '/users/admin-log-in';
	#auth = '/users/get-auth';
	#posts = '/posts';
	#comments = '/comments';

	private combine(urlPart: string){
		return this.base + urlPart
	}

	get adminLogIn() {
		return this.combine(this.#adminLogIn);
	}
	get auth() {
		return this.combine(this.#auth);
	}
	get posts() {
		return this.combine(this.#posts);
	}
	postId(id: string) {
		return `${this.combine(this.#posts)}/${id}`;
	}
	get comments() {
		return this.combine(this.#comments);
	}
}
