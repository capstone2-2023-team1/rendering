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
renderer.setClearColor(0x555555); // 회색 배경색 설정
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
/*
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
 */

/*
const loader = new OBJLoader();
loader.load(obj_url, function(object) {
    object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            // 정점 색상 데이터 가져오기
            var geometry = child.geometry;
            var colors = geometry.attributes.color;

            console.log(colors.count);
            // 정점 색상 값을 지정하기 위해 버퍼 속성 생성
            var vertexColors = [];
            for (var i = 0; i < colors.count; i++) {

                var r = colors.getX(i);
                var g = colors.getY(i);
                var b = colors.getZ(i);

                var r = parseInt(colors.getX(i)*255);
                var g = parseInt(colors.getY(i)*255);
                var b = parseInt(colors.getZ(i)*255);

                //geometry.faces[i].vertexColors[i] = new THREE.Color(r, g, b);
                //vertexColors.push(geometry.faces[i].vertexColors[i] );
                vertexColors.push(new THREE.Color(r, g, b));
            }
            console.log(geometry.faces);
            console.log(vertexColors);

            // MeshPhongMaterial을 적용하여 정점 색상 사용
            geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(vertexColors), 3));
            geometry.attributes.color.needsUpdate = true;
            child.material.vertexColors = true;
            //child.material = new THREE.PointsMaterial({ vertexColors: true});
            console.log("세팅완료");
        }
    });

    // 모델 로드 완료 시 처리할 로직
    scene.add(object);
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    animate();
});
*/


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
        sizeAttenuation: true // Enable point size attenuation
    });
    var pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    animate();
});
