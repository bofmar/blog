export interface IUser {
	_id: string;
	username: string;
	authLevel: 'USER' | 'ADMIN';
	likedPostIds: Array<string> ;
}

export interface IComment {
	_id: string;
	text: string;
	createdBy: IUser
}

export interface IPost {
	_id: string;
	title: string;
	body: string;
	summary: string;
	comments: Array<IComment>;
	likes: number;
	status: 'PUBLISHED' | 'UNPUBLISHED'
}
