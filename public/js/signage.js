const vidHolder = document.getElementById('vidHolder')
const imgHolder = document.getElementById('imgHolder')

let index = -1

let content = []
// let content = [
//   {
//     type: 'video',
//     src: './testSignageAssets/vid1.mp4',
//     fit: 'cover'
//   },
//   {
//     type: 'img',
//     time: 10,
//     src: './testSignageAssets/img1.png',
//     fit: 'cover'
//   },
//   {
//     type: 'video',
//     src: './testSignageAssets/vid2.mp4',
//     fit: 'fill' // Fill only on video at the moment
//   },
//   {
//     type: 'img',
//     time: 5,
//     src: './testSignageAssets/img2.png',
//     fit: 'contain'
//   },
//   {
//     type: 'video',
//     src: './testSignageAssets/vid3.mp4',
//     fit: 'contain'
//   }
// ]

const processContent = () => {
  try {
    index = index === content.length - 1 ? 0 : index + 1
    let file = content[index]

    if (!file) {
      console.warn('NO FILES')
      if (content.length > 0) {
        index = -1
        return processContent()
      } else {
        console.warn('NO CONTENT')
        imgHolder.classList.add('hidden')
        vidHolder.classList.add('hidden')
        return
      }
    }

    if (file.format === 'mp4') {
      vidHolder.src = file.path

      if (file.fit) {
        vidHolder.style = `object-fit: ${file.fit};`
      }

      vidHolder.play()
      vidHolder.classList.remove('hidden')
      imgHolder.classList.add('hidden')
      if (
        content[index + 1] &&
        ['jpg', 'jpeg', 'png'].indexOf(content[index + 1].format) > -1
      ) {
        // Makes transition between video and image smoother ( I think )
        imgHolder.style = `background-image: url('${content[index + 1].path}');`
      }
    } else if (['jpg', 'jpeg', 'png'].indexOf(file.format) > -1) {
      imgHolder.style = `background-image: url('${file.path}')`

      if (file.fit) {
        vidHolder.style += `background-size: ${file.fit};`
      }

      imgHolder.classList.remove('hidden')
      vidHolder.classList.add('hidden')
      setTimeout(processContent, file.time * 1000)
    } else {
      processContent()
    }
  } catch (e) {
    console.log(e)
  }
}

vidHolder.onended = processContent
processContent()

setTimeout(() => {
  socket.emit('request-saved-state')
  socket.on('current-state', state => {
    const stateContent = state && state.a && state.a.content
    if (stateContent) {
      const previousContentLength = content.length
      content = stateContent.map(file => ({
        ...file,
        path: file.servedPath,
        fit: 'cover'
      }))
      console.log('EL tamano es ' + content.length + ' ksdkds')
      if (previousContentLength === 0 && content.length > 0) {
        processContent()
      }
    }
  })
})
