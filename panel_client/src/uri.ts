export default class URI {
	private base = 'http://localhost:5000/api';
	#adminLogIn = '/users/admin-log-in';
	#auth = '/users/get-auth';
	#Posts = '/posts';

	private combine(urlPart: string){
		return this.base + urlPart
	}

	get adminLogIn() {
		return this.combine(this.#adminLogIn);
	}
	get auth() {
		return this.combine(this.#auth);
	}
	get Posts() {
		return this.combine(this.#Posts);
	}
	postId(id: string) {
		return `${this.combine(this.#Posts)}/${id}`;
	}
}
