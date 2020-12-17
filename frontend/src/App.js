import { useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StyledDiv = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

function handleUpload(params) {
	let targetFile = params.current.files[0];

	let fileElem = params.current.files[0].name.split('.');
	let fileName = targetFile.name;
	let fileType = fileElem[1];

	axios
		.post('http://localhost:3000/upload', {
			fileName,
			fileType,
		})
		.then((res) => {
			const returnData = res.data.data.returnData;
			const signedRequest = returnData.signedRequest;
			console.log(returnData);

			const options = {
				header: {
					'Content-Type': fileType,
				},
			};
			axios
				.put(signedRequest, targetFile, options)
				.then(console.log(`response from s3`))
				.catch((err) => {
					alert(`PUT Error ${JSON.stringify(err)}`);
				});
		})
		.catch((err) => {
			alert(err);
			//alert(`POST Error ${JSON.stringify(err)}`);
		});
}

function App() {
	const refFile = useRef(null);
	return (
		<StyledDiv>
			<input
				type='file'
				id='inputImageFileUpload'
				accept='image/png, image/jpeg'
				ref={refFile}
			/>
			<button onClick={() => handleUpload(refFile)}>파일보내기</button>
		</StyledDiv>
	);
}

export default App;
