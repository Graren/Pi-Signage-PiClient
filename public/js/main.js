// const vidHolder = document.getElementById('vidHolder');
// const imgHolder = document.getElementById('imgHolder');

// let index = -1;

// const content = [
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
// ];

// const processContent = () => {
//   index = index === content.length - 1 ? 0 : index + 1;
//   const file = content[index];
//   if (file.type === 'video') {
//     vidHolder.src = file.src;

//     if (file.fit) {
//       vidHolder.style = `object-fit: ${file.fit};`;
//     }

//     vidHolder.play();
//     vidHolder.classList.remove('hidden');
//     imgHolder.classList.add('hidden');
//     if (content[index + 1] && content[index + 1].type === 'img') {
//       // Makes transition between video and image smoother ( I think )
//       imgHolder.style = `background-image: url('${content[index + 1].src}');`;
//     }
//   } else if (file.type === 'img') {
//     imgHolder.style = `background-image: url('${file.src}')`;

//     if (file.fit) {
//       vidHolder.style += `background-size: ${file.fit};`;
//     }

//     imgHolder.classList.remove('hidden');
//     vidHolder.classList.add('hidden');
//     setTimeout(processContent, file.time * 1000);
//   }
// };

// vidHolder.onended = processContent;
// processContent();
