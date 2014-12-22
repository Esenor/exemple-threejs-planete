const _terre = "Terre";
const _nuages = "Nuages";
const _lune = "Lune";
const _pivot = "PivotRotation";
var scene;
var camera;
var renderer;
var id;
/**
 *
 * @param id
 */
function initPlanetMaker(id_input, height_input){
    /* Config générale */
    id = id_input;
    height = height_input;
    var width = document.getElementById(id).offsetWidth;
    var zoom_min = 5;
    var zoom_max = 20;
    var taille_planete = 1.5;
    var taille_lune = 0.2;
    /* initialisation de la scene et de la camera */
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60,width /height, 0.001, 1000);
    var control_utilisateur = new THREE.OrbitControls(camera, document.getElementById(id));
    control_utilisateur.maxDistance = zoom_max;
    control_utilisateur.minDistance = zoom_min;
    control_utilisateur.noPan = true;
    renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setSize( width , height );
    document.getElementById(id).appendChild(renderer.domElement);
    /* Ajout de la skyBox */
    ajouterSkybox(scene);
    /* Ajout d'une source de lumière */
    ajouterLampe(scene);
    /* Ajout de la planete */
    ajouterPlanete(scene, taille_planete);
    /* Ajout de la lune */
    ajouterLune(scene,taille_lune);
    /* Positionnement de la caméra */
    camera.position.z = 8;
    /* Appel de la fonction de mise à jour de la scene */
    render();
}
/**
 *
 * @param scene
 */
function ajouterSkybox(scene){
    /* Texture de la skybox */
    var textures_skybox = [
        'image/textures/skybox/1.jpg',
        'image/textures/skybox/2.jpg',
        'image/textures/skybox/3.jpg',
        'image/textures/skybox/4.jpg',
        'image/textures/skybox/5.jpg',
        'image/textures/skybox/6.jpg'
    ];
    /* Création de la skybox */
    var cube_skybox = THREE.ImageUtils.loadTextureCube(textures_skybox);
    cube_skybox.format = THREE.RGBFormat;
    var shader = THREE.ShaderLib['cube'];
    shader.uniforms['tCube'].value = cube_skybox;
    var skybox_material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });
    skybox = new THREE.Mesh(
        new THREE.CubeGeometry(500, 500, 500),
        skybox_material
    );
    /* Ajout de la skyBox à la scene */
    scene.add(skybox);
}
/**
 *
 * @param scene
 * @param taille_planete
 */
function ajouterPlanete(scene, taille_planete){
    /* Déclaration du material */
    var material_planete = new THREE.MeshPhongMaterial();
    /*  Ajout de la texture au material */
    material_planete.map = THREE.ImageUtils.loadTexture('image/textures/planete/Terre.jpg');
    /* Ajout de la bump texture */
    material_planete.bumpMap = THREE.ImageUtils.loadTexture('image/textures/planete/BumpTerre.jpg');
    /* Réglage du bump */
    material_planete.bumpScale = 0.1;
    /* Ajout du spécular map */
    material_planete.specularMap = THREE.ImageUtils.loadTexture('image/textures/planete/SpecularTerre.jpg');
    /* Réglage du spécular */
    material_planete.specular = new THREE.Color('grey');
    /* Création de la forme de la planete */
    var geometry_planete = new THREE.SphereGeometry(taille_planete,20,20);
    /* Création de l'objet planete */
    var mesh_planete = new THREE.Mesh(geometry_planete, material_planete);
    /* Creation de la forme des nuage de la planete */
    var geometry_nuage  = new THREE.SphereGeometry(taille_planete + 0.06, 32, 32)
    /* Création du material nuage */
    var material_nuage  = new THREE.MeshBasicMaterial();
    material_nuage.map = THREE.ImageUtils.loadTexture('image/textures/planete/Nuages.jpg');
    material_nuage.alphaMap = THREE.ImageUtils.loadTexture('image/textures/planete/Nuages.jpg');
    material_nuage.side = THREE.FrontSide;
    material_nuage.opacity = 0.5;
    material_nuage.transparent = true;
    var mesh_nuages = new THREE.Mesh(geometry_nuage, material_nuage);
    mesh_nuages.name = _nuages;
    /* Ajout des nuages à la planete */
    mesh_planete.add(mesh_nuages);
    mesh_planete.name = _terre;
    /* Ajout de la planete à la scène */
    scene.add(mesh_planete);
}
/**
 *
 * @param scene
 * @param taille_lune
 */
function ajouterLune(scene,taille_lune){
    /* Récupération de la planete */
    var objet_terre = scene.getObjectByName(_terre);
    /* Ajout d'un pivot de rotation au centre de la planete */
    var pivot_rotation = new THREE.Mesh();
    pivot_rotation.name = _pivot;
    pivot_rotation.position = objet_terre.position;
    /* Déclaration material de la lune */
    var material_lune = new THREE.MeshPhongMaterial();
    /* Ajout de la texture */
    material_lune.map = THREE.ImageUtils.loadTexture('image/textures/lune/Lune.jpg');
    /* Ajout de la bump texture */
    material_lune.bumpMap = THREE.ImageUtils.loadTexture('image/textures/lune/BumpLune.jpg');
    /* Réglage du bump */
    material_lune.bumpScale = 0.001;
    var geometry_lune = new THREE.SphereGeometry(taille_lune,20,20);
    var mesh_lune = new THREE.Mesh(geometry_lune, material_lune);
    mesh_lune.position.y += 3.5;
    mesh_lune.name = _lune;
    /* Ajout de la lune au pivot de rotation */
    pivot_rotation.add(mesh_lune);
    /* Ajout du pivot de rotation à la scene */
    scene.add(pivot_rotation);
}
/**
 *
 * @param scene
 */
function ajouterLampe(scene){
    /* Déclaration de la lumière */
    var lumiere_directionelle = new THREE.DirectionalLight(0xffffff);
    lumiere_directionelle.position.set(1, 1, 1).normalize();
    lumiere_directionelle.intensity = 1;
    /* Ajout de la skyBox à la scene */
    scene.add(lumiere_directionelle);
}
/**
 *
 */
function render() {
    requestAnimationFrame(render);
    /* Gestion des dimension de la scene */
    gestionDesDimension();
    /* Gestion des rotations */
    var objet_terre = scene.getObjectByName(_terre);
    objet_terre.rotation.y -= 0.001;
    var objet_nuages = objet_terre.getObjectByName(_nuages);
    objet_nuages.rotation.y -= 0.0002;
    var objet_pivot = scene.getObjectByName(_pivot);
    objet_pivot.rotation.z += 0.0009;
    /* Rendue de la scene */
    renderer.render(scene, camera);

}
/**
 *
 */
function gestionDesDimension(){
    /* Gére les dimension de la div pour le responsive design */
    var width = document.getElementById(id).clientWidth;
    camera.aspect = width / height;
    renderer.setSize( width, height);
    camera.updateProjectionMatrix();
}

