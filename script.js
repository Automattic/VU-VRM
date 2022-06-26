// setup

  //expression setup
var expressionyay = 0;
var expressionoof = 0;
var expressionlimityay = 0.5;
var expressionlimitoof = 0.5;
var expressionease = 100;
var expressionintensity = 0.75;

  //interface values
if (localStorage.localvalues) {
  var initvalues = true;
  var mouththreshold = Number(localStorage.mouththreshold) ;
  var mouthboost = Number(localStorage.mouthboost) ;
  var bodythreshold = Number(localStorage.bodythreshold) ;
  var bodymotion = Number(localStorage.bodymotion) ;
  var expression = Number(localStorage.expression) ;
} else {
  var mouththreshold = 10;
  var mouthboost = 10;
  var bodythreshold = 10;
  var bodymotion = 10;
  var expression = 80;
}

// setup three-vrm

// renderer
const renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true ,powerPreference: "low-power" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// camera
const camera = new THREE.PerspectiveCamera( 30.0, window.innerWidth / window.innerHeight, 0.1, 20.0 );
camera.position.set(0.0, 1.45, 0.75);

// camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0.0, 1.45, 0.0);
controls.update();

// scene
const scene = new THREE.Scene();

// light
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);

// lookat target
const lookAtTarget = new THREE.Object3D();
camera.add(lookAtTarget);

// gltf and vrm
let currentVrm = undefined;
const loader = new THREE.GLTFLoader();

function load( url ) {

loader.crossOrigin = 'anonymous';
loader.load(

url,

( gltf ) => {

//THREE.VRMUtils.removeUnnecessaryVertices( gltf.scene ); Vroid VRM can't handle this for some reason
THREE.VRMUtils.removeUnnecessaryJoints( gltf.scene );

THREE.VRM.from( gltf ).then( ( vrm ) => {

if ( currentVrm ) {

 scene.remove( currentVrm.scene );
 currentVrm.dispose();

}

currentVrm = vrm;
scene.add( vrm.scene );

vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.Hips ).rotation.y = Math.PI;
vrm.springBoneManager.reset();

  // un-T-pose

    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.RightUpperArm
    ).rotation.z = 250;
  
            vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.RightLowerArm
    ).rotation.z = -0.2;

    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.LeftUpperArm
    ).rotation.z = -250;
 
    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.LeftLowerArm
    ).rotation.z = 0.2;

  // randomise init positions

    function randomsomesuch() {
      return (Math.random() - 0.5) / 10;
    }

    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Head
    ).rotation.x = randomsomesuch();
    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Head
    ).rotation.y = randomsomesuch();
    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Head
    ).rotation.z = randomsomesuch();

    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Neck
    ).rotation.x = randomsomesuch();
    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Neck
    ).rotation.y = randomsomesuch();
    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Neck
    ).rotation.z = randomsomesuch();

    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Spine
    ).rotation.x = randomsomesuch();
    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Spine
    ).rotation.y = randomsomesuch();
    vrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName.Spine
    ).rotation.z = randomsomesuch();

    vrm.lookAt.target = lookAtTarget;
    vrm.springBoneManager.reset();

    console.log(vrm);
        } );

      },

      ( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),

      ( error ) => console.error( error )

    );

  }

// beware of CORS errors when using this locally. If you can't https, import the required libraries.
load( 'https://automattic.github.io/VU-VRM/assets/VU-VRM-elf.vrm' );

// grid / axis helpers
//			const gridHelper = new THREE.GridHelper( 10, 10 );
//			scene.add( gridHelper );
//			const axesHelper = new THREE.AxesHelper( 5 );
//			scene.add( axesHelper );

// animate

const clock = new THREE.Clock();

function animate() {
requestAnimationFrame(animate);

const deltaTime = clock.getDelta();

if (currentVrm) {
  // update vrm
  currentVrm.update(deltaTime);
}

renderer.render(scene, camera);
}

animate();

// mic listener - get a value
navigator.mediaDevices
.getUserMedia({
  audio: true
})
.then(
  function (stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(256, 1, 1);

    analyser.smoothingTimeConstant = 0.5;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    javascriptNode.onaudioprocess = function () {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var values = 0;

      var length = array.length;
      for (var i = 0; i < length; i++) {
        values += array[i];
      }

      // audio in expressed as one number
      var average = values / length;
      var inputvolume = average;
      
      // audio in spectrum expressed as array
      // console.log(array.toString());
      // useful for mouth shape variance
      
      // move the interface slider
              document.getElementById("inputlevel").value = inputvolume;



// mic based / endless animations (do stuff)

      if (currentVrm != undefined){ //best to be sure

// talk

if (talktime == true){
// todo: more vowelshapes
         var voweldamp = 53;
         var vowelmin = 12;
         if (inputvolume > (mouththreshold * 2)) {
           currentVrm.blendShapeProxy.setValue(
             THREE.VRMSchema.BlendShapePresetName.A,
             (
              (average - vowelmin) / voweldamp) * (mouthboost/10)
           );
         
}else{
currentVrm.blendShapeProxy.setValue(
   THREE.VRMSchema.BlendShapePresetName.A, 0
);
}}


// move body

      // todo: replace with ease-to-target behaviour 
      var damping = 750/(bodymotion/10);
      var springback = 1.001;

      if (average > (1 * bodythreshold)) {
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Head
        ).rotation.x += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Head
        ).rotation.x /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Head
        ).rotation.y += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Head
        ).rotation.y /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Head
        ).rotation.z += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Head
        ).rotation.z /= springback;

        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Neck
        ).rotation.x += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Neck
        ).rotation.x /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Neck
        ).rotation.y += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Neck
        ).rotation.y /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Neck
        ).rotation.z += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.Neck
        ).rotation.z /= springback;

        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.UpperChest
        ).rotation.x += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.UpperChest
        ).rotation.x /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.UpperChest
        ).rotation.y += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.UpperChest
        ).rotation.y /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.UpperChest
        ).rotation.z += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.UpperChest
        ).rotation.z /= springback;

        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.RightShoulder
        ).rotation.x += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.RightShoulder
        ).rotation.x /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.RightShoulder
        ).rotation.y += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.RightShoulder
        ).rotation.y /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.RightShoulder
        ).rotation.z += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.RightShoulder
        ).rotation.z /= springback;

        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.LeftShoulder
        ).rotation.x += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.LeftShoulder
        ).rotation.x /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.LeftShoulder
        ).rotation.y += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.LeftShoulder
        ).rotation.y /= springback;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.LeftShoulder
        ).rotation.z += (Math.random() - 0.5) / damping;
        currentVrm.humanoid.getBoneNode(
          THREE.VRMSchema.HumanoidBoneName.LeftShoulder
        ).rotation.z /= springback;

      }

// yay/oof expression drift
expressionyay += (Math.random() - 0.5) / expressionease;
if(expressionyay > expressionlimityay){expressionyay=expressionlimityay};
if(expressionyay < 0){expressionyay=0};
currentVrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Fun, expressionyay);
expressionoof += (Math.random() - 0.5) / expressionease;
if(expressionoof > expressionlimitoof){expressionoof=expressionlimitoof};
if(expressionoof < 0){expressionoof=0};
currentVrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Angry, expressionoof);
    
    }





      //look at camera is more efficient on blink
lookAtTarget.position.x = camera.position.x;
lookAtTarget.position.y = ((camera.position.y-camera.position.y-camera.position.y)/2)+0.5;

    }; // end fn stream
  },
  function (err) {
    console.log("The following error occured: " + err.name);
  }
);


// blink

function blink() {
var blinktimeout = Math.floor(Math.random() * 250) + 50;
lookAtTarget.position.y =
  camera.position.y - camera.position.y * 2 + 1.25;
  
setTimeout(() => {
  currentVrm.blendShapeProxy.setValue(
    THREE.VRMSchema.BlendShapePresetName.BlinkL,
    0
  );
  currentVrm.blendShapeProxy.setValue(
    THREE.VRMSchema.BlendShapePresetName.BlinkR,
    0
  );
}, blinktimeout);

currentVrm.blendShapeProxy.setValue(
  THREE.VRMSchema.BlendShapePresetName.BlinkL,
  1
);
currentVrm.blendShapeProxy.setValue(
  THREE.VRMSchema.BlendShapePresetName.BlinkR,
  1
);
}



// loop blink timing
(function loop() {
var rand = Math.round(Math.random() * 10000) + 1000;
setTimeout(function () {
  blink();
  loop();
}, rand);
})();

// drag and drop + file handler
window.addEventListener( 'dragover', function( event ) {
event.preventDefault();
} );

window.addEventListener( 'drop', function( event ) {
event.preventDefault();

// read given file then convert it to blob url
const files = event.dataTransfer.files;
if ( !files ) { return; }
const file = files[0];
if ( !file ) { return; }
const blob = new Blob( [ file ], { type: "application/octet-stream" } );
const url = URL.createObjectURL( blob );
 load( url );
} );


// handle window resizes


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
// interface handling

var talktime = true;

function interface() {

  if (initvalues == true){
  if (localStorage.localvalues) {
    initvalues = false;
    document.getElementById("mouththreshold").value = mouththreshold;
    document.getElementById("mouthboost").value = mouthboost;
    document.getElementById("bodythreshold").value = bodythreshold;
    document.getElementById("bodymotion").value = bodymotion;
    document.getElementById("expression").value = expression;
  }}

    mouththreshold = document.getElementById("mouththreshold").value;
    mouthboost = document.getElementById("mouthboost").value;
    bodythreshold = document.getElementById("bodythreshold").value;
    bodymotion = document.getElementById("bodymotion").value;

    expression = document.getElementById("expression").value;
    expressionlimityay = (expression);
    expressionlimitoof = (100 - expression); 
    expressionlimityay = expressionlimityay/100;
    expressionlimitoof = expressionlimitoof/100;
    expressionlimityay = expressionlimityay*expressionintensity;
    expressionlimitoof = expressionlimitoof*expressionintensity;    

    console.log("Expression " + expressionyay + " yay / " + expressionoof + " oof");
    console.log("Expression mix " + expressionlimityay + " yay / " + expressionlimitoof + " oof");

    // store it too
    localStorage.localvalues = 1;
    localStorage.mouththreshold = mouththreshold;
    localStorage.mouthboost = mouthboost;
    localStorage.bodythreshold = bodythreshold;
    localStorage.bodymotion = bodymotion;
    localStorage.expression = expression;

}

// click to dismiss non-vrm divs
  function hideinterface() {

  var a = document.getElementById("backplate");
  var b = document.getElementById("interface");
  var x = document.getElementById("infobar");
  var y = document.getElementById("credits");
  a.style.display = "none";
  b.style.display = "none";
  x.style.display = "none";
  y.style.display = "none";

  }

// click to dismiss non-interface divs
function hideinfo() {

  var a = document.getElementById("backplate");
  var x = document.getElementById("infobar");
  var y = document.getElementById("credits");
  a.style.display = "none";
  x.style.display = "none";
  y.style.display = "none";

  }

// load file from user picker
  function dofile(){
  var file = document.querySelector('input[type=file]').files[0];
  if ( !file ) { return; }
  const blob = new Blob( [ file ], { type: "application/octet-stream" } );
  const url = URL.createObjectURL( blob );
   load( url );
  }
// end

// wait to trigger interface and load init values

setTimeout(() => {  interface(); }, 500);

//ok
