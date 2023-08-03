interface IErrorMsg {
	msg: string;
}

export default function ErrorPar({msg}: IErrorMsg) {
	return <p className="text-red-50">{msg}</p>
}
