import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from "three/addons/loaders/MTLLoader";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {load} from "three/addons/libs/opentype.module";
import {BufferGeometry} from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x333333); // 회색 배경색 설정
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Ambient Light(전역 조명) 추가
var ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Directional Light(직사광) 추가
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

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


console.log("load start");
var loader = new OBJLoader();
loader.load(obj_url, function(object) {

    var geometry = new BufferGeometry();
    var positions = [];
    var colors = [];

    object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            var mesh = child;
            var meshPositions = mesh.geometry.attributes.position.array;
            var meshColors = mesh.geometry.attributes.color.array;

            for (var i = 0; i < meshPositions.length; i += 3) {
                positions.push(meshPositions[i], meshPositions[i + 1], meshPositions[i + 2]);
                colors.push(meshColors[i], meshColors[i + 1], meshColors[i + 2]);
            }
        }
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    var material = new THREE.PointsMaterial({
        vertexColors: true,
        size:0.02,
        sizeAttenuation: true,// Enable point size attenuation
        flatShading: false // Enable smooth shading
    });
    var pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    animate();
}, function(xhr) {
    console.log("loading..");
});

console.log("load end");