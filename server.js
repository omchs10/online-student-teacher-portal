const express=require('express');
const path = require('path')
const { get } = require('request')
const upload = require('express-fileupload')
var fs = require("fs");


const app=express();

app.use(express.json())
app.use(upload())
app.use(express.urlencoded({ extended: true }))


app.set('view engine', 'ejs');

app.set('view engine', 'html');

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static('public'))
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, '../images')))
app.use(express.static(path.join(__dirname, '../media')))
app.use(express.static(path.join(__dirname, '../../weights')))
app.use(express.static(path.join(__dirname, '../../dist')))



app.get('/',(req,res)=>{
res.render('./index.ejs');
});
app.post('/submit', (req, res) => {
   res.render('./test_submitted.ejs')
});
app.get('/test',(req,res)=>{
  console.log("full screen clicked");
  res.render('./main.ejs');
});



app.get('/video', (req, res) => res.sendFile(path.join(viewsDir, 'video.html')))



app.get('/gz',(req,res)=>{
  console.log("calibration ON");
  res.render('./gz.ejs');
});


app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})
app.post('/', async (req, res) => {
if(req.files){
console.log(req.files.foo);
}
else
{
console.log("File not found");
}
})









app.listen(8000, () => console.log('server started!'))

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}
