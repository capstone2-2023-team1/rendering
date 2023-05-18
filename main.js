import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const params = getParams();
const obj_url = params['url'];
console.log(obj_url);

function getParams(){
    var url = window.location.search.replace('?','');
    var params = {};
    var urlArray = url.split('&');

    for(var i in urlArray)
    {
        var param = urlArray[i].split('=');
        params[param[0]] = param[1];
    }
    return params;
}

function init(geometry) {
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    function animate() {
        requestAnimationFrame( animate );

        //cube.rotation.x += 0.01;
        //cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    }

    animate();
}
const loader = new OBJLoader();

// load a resource
loader.load(obj_url,(obj) => init(obj.children[0].geometry))
