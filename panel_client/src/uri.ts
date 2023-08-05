export default class URI {
	private base = 'https://blog-api-8tzb.onrender.com/api';
	#adminLogIn = '/users/admin-log-in';
	#auth = '/users/get-auth';
	#comments = '/comments';
	#posts = '/posts';
	#publish = '/posts/publish'
	#users = '/users';

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
	get users() {
		return this.combine(this.#users);
	}
	publish(id: string) {
		return `${this.combine(this.#publish)}/${id}`;
	}
	commentId(id: string) {
		return `${this.combine(this.#comments)}/${id}`;
	}
}
