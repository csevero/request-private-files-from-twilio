const fs = require('fs').promises

exports.handler = async function (context, event, callback) {
  const { fileName } = event
  const assets = Runtime.getAssets()

  const assetsPath = {
    'test.json': assets['/test.json'].path,
  }

  if (assetsPath[fileName]) {
    try {
      const fileContent = await fs.readFile(assetsPath[fileName], 'utf8')

      let contentType = 'application/json'
      if (fileName.endsWith('.bin')) {
        contentType = 'application/octet-stream'
      }
      return callback(
        null,
        new Twilio.Response({
          statusCode: 200,
          headers: {
            'Content-Type': contentType,
          },
          body: fileContent,
        }),
      )
    } catch (err) {
      console.log(err)
      return callback(
        null,
        new Twilio.Response({
          statusCode: 500,
          body: err.message,
        }),
      )
    }
  } else {
    return callback(
      null,
      new Twilio.Response({
        statusCode: 400,
        body: 'File not found',
      }),
    )
  }
}
