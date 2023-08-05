interface IErrorMsg {
	msg: string;
}

export default function ErrorPar({msg}: IErrorMsg) {
	return <p className="text-red-400 mb-8">{msg}</p>
}
