export default class URI {
	private base = 'http://localhost:5000/api';
	#adminLogIn = '/users/admin-log-in';
	#auth = '/users/get-auth';
	#createPost = '/posts'

	private combine(urlPart: string){
		return this.base + urlPart
	}

	get adminLogIn() {
		return this.combine(this.#adminLogIn);
	}
	get auth() {
		return this.combine(this.#auth);
	}
	get createPost() {
		return this.combine(this.#createPost);
	}
}
