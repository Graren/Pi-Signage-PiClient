document.querySelector('body').classList.add('black-bg')
const vidHolder = document.getElementById('vidHolder')
const imgHolder = document.getElementById('imgHolder')
let blockPapus = false
let index = -1

let content = []
// let content = [
//   {
//     type: 'video',
//     src: './testSignageAssets/vid1.mp4',
//     adjustment: 'cover'
//   },
//   {
//     type: 'img',
//     time: 10,
//     src: './testSignageAssets/img1.png',
//     adjustment: 'cover'
//   },
//   {
//     type: 'video',
//     src: './testSignageAssets/vid2.mp4',
//     adjustment: 'fill' // Fill only on video at the moment
//   },
//   {
//     type: 'img',
//     time: 5,
//     src: './testSignageAssets/img2.png',
//     adjustment: 'contain'
//   },
//   {
//     type: 'video',
//     src: './testSignageAssets/vid3.mp4',
//     adjustment: 'contain'
//   }
// ]

const removeLogoBg = () => {
  document.querySelector('body').classList.remove('logo-center-bg')
}

const addLogoBg = () => {
  document.querySelector('body').classList.add('logo-center-bg')
}

let timeout
const processContent = () => {
  try {
    index = index === content.length - 1 ? 0 : index + 1
    let file = content[index]

    if (!file) {
      addLogoBg()
      if (content.length > 0) {
        index = -1
        return processContent()
      } else {
        imgHolder.classList.add('hidden')
        vidHolder.classList.add('hidden')
        return
      }
    }

    removeLogoBg()

    if (file.format === 'mp4') {
      vidHolder.src = file.path
      blockPapus = false
      if (file.adjustment) {
        vidHolder.style = `object-fit: ${file.adjustment};`
      }

      vidHolder.play()
      vidHolder.classList.remove('hidden')
      imgHolder.classList.add('hidden')
      if (
        content[index + 1] &&
        ['jpg', 'jpeg', 'png'].indexOf(content[index + 1].format) > -1
      ) {
        // Makes transition between video and image smoother ( I think )
        imgHolder.style.backgroundImage = `url('${content[index + 1].path}')`
      }
    } else if (['jpg', 'jpeg', 'png'].indexOf(file.format) > -1) {
      vidHolder.pause()
      imgHolder.style.backgroundImage = `url('${file.path}')`

      if (file.adjustment) {
        imgHolder.style.backgroundSize = file.adjustment
      }

      imgHolder.classList.remove('hidden')
      vidHolder.classList.add('hidden')
      timeout = setTimeout(processContent, file.time * 1000)
    } else {
      processContent()
    }
  } catch (e) {
    console.log(e)
  }
}

vidHolder.onended = () => {
  if (!blockPapus) {
    processContent()
  }
}

setTimeout(() => {
  socket.emit('request-saved-state')
  socket.on('current-state', state => {
    const stateContent = state && state.a && state.a.content
    if (stateContent) {
      const previousContentLength = content.length
      content = stateContent.map(file => ({
        ...file,
        path: file.servedPath
      }))
      if (previousContentLength === 0 && content.length > 0) {
        blockPapus = true;
        clearTimeout(timeout)
        processContent()
      } else {
        addLogoBg()
      }
    }
  })
})
