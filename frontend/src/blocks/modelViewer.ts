import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { PageBlock } from '../types.ts'

export interface ModelInfo {
  id: string
  name: string
  subtitle: string
  objPath: string
  mtlPath: string
  tag: string
  description: string
}

export const MODELS_DATA: ModelInfo[] = [
  {
    id: 'golden_ninja',
    name: 'Golden Ninja (Lloyd)',
    subtitle: 'Колекційна серія Ninjago Legacy',
    objPath: '/models/golden_ninja.obj',
    mtlPath: '/models/golden_ninja.mtl',
    tag: 'Ексклюзив ★',
    description:
      'Легендарний Золотий Ніндзя Ллойд у виняткових золотих обладунках із детальним тисненням. Модель з високою деталізацією кожного елемента.',
  },
  {
    id: 'kai_jungle',
    name: 'Kai Jungle Robes',
    subtitle: 'Ninjago: Tournament of Elements',
    objPath: '/models/kai_jungle.obj',
    mtlPath: '/models/kai_jungle.mtl',
    tag: 'Популярне',
    description:
      'Кай у спеціальному бойовому кімоно для джунглів зі стрічками та традиційними вогняними емблемами клану Вогню.',
  },
  {
    id: 'cole_jungle',
    name: 'Cole Jungle Robes',
    subtitle: 'Ninjago: Tournament of Elements',
    objPath: '/models/cole_jungle.obj',
    mtlPath: '/models/cole_jungle.mtl',
    tag: 'Рідкісне',
    description:
      'Коул — майстер стихії Землі в міцному спорядженні для експедицій у тропічні джунглі із захисними накладками.',
  },
]

let activeModelsList: ModelInfo[] = [...MODELS_DATA]

export function renderModelViewerBlock(block?: PageBlock): string {
  if (block?.models && Array.isArray(block.models) && block.models.length > 0) {
    activeModelsList = block.models.map((m: any) => ({
      id: m.modelId || m.id || 'model',
      name: m.name || '',
      subtitle: m.subtitle || '',
      objPath: m.objPath || '',
      mtlPath: m.mtlPath || '',
      tag: m.tag || 'Колекційне',
      description: m.description || '',
    }))
  } else {
    activeModelsList = [...MODELS_DATA]
  }

  const badge = block?.badge || '3D ЕКСПОЗИЦІЯ'
  const title = block?.title || 'Інтерактивна 3D Вітрина Мініфігурок'
  const subtitle =
    block?.subtitle ||
    'Обертайте фігурку на 360°, масштабуйте та роздивляйтесь деталі зі студійним освітленням'

  const tabsHtml = activeModelsList
    .map(
      (m, i) => `
    <button class="model-select-tab ${i === 0 ? 'active' : ''}" data-model-id="${m.id}">
      <span class="model-tab-tag">${m.tag}</span>
      <span class="model-tab-name">${m.name}</span>
    </button>
  `,
    )
    .join('')

  const active = activeModelsList[0] || MODELS_DATA[0]

  return `
    <section class="models-3d-section" id="models-3d">
      <div class="models-3d-header">
        <div class="section-label">${badge}</div>
        <h2 class="section-title">${title}</h2>
        <p class="section-subtitle">${subtitle}</p>
      </div>

      <div class="models-3d-container">
        <div class="models-3d-viewport-wrapper">
          <div id="threejs-canvas-container" class="threejs-canvas-container">
            <div id="model-loading-spinner" class="model-loading-overlay">
              <div class="lego-spinner"></div>
              <div class="loading-text">Завантаження 3D моделі...</div>
            </div>
          </div>
          <div class="models-3d-hint">
            <span><i class="ri-drag-move-2-line"></i> Ліва кнопка — 360° огляд &bull; <i class="ri-zoom-in-line"></i> Коліщатко — зум &bull; <i class="ri-cursor-line"></i> Права кнопка — зміщення</span>
          </div>
        </div>

        <div class="models-3d-info-card">
          <div class="models-tabs-list">
            ${tabsHtml}
          </div>

          <div class="model-details-body" id="model-details-content">
            <div class="model-card-tag" id="active-model-tag">${active.tag}</div>
            <h3 class="model-card-title" id="active-model-name">${active.name}</h3>
            <div class="model-card-series" id="active-model-subtitle">${active.subtitle}</div>
            <p class="model-card-desc" id="active-model-desc">${active.description}</p>

            <div class="model-features-chips">
              <span class="model-chip">✓ 100% Geometry LEGO</span>
              <span class="model-chip">✓ Студійний рендер 3D</span>
              <span class="model-chip">✓ Оригінальні кольори</span>
            </div>

            <div class="model-actions-box">
              <a href="https://t.me/grombricks" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width:100%;text-align:center;">
                <i class="ri-telegram-fill"></i>
                <span>ЗАМОВИТИ В TELEGRAM</span>
                <i class="ri-arrow-right-up-line"></i>
              </a>
              <a href="#directions" class="btn btn-secondary" style="width:100%;text-align:center;margin-top:10px;">
                <span>ОГЛЯНУТИ НАПРЯМКИ</span>
                <i class="ri-arrow-down-line"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

export function initThreeViewer() {
  const container = document.querySelector<HTMLElement>('#threejs-canvas-container')
  if (!container) return

  const getViewportSize = () => {
    const { width, height } = container.getBoundingClientRect()
    return {
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height)),
    }
  }

  const { width, height } = getViewportSize()

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x070b16)

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 5, 20)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const oldCanvas = container.querySelector('canvas')
  if (oldCanvas) oldCanvas.remove()
  renderer.domElement.classList.add('threejs-canvas')
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xf0cf7a, 2.2)
  keyLight.position.set(10, 20, 15)
  keyLight.castShadow = true
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0x4a7ad4, 1.4)
  fillLight.position.set(-15, 10, -10)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xe6bf55, 1.8)
  rimLight.position.set(0, -10, -15)
  scene.add(rimLight)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.2
  controls.maxDistance = 45
  controls.minDistance = 6
  controls.enablePan = true

  const pedestalGeo = new THREE.CylinderGeometry(6, 6.5, 0.6, 64)
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: 0x0c1a38,
    metalness: 0.8,
    roughness: 0.3,
  })
  const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat)
  pedestal.position.y = -4.5
  pedestal.receiveShadow = true
  scene.add(pedestal)

  const ringGeo = new THREE.TorusGeometry(6.05, 0.08, 16, 64)
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xe6bf55,
    metalness: 0.9,
    roughness: 0.2,
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = -4.2
  scene.add(ring)

  let currentModelGroup: THREE.Group | null = null

  function loadModel(modelData: ModelInfo) {
    const spinner = document.querySelector<HTMLElement>('#model-loading-spinner')
    if (spinner) spinner.style.display = 'flex'

    if (currentModelGroup) {
      scene.remove(currentModelGroup)
      currentModelGroup = null
    }

    const mtlLoader = new MTLLoader()
    mtlLoader.load(
      modelData.mtlPath,
      (materials) => {
        materials.preload()
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.load(
          modelData.objPath,
          (object) => {
            const box = new THREE.Box3().setFromObject(object)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())

            const maxDim = Math.max(size.x, size.y, size.z)
            const targetHeight = 8.0
            const scale = targetHeight / (maxDim || 1)
            object.scale.set(scale, scale, scale)

            object.position.x = -center.x * scale
            object.position.y = -box.min.y * scale - 4.2
            object.position.z = -center.z * scale

            object.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true
                child.receiveShadow = true
              }
            })

            currentModelGroup = new THREE.Group()
            currentModelGroup.add(object)
            scene.add(currentModelGroup)

            if (spinner) spinner.style.display = 'none'
          },
          undefined,
          (err) => {
            console.error('Помилка завантаження OBJ:', err)
            if (spinner) spinner.style.display = 'none'
          },
        )
      },
      undefined,
      (err) => {
        console.error('Помилка завантаження MTL:', err)
        const objLoader = new OBJLoader()
        objLoader.load(modelData.objPath, (object) => {
          object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              ;(child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                color: 0xe6bf55,
                metalness: 0.6,
                roughness: 0.4,
              })
            }
          })
          const box = new THREE.Box3().setFromObject(object)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const scale = 8.0 / Math.max(size.x, size.y, size.z)
          object.scale.set(scale, scale, scale)
          object.position.set(-center.x * scale, -box.min.y * scale - 4.2, -center.z * scale)
          currentModelGroup = new THREE.Group()
          currentModelGroup.add(object)
          scene.add(currentModelGroup)
          if (spinner) spinner.style.display = 'none'
        })
      },
    )
  }

  if (activeModelsList.length > 0) {
    loadModel(activeModelsList[0])
  }

  const tabs = document.querySelectorAll('.model-select-tab')
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      tabs.forEach((t) => t.classList.remove('active'))
      const current = e.currentTarget as HTMLElement
      current.classList.add('active')
      const modelId = current.getAttribute('data-model-id')
      const target = activeModelsList.find((m) => m.id === modelId)
      if (target) {
        const tagEl = document.querySelector<HTMLElement>('#active-model-tag')
        const nameEl = document.querySelector<HTMLElement>('#active-model-name')
        const subtitleEl = document.querySelector<HTMLElement>('#active-model-subtitle')
        const descEl = document.querySelector<HTMLElement>('#active-model-desc')

        if (tagEl) tagEl.textContent = target.tag
        if (nameEl) nameEl.textContent = target.name
        if (subtitleEl) subtitleEl.textContent = target.subtitle
        if (descEl) descEl.textContent = target.description

        loadModel(target)
      }
    })
  })

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  function resizeRenderer() {
    const { width: newWidth, height: newHeight } = getViewportSize()
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight, false)
  }

  const resizeObserver = new ResizeObserver(resizeRenderer)
  resizeObserver.observe(container)
  window.addEventListener('orientationchange', resizeRenderer)
  resizeRenderer()
}
