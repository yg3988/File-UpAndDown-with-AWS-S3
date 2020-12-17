try {
	var express = require('express');
	var bodyParser = require('body-parser');
	var cors = require('cors');
} catch {
	console.error('Can not import modules...Do you intall required modules???');
	console.log(error);
	process.exit(1);
}

const PORT = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const awsS3 = require('./controller/aws_s3');

app.use('/upload', awsS3);

app.listen(PORT, () => console.log(`Sever running on port ${PORT}`));
