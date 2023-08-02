import jwt, { JwtPayload } from 'jsonwebtoken';

export default function getPayloadFromHeader(bearerHeader: string, secret: string): string | JwtPayload{
	const token: string = bearerHeader.split(' ')[1] as string;
	return jwt.verify(token, secret);
}
