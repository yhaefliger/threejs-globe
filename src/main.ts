import './style.css'

import * as THREE from 'three';
import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/** SIZES */
let SCREEN_WIDTH = window.innerWidth;
let CANVA_SIZE = SCREEN_WIDTH/3;
let EARTH_RADIUS = 25;
 
/** COLORS */
//unused pink (directly in image)
//let PRIMARY_COLOR = new THREE.Color( 0xE28693 );
let SECONDARY_COLOR = new THREE.Color( 0x58A4B0 );

const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( CANVA_SIZE, CANVA_SIZE );

document.querySelector('#scene')?.appendChild( renderer.domElement );

const scene = new THREE.Scene();

//white ambient light
const ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add( ambientLight );

//camera
const camera = new THREE.PerspectiveCamera( 60, 1, 1, 1000 );
camera.position.set( 0, 0, -70 );

//pink satellites
const satellitesGeometry = new THREE.IcosahedronGeometry( 31, 1 );
const satellitesMaterial = new THREE.MeshBasicMaterial( { color: SECONDARY_COLOR, wireframe: true });
const satellites = new THREE.Mesh( satellitesGeometry, satellitesMaterial );
scene.add(satellites);

//earth
const earthGeometry = new THREE.SphereGeometry( EARTH_RADIUS, 32, 32 );
const earthTexture = new THREE.TextureLoader().load( 'textures/watercolor-world-map-sm.jpg' );
const earthMaterial = new THREE.MeshLambertMaterial( { map: earthTexture } );
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
//define start rotation pointing europe :)
earth.rotation.x = 1.3;
earth.rotation.y = 14;
earth.rotation.z = 4.4;
scene.add(earth);

//home mesh
//(manually adjusted coordinates due to rotations and texture complete approximation. :))
const home_lat = 46.99;
const home_lng = 6.78;
//x,y,z calculations
const home_x = (EARTH_RADIUS * Math.cos(home_lng) * Math.sin(home_lat));
const home_y = (EARTH_RADIUS * Math.sin(home_lng) * Math.sin(home_lat));
const home_z = EARTH_RADIUS * Math.cos(home_lat);
const homeMesh = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 20, 20),
  new THREE.MeshBasicMaterial( { color: SECONDARY_COLOR } )
);
homeMesh.position.set(home_x, home_y, home_z);
scene.add(homeMesh);

//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;

window.addEventListener( 'resize', onWindowResize );

animate();

function animate()
{
  requestAnimationFrame( animate );
  
  //satellites rotation
  satellites.rotation.x += 0.001;  
  satellites.rotation.y += 0.0009;  
  satellites.rotation.z += 0.0012;

  controls.update()

  renderer.render( scene, camera );  
}

function onWindowResize()
{
  SCREEN_WIDTH = window.innerWidth;
  CANVA_SIZE = SCREEN_WIDTH/3;

  camera.updateProjectionMatrix();
  
  renderer.setSize(CANVA_SIZE, CANVA_SIZE);

}
