import { useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StyledDiv = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const StyledImg = styled.div`
	width: 960px;
	height: 720px;
	background-image: url(${(props) => props.urlImage});
	background-position: center;
	background-size: cover;
`;

function handleUpload(params) {
	let targetFile = params.files[0];

	let fileElem = params.files[0].name.split('.');
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
function handleDownload(params, setDownload, setImage) {
	axios
		.get('http://localhost:3000/download', {
			params: { fileName: params.value },
		})
		.then((res) => {
			setDownload(true);
			setImage(res.data.data.signedRequest);
		});
}


function App() {
	const refFile = useRef(null);
	const refText = useRef(null);
	const [download, setDownload] = useState(false);
	const [image, setImage] = useState('');

	return (
		<StyledDiv>
			<div className='test-upload'>
				<input
					type='file'
					id='inputImageFile'
					accept='image/png, image/jpeg'
					ref={refFile}
				/>
				<button onClick={() => handleUpload(refFile.current)}>
					파일보내기
				</button>
			</div>

			<div className='test-download'>
				<input type='text' id='inputImageFileTitle' ref={refText} />
				<button
					onClick={() => handleDownload(refText.current, setDownload, setImage)}
				>
					파일 받기
				</button>
				{download && <StyledImg urlImage={image} />}
			</div>
		</StyledDiv>
	);
}

export default App;
