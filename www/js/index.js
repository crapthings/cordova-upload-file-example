document.addEventListener('deviceready', startup, false)

function startup() {
  document.querySelector('button').addEventListener('click', getImage, false)
  document.querySelector('#preview').addEventListener('click', getImage, false)
}

function getImage() {
  navigator.camera.getPicture(getImageSuccess, getImageFail, {
    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
    destinationType: Camera.DestinationType.FILE_URI,
  })
}

function getImageSuccess(fileUrl) {
  window.resolveLocalFileSystemURL(fileUrl, function (fileEntry) {
    fileEntry.file(function ({ type: fileType }) {
      uploadFile('http://localhost:3000', { fileUrl, fileType, }, function () {
        const image = document.getElementById('preview')
        image.src = window.Ionic.WebView.convertFileSrc(fileUrl)
      })
    })
  })
}

function getImageFail() {}

function uploadFile(uploadUrl, { fileUrl, fileType, params = {} }, success, fail) {
  const uploadOptions = new FileUploadOptions()
  uploadOptions.fileKey = 'file'
  uploadOptions.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1)
  uploadOptions.mimeType = fileType
  uploadOptions.params = params

  const uploader = new FileTransfer()
  uploader.upload(fileUrl, encodeURI(uploadUrl), success, fail, uploadOptions)
}
