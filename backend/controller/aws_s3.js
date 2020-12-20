const aws = require('aws-sdk');

//load in the .env file
require('dotenv').config();

aws.config.update({
	region: process.env.AWS_S3_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function upload(req, res) {
	const s3 = new aws.S3();
	const fileName = req.body.fileName;
	const fileType = req.body.fileType;

	//Params
	//Bucket : 버켓 이름+경로,
	//Key : 파일 이름,
	//Expires: 만료시간 default: 900(s) => 15분
	const params = {
		Bucket: `${process.env.AWS_S3_BUCKET_NAME}/jumbo`,
		Key: fileName,
		Expires: 900,
		ContentType: 'image/' + fileType,
		ACL: 'public-read',
	};

	s3.getSignedUrl('putObject', params, (err, data) => {
		if (err) {
			console.log(err);
			return res.json({ sucess: false, error: err });
		}

		const returnData = {
			signedRequest: data,
			url: `https://${params.Bucket}.s3.amazonaws.com/${fileName}`,
		};

		return res.json({ sucess: true, data: { returnData } });
	});
}

function download(req, res) {
	const s3 = new aws.S3();
	const fileName = req.query.fileName;

	const params = {
		Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
		Key: fileName,
	};
	console.log(params);
	s3.getSignedUrl('getObject', params, (err, data) => {
		if (err) {
			return res.json({ sucess: false, error: err });
		}

		return res.json({ sucess: true, data: { signedRequest: data } });
	});
}

module.exports = { upload, download };
