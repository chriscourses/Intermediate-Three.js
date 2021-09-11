import './tailwind.css'
import gsap from 'gsap'
import * as THREE from 'three'
import countries from './countries.json'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

console.log(countries)

const canvasContainer = document.querySelector('#canvasContainer')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('canvas')
})
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./img/globe.jpeg')
      }
    }
  })
)

// create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const starVertices = []
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -Math.random() * 3000
  starVertices.push(x, y, z)
}

starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starVertices, 3)
)

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

camera.position.z = 15

function createBox({ lat, lng, country, population }) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.8),
    new THREE.MeshBasicMaterial({
      color: '#3BF7FF',
      opacity: 0.4,
      transparent: true
    })
  )

  // 23.6345° N, 102.5528° W = mexico
  const latitude = (lat / 180) * Math.PI
  const longitude = (lng / 180) * Math.PI
  const radius = 5

  const x = radius * Math.cos(latitude) * Math.sin(longitude)
  const y = radius * Math.sin(latitude)
  const z = radius * Math.cos(latitude) * Math.cos(longitude)

  box.position.x = x
  box.position.y = y
  box.position.z = z

  box.lookAt(0, 0, 0)
  box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4))

  group.add(box)

  gsap.to(box.scale, {
    z: 1.4,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'linear',
    delay: Math.random()
  })
  // box.scale.z =

  box.country = country
  box.population = population
}

function createBoxes(countries) {
  countries.forEach((country) => {
    const scale = country.population / 1000000000
    const lat = country.latlng[0]
    const lng = country.latlng[1]
    const zScale = 0.8 * scale

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(0.1, 0.2 * scale),
        Math.max(0.1, 0.2 * scale),
        Math.max(zScale, 0.4 * Math.random())
      ),
      new THREE.MeshBasicMaterial({
        color: '#3BF7FF',
        opacity: 0.4,
        transparent: true
      })
    )

    // 23.6345° N, 102.5528° W = mexico
    const latitude = (lat / 180) * Math.PI
    const longitude = (lng / 180) * Math.PI
    const radius = 5

    const x = radius * Math.cos(latitude) * Math.sin(longitude)
    const y = radius * Math.sin(latitude)
    const z = radius * Math.cos(latitude) * Math.cos(longitude)

    box.position.x = x
    box.position.y = y
    box.position.z = z

    box.lookAt(0, 0, 0)
    box.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0, 0, -zScale / 2)
    )

    group.add(box)

    gsap.to(box.scale, {
      z: 1.4,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'linear',
      delay: Math.random()
    })
    // box.scale.z =

    box.country = country.name
    box.population = new Intl.NumberFormat().format(country.population)
  })
}

createBoxes(countries)

// createBox({
//   lat: 23.6345,
//   lng: -102.5528,
//   country: 'Mexico',
//   population: '127.6 million'
// })
// createBox({
//   lat: -14.235,
//   lng: -51.9253,
//   country: 'Brazil',
//   population: '211 million'
// })
// createBox({
//   lat: 20.5937,
//   lng: 78.9629,
//   country: 'India',
//   population: '1.366 billion'
// })
// createBox({
//   lat: 35.8617,
//   lng: 104.1954,
//   country: 'China',
//   population: '1.398 billion'
// })
// createBox({
//   lat: 37.0902,
//   lng: -95.7129,
//   country: 'USA',
//   population: '328.2 million'
// })

sphere.rotation.y = -Math.PI / 2

const mouse = {
  x: undefined,
  y: undefined
}

console.log(group.children)

const raycaster = new THREE.Raycaster()
const popUpEl = document.querySelector('#popUpEl')
const populationEl = document.querySelector('#populationEl')
const populationValueEl = document.querySelector('#populationValueEl')

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  group.rotation.y += 0.002

  // if (mouse.x) {
  //   gsap.to(group.rotation, {
  //     x: -mouse.y * 1.8,
  //     y: mouse.x * 1.8,
  //     duration: 2
  //   })
  // }

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(
    group.children.filter((mesh) => {
      return mesh.geometry.type === 'BoxGeometry'
    })
  )

  group.children.forEach((mesh) => {
    mesh.material.opacity = 0.4
  })

  gsap.set(popUpEl, {
    display: 'none'
  })

  for (let i = 0; i < intersects.length; i++) {
    const box = intersects[i].object
    box.material.opacity = 1
    gsap.set(popUpEl, {
      display: 'block'
    })

    populationEl.innerHTML = box.country

    populationValueEl.innerHTML = box.population
  }

  renderer.render(scene, camera)
}
animate()

addEventListener('mousemove', (event) => {
  mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1

  gsap.set(popUpEl, {
    x: event.clientX,
    y: event.clientY
  })

  // console.log(mouse)
})
